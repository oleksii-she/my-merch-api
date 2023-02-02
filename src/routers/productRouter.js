const express = require("express");

const productController = require("../controllers/productController");
const checkRole = require("../middleware/checkRoleMiddleware");
const router = express();

router.post("/", checkRole("ADMIN"), productController.create);
router.get("/", productController.getAll);
router.get("/:id", productController.getOne);

module.exports = router;
