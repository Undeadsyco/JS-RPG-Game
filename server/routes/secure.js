import express from 'express';

const router = express.Router();
const chatModel = require('../models/chat');

router.post('/chat', async (req, res) => {
  if (!req.body || !req.body.message) {
    res.status(400).json({ message: 'invalid body', status: 400 });
  } else {
    const { message } = req.body;
    const { email } = req.user;
    const chat = await chatModel.create({ email, message });
    res.status(200).json({ chat, message: 'message sent', status: 200 });
  }
});

export default router;
