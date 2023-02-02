require("dotenv").config();
const path = require("path");
const express = require("express");
const cors = require("cors");
const sequelize = require("./db");
const router = require("./src/routers/index");
const models = require("./src/models/models");
const errorHandler = require("./src/middleware/errorHandlingMiddleware");
const fileUpload = require("express-fileupload");

const app = express();

const PORT = process.env.PORT || 7000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.resolve(__dirname, "./src/", "static")));
// реєстрація файл завантажника
app.use(fileUpload({}));

app.use("/api", router);

//обробник помилок
app.use(errorHandler);
const start = async () => {
  try {
    await sequelize.authenticate();
    await sequelize.sync(); // звіряє базу зі схемою
    app.listen(PORT, () => {
      console.log(`Server running. Use our API on port: ${PORT}`);
    });
  } catch (error) {
    console.log(error);
  }
};

start();
