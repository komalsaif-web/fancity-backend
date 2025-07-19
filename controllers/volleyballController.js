const axios = require('axios');
require('dotenv').config();

const API_KEY = process.env.VOLLEYBALL_API_KEY || '8418de2cdd88bb19f017e22ef83e8d8f';

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

    const formatted = matches.map(match => {
      const homeTeam = match.teams.home.name;
      const awayTeam = match.teams.away.name;
      const homeLogo = match.teams.home.logo;
      const awayLogo = match.teams.away.logo;
      const status = match.status.long;
      const score = `${match.scores.home} - ${match.scores.away}`;
      const league = match.league?.name || "Unknown League";

      return {
        sport: "volleyball",
        team_1: homeTeam,
        team_2: awayTeam,
        team_1_flag: homeLogo,
        team_2_flag: awayLogo,
        status,
        score,
        league,
        team_1_ratio: Math.floor(Math.random() * 100),
        team_2_ratio: Math.floor(Math.random() * 100),
        youtube_url: null // Optional: integrate later
      };
    });

    res.json(formatted);
  } catch (error) {
    console.error('Volleyball API error:', error.message);
    res.status(500).json({ error: 'Failed to fetch volleyball live scores' });
  }
};
