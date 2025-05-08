const express = require('express');
const asyncHandle = require('../../helper/asyncHandle');
const ChatbotPromptController = require('../../controllers/ChatbotPromptController');
const router = express.Router();

router.get('/prompt', asyncHandle(ChatbotPromptController.getPrompt));

module.exports = router;
