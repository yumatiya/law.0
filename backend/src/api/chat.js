const express = require('express');
const router = express.Router();
const cors = require('cors');

// Mock database interface (replace with real DB integration)
const chatMessages = new Map(); // userId -> array of messages

// Enable CORS for frontend domain (example assumes localhost:3000)
router.use(cors({
  origin: 'http://localhost:3000',
  methods: ['GET', 'POST'],
}));

// Util: simulate sending message to Claude API via OpenRouter
async function sendToClaude(message, mode) {
  // Implement integration with real Claude or compatible API here
  // For now, echo the message and mode with delay
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(`AI reply to "${message}" in mode "${mode}"`);
    }, 500);
  });
}

// POST /send - send user message to AI and save chat
router.post('/send', async (req, res) => {
  try {
    const { userId, message, mode } = req.body;
    if (!userId || !message || !mode) {
      return res.status(400).json({ error: 'Missing userId, message or mode' });
    }

    // Save user message to DB (mock)
    if (!chatMessages.has(userId)) {
      chatMessages.set(userId, []);
    }
    const userChat = chatMessages.get(userId);
    const timestamp = new Date().toISOString();
    const userMessage = { sender: 'user', text: message, time: timestamp };
    userChat.push(userMessage);

    // Send to Claude API
    const reply = await sendToClaude(message, mode);

    // Save AI response
    const responseMessage = { sender: 'ai', text: reply, time: new Date().toISOString() };
    userChat.push(responseMessage);

    // Return response
    res.json({
      reply,
      messageId: responseMessage.time,
      timestamp: responseMessage.time,
    });
  } catch (error) {
    console.error('Chat send error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /history - get last 50 messages for user
router.get('/history', (req, res) => {
  try {
    const userId = req.query.userId;
    if (!userId) {
      return res.status(400).json({ error: 'Missing userId query parameter' });
    }
    const userChat = chatMessages.get(userId) || [];
    const last50 = userChat.slice(-50);
    res.json({ messages: last50 });
  } catch (error) {
    console.error('Chat history error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
