const express = require('express');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const { Configuration, OpenAIApi } = require('openai');
const path = require('path');

dotenv.config();

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY
});
const openai = new OpenAIApi(configuration);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static('public'));
app.use(bodyParser.json());
const chatHistory = {};
app.post('/api/message', async (req, res) => {
  try {
    const sessionId = req.body.sessionId;
    const message = req.body.message;

    if (!chatHistory[sessionId]) {
      chatHistory[sessionId] = [];
    }

    chatHistory[sessionId].push({ role: 'user', content: message });

    let messagesText = chatHistory[sessionId].map(m => m.content).join('');
    while (messagesText.length > 2048) {
      chatHistory[sessionId].shift();
      messagesText = chatHistory[sessionId].map(m => m.content).join('');
    }
    
    const completion = await openai.createChatCompletion({
      model: 'gpt-3.5-turbo',
      messages: chatHistory[sessionId],
    });

    const reply = completion.data.choices[0].message.content.trim();
    chatHistory[sessionId].push({ role: 'assistant', content: reply });
    res.json({ reply });

  } catch (error) {
    console.error('Error:', error.response ? error.response.data : error);
    res.status(500).json({ error: 'An error occurred while processing your request.' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
app.get('/excel', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/excel.html'));
});
