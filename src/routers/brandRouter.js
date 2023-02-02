const express = require("express");
const brandController = require("../controllers/brandController");
const checkRole = require("../middleware/checkRoleMiddleware");
const router = express();

router.get("/", checkRole("ADMIN"), brandController.getAll);
router.post("/", brandController.create);

module.exports = router;
