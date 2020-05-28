const router = require("express").Router();
const { WebhookController } = require("../controllers");

router.get("/webhook", WebhookController.getting);
router.post("/webhook", WebhookController.posting);

module.exports = router;