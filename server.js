const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Load API key from .env
const envFile = fs.readFileSync('.env', 'utf8');
const apiKey = envFile.match(/ANTHROPIC_API_KEY=(.+)/)[1].trim();

app.post('/api/turn', async (req, res) => {
  const { messages, systemPrompt } = req.body;

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-6',
        max_tokens: 1024,
        system: systemPrompt,
        messages: messages
      })
    });

    const data = await response.json();
console.log('API RESPONSE:', JSON.stringify(data, null, 2));
res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'API call failed' });
  }
});

app.listen(3000, () => {
  console.log('Adventure game running at http://localhost:3000');
});