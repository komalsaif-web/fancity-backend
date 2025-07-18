const axios = require('axios');
require('dotenv').config();

const GROQ_API_KEY = process.env.GROQ_API_KEY;

const askGroq = async (prompt) => {
  try {
    const res = await axios.post(
      'https://api.groq.com/openai/v1/chat/completions',
      {
        model: 'llama3-70b-8192',
        messages: [{ role: 'user', content: prompt }],
      },
      {
        headers: {
          Authorization: `Bearer ${GROQ_API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    return res.data.choices[0].message.content;
  } catch (error) {
    console.error('GROQ error:', error.message);
    return 'AI error occurred.';
  }
};

module.exports = { askGroq };
