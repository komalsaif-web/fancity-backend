// controllers/volleyballController.js
const axios = require('axios');

const API_KEY = '8418de2cdd88bb19f017e22ef83e8d8f';

exports.getLiveVolleyballScores = async (req, res) => {
  try {
    const response = await axios.get('https://v1.volleyball.api-sports.io/games', {
      headers: {
        'x-apisports-key': API_KEY,
      },
      params: {
        date: new Date().toISOString().split('T')[0],
        timezone: 'Asia/Karachi',
      }
    });

    const matches = response.data.response;
    res.json({ count: matches.length, matches });
  } catch (error) {
    console.error('Volleyball API error:', error.message);
    res.status(500).json({ error: 'Failed to fetch volleyball live scores' });
  }
};
