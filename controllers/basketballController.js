// controllers/basketballController.js
const axios = require('axios');
require('dotenv').config();

exports.getLiveBasketballMatches = async (req, res) => {
  try {
    const response = await axios.get('https://v1.basketball.api-sports.io/fixtures?live=all', {
      headers: {
        'x-apisports-key': process.env.BASKETBALL_API_KEY
      }
    });

    const matches = response.data.response;

    const results = [];

    for (const match of matches) {
      const team1 = match.teams.home.name;
      const team2 = match.teams.away.name;
      const team1Flag = match.teams.home.logo;
      const team2Flag = match.teams.away.logo;
      const status = match.status.long;
      const score = `${match.scores.home.total} - ${match.scores.away.total}`;

      // 🔁 Random win ratio (fake logic)
      const team1Ratio = Math.floor(Math.random() * 100);
      const team2Ratio = 100 - team1Ratio;

      // 🔴 YouTube Live Stream Search
      let youtube_url = null;
      try {
        const yt = await axios.get('https://www.googleapis.com/youtube/v3/search', {
          params: {
            part: 'snippet',
            q: `${team1} vs ${team2} live basketball`,
            type: 'video',
            eventType: 'live',
            key: process.env.YOUTUBE_API_KEY,
            maxResults: 1
          }
        });
        const videoId = yt.data.items?.[0]?.id?.videoId;
        youtube_url = videoId ? `https://www.youtube.com/watch?v=${videoId}` : null;
      } catch (ytErr) {
        console.error('❌ YouTube error:', ytErr.message);
      }

      results.push({
        sport: "basketball",
        team_1: team1,
        team_2: team2,
        team_1_flag: team1Flag,
        team_2_flag: team2Flag,
        status,
        score,
        team_1_ratio: team1Ratio,
        team_2_ratio: team2Ratio,
        youtube_url
      });
    }

    res.json(results);
  } catch (err) {
    console.error("❌ Basketball API error:", err.message);
    res.status(500).json({ error: "Failed to fetch live basketball matches" });
  }
};
