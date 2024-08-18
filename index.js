// index.js
const express = require('express');
const { Configuration, OpenAIApi } = require('openai');

const app = express();
app.use(express.json());

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

app.post('/api/chat', async (req, res) => {
  const { prompt } = req.body;

  try {
    const response = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: "You are a sarcastic and playful assistant." },
        { role: "user", content: prompt }
      ],
      max_tokens: 100,
      temperature: 0.7,
    });
    
    res.json({ response: response.data.choices[0].message.content });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = app;
