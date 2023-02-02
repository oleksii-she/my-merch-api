const express = require("express");

/// routers

const userRouter = require("./userRouter");
const typeRouter = require("./typeRouter");
const brandRouter = require("./brandRouter");
const productRouter = require("./productRouter");

const router = express();

router.use("/users", userRouter);
router.use("/types", typeRouter);
router.use("/brands", brandRouter);
router.use("/products", productRouter);

module.exports = router;
