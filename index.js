const express = require('express');
const cors = require('cors');
const { StreamChat } = require('stream-chat');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;
app.use(cors());

const apiKey = process.env.STREAM_API_KEY;
const apiSecret = process.env.STREAM_API_SECRET;
const chatClient = StreamChat.getInstance(apiKey, apiSecret);

app.get('/api/token/:userId', (req, res) => {
  const userId = req.params.userId;
  if (!userId) {
    return res.status(400).send('Missing userId parameter');
  }

  try {
    const chatToken = chatClient.createToken(userId);

    // Generate a token for Stream Video
    const videoToken = jwt.sign(
      { user_id: userId },
      apiSecret,
      { algorithm: 'HS256', expiresIn: '24h' }
    );

    res.json({ chatToken, videoToken });
  } catch (error) {
    console.error('Error generating tokens:', error);
    res.status(500).send('Internal Server Error');
  }
});

app.listen(port, () => {
  console.log(`Token server listening at http://localhost:${port}`);
});
