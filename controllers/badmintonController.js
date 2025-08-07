const axios = require('axios');

const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';

async function askGroq(prompt) {
  const res = await axios.post(
    GROQ_API_URL,
    {
      model: 'llama3-70b-8192',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.7,
    },
    {
      headers: {
        'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
        'Content-Type': 'application/json',
      },
    }
  );
  return res.data.choices[0].message.content;
}

exports.getPastMatches = async (req, res) => {
  try {
    const prompt = `Give me the last 5 international hockey match results in the format: { teams, score, date }. Just provide plain JSON array.`;
    const result = await askGroq(prompt);
    res.send(result);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch past matches', details: err.message });
  }
};

exports.getUpcomingMatches = async (req, res) => {
  try {
    const prompt = `Give me the next 5 upcoming international hockey matches in JSON format: { teams, date }.`;
    const result = await askGroq(prompt);
    res.send(result);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch upcoming matches', details: err.message });
  }
};

let cachedLive = null;

exports.getLiveMatch = async (req, res) => {
  try {
    if (!cachedLive || Date.now() - cachedLive.time > 5 * 60 * 1000) {
      const prompt = `Give me one fake but realistic live international hockey match status like { teams, score, time, status }.`;
      const result = await askGroq(prompt);
      cachedLive = { data: result, time: Date.now() };
    }
    res.send(cachedLive.data);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch live match', details: err.message });
  }
};
