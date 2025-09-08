const express = require("express");
const router = express.Router();
const chatbotController = require("../controllers/chatbotController");

router.get("/", chatbotController.getChatbotPage);

// ✅ frontend should call this always
router.post("/message", chatbotController.sendMessage);

router.post("/analyze", chatbotController.analyzeMessage);

// router.post("/message", chatbotController.sendMessage);
router.post("/voice", chatbotController.sendVoiceMessage);

module.exports = router;
