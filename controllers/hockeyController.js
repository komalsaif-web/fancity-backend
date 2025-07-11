// controllers/hockeyController.js
const axios = require('axios');

exports.getLiveHockeyMatches = async (req, res) => {
  try {
    const response = await axios.get('https://v1.hockey.api-sports.io/fixtures?live=all', {
      headers: {
        'x-apisports-key': process.env.HOCKEY_API_KEY
      }
    });

    const matches = response.data.response;

    const results = matches.map(match => {
      const team1 = match.teams.home.name;
      const team2 = match.teams.away.name;
      const team1Flag = match.teams.home.logo;
      const team2Flag = match.teams.away.logo;
      const score = `${match.goals.home} - ${match.goals.away}`;
      const status = match.status.long;
      const team1Ratio = Math.floor(Math.random() * 100);
      const team2Ratio = 100 - team1Ratio;

      return {
        sport: "hockey",
        team_1: team1,
        team_2: team2,
        team_1_flag: team1Flag,
        team_2_flag: team2Flag,
        status,
        score,
        team_1_ratio: team1Ratio,
        team_2_ratio: team2Ratio
      };
    });

    res.json(results);
  } catch (err) {
    console.error("❌ Hockey API error:", err.message);
    res.status(500).json({ error: "Failed to fetch live hockey matches" });
  }
};
