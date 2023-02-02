const express = require("express");
const checkRole = require("../middleware/checkRoleMiddleware");
const typeController = require("../controllers/typeController");
const router = express();

router.get("/", typeController.getAll);
router.post("/", checkRole("ADMIN"), typeController.create);

module.exports = router;
