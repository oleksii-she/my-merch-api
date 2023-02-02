const { Type } = require("../models/models");
const ApiError = require("../error/apiError");

class TypeController {
  async create(req, res) {
    const { name } = req.body;
    const type = await Type.create({ name });
    return res.status(201).json(type);
  }
  async getAll(req, res) {
    const types = await Type.findAll();
    res.json(types);
  }
}

module.exports = new TypeController();
