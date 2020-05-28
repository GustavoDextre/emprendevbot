const router = require("express").Router();
const { MainController } = require("../controllers");

router.get("/", MainController.index);

module.exports = router;