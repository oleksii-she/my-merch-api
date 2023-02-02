const uuid = require("uuid");
const path = require("path");
const { Product, ProductInfo } = require("../models/models");
const ApiError = require("../error/apiError");
const { json } = require("sequelize");

class ProductController {
  async create(req, res, next) {
    try {
      const { name, price, brandId, typeId, info } = req.body;
      const { img } = req.files;

      // створюю назву для картинки
      let fileName = uuid.v4() + ".jpeg";
      // описую шлях для статичної папки
      img.mv(path.resolve(__dirname, "..", "static", fileName));

      const product = await Product.create({
        name,
        price,
        brandId,
        typeId,
        info,
        img: fileName,
      });

      if (info) {
        info = JSON.parse(info);
        info.forEach((i) =>
          ProductInfo.create({
            title: i.title,
            description: i.description,
            productId: product.id,
          })
        );
      }

      return res.status(201).json(product);
    } catch (error) {
      next(ApiError.badRequest(error.message));
    }
  }
  async getAll(req, res, next) {
    try {
      let { brandId, typeId, limit, page } = req.query;
      //якщо не вказаний ліміт чи пейдж, то підставляємо дефолтне значення
      page = page || 1;
      limit = limit || 9;
      let offset = page * limit - limit;
      let products;
      if (!brandId && !typeId) {
        products = await Product.findAndCountAll({ limit, offset });
      }
      if (brandId && !typeId) {
        products = await Product.findAndCountAll({
          where: { brandId },
          limit,
          offset,
        });
      }
      if (!brandId && typeId) {
        products = await Product.findAndCountAll({
          where: { typeId },
          limit,
          offset,
        });
      }
      if (brandId && typeId) {
        products = await Product.findAndCountAll({
          where: { typeId, brandId },
          limit,
          offset,
        });
      }
      return res.json(products);
    } catch (error) {
      next(ApiError.badRequest(error.message));
    }
  }
  async getOne(req, res, next) {
    try {
      const { id } = req.params;
      console.log(id);
      const product = await Product.findOne({
        where: { id },
        include: [{ model: ProductInfo, as: "info" }],
      });

      return res.json(product);
    } catch (error) {
      next(ApiError.badRequest(error.message));
    }
  }
}

module.exports = new ProductController();
