const { User, Basket } = require("../models/models");
const ApiError = require("../error/apiError");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// функція яка буде генерувати token
const generateJwt = (id, email, role) => {
  return jwt.sign({ id, email, role }, process.env.SECRET_KEY, {
    expiresIn: "24h",
  });
};

class UserController {
  async registration(req, res, next) {
    try {
      const { email, password, role } = req.body;

      if (!email || !password) {
        return next(ApiError.badRequest("Incorrect email or password"));
      }
      // перевірка на електронну пошту, чи є вона в базі
      const candidate = await User.findOne({ where: { email } });
      // перевірка на існування юзера
      if (candidate) {
        return next(
          ApiError.badRequest("A user with this email already exists")
        );
      }
      // якщо все добре, до хешуємо пароль
      const hashPassword = await bcrypt.hash(password, 10);

      // створюємо користувача
      const user = await User.create({ email, password: hashPassword, role });
      // створюємо кошик, та передаємо для нього айді нашого згенерованого користувача
      const basket = await Basket.create({ userId: user.id });

      const token = generateJwt(user.id, email, user.role);
      return res.status(201).json({ token });
    } catch (error) {
      return next(ApiError.badRequest(error.massage));
    }
  }
  async login(req, res, next) {
    try {
      const { email, password } = req.body;

      const user = await User.findOne({ where: { email } });
      if (!user) {
        return next(
          ApiError.internal("User with this email address was not found")
        );
      }

      let comparePassword = bcrypt.compareSync(password, user.password);

      if (!comparePassword) {
        ApiError.internal("Invalid login or password");
      }

      const token = generateJwt(user.id, user.email, user.role);

      return res.json({ token });
    } catch (error) {
      return next(ApiError.badRequest(error.massage));
    }
  }
  async check(req, res, next) {
    // const { id } = req.query;
    // if (!id) {
    //   return next(ApiError.badRequest("Not given id "));
    // }
    // res.json(id);
    try {
      const token = generateJwt(req.user.id, req.user.email, req.user.role);
      return res.json({ token });
    } catch (error) {}
  }
}

module.exports = new UserController();
