const express = require('express');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const { Configuration, OpenAIApi } = require('openai');

dotenv.config();

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY
});
const openai = new OpenAIApi(configuration);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static('public'));
app.use(bodyParser.json());

app.post('/api/message', async (req, res) => {
    try {
      const message = req.body.message;
  
      const completion = await openai.createChatCompletion({
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: message }],
      });
  
      const reply = completion.data.choices[0].message.content.trim();
      res.json({ reply });
  
    } catch (error) {
        console.error('Error:', error.response ? error.response.data : error);
        res.status(500).json({ error: 'An error occurred while processing your request.' });
      }
  });  

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
