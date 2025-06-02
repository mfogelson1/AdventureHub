const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const axios = require('axios');
const cors = require('cors');
require('dotenv').config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST']
  }
});

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3001;

io.on('connection', (socket) => {
  console.log('A user connected');

  socket.on('user_message', async (data) => {
    io.emit('chat_message', { sender: data.sender, text: data.text });

    try {
      const response = await axios.post(
        'https://api.openai.com/v1/chat/completions',
        {
          model: 'gpt-4o',
          messages: [
            { role: 'system', content: 'You are a helpful, witty, and fair game master for a real-time group chat adventure.' },
            { role: 'user', content: data.text }
          ],
          temperature: 0.8
        },
        {
          headers: {
            'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
            'Content-Type': 'application/json'
          }
        }
      );

      const aiText = response.data.choices[0].message.content;
      io.emit('chat_message', { sender: 'GM', text: aiText });
} catch (error) {
  console.error('🔴 OpenAI API error:');
  if (error.response) {
    console.error('Status:', error.response.status);
    console.error('Data:', error.response.data);
  } else {
    console.error(error.message);
  }
  io.emit('chat_message', { sender: 'GM', text: 'Sorry, something went wrong with the AI response.' });
}

  });
});

server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
