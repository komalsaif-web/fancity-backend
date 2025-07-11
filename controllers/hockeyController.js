const axios = require('axios');
require('dotenv').config();

exports.getLiveHockeyMatches = async (req, res) => {
  try {
    const response = await axios.get('https://v3.hockey.api-sports.io/fixtures', {
      headers: {
        'x-apisports-key': process.env.HOCKEY_API_KEY || '8418de2cdd88bb19f017e22ef83e8d8f'
      },
      params: {
        live: 'all'
      }
    });

    const matches = response.data.response;

    const results = [];

    for (const match of matches) {
      const team1 = match.teams.home.name;
      const team2 = match.teams.away.name;
      const team1Flag = match.teams.home.logo;
      const team2Flag = match.teams.away.logo;
      const status = match.fixture.status.long;
      const score = `${match.goals.home} - ${match.goals.away}`;

      // Random win ratio (replace with real if available)
      const team1Ratio = Math.floor(Math.random() * 100);
      const team2Ratio = 100 - team1Ratio;

      // 🔍 YouTube Live Search
      let youtube_url = null;
      try {
        const yt = await axios.get('https://www.googleapis.com/youtube/v3/search', {
          params: {
            part: 'snippet',
            q: `${team1} vs ${team2} hockey live`,
            type: 'video',
            eventType: 'live',
            key: process.env.YOUTUBE_API_KEY,
            maxResults: 1
          }
        });

        const videoId = yt.data.items?.[0]?.id?.videoId;
        youtube_url = videoId ? `https://www.youtube.com/watch?v=${videoId}` : null;
      } catch (ytErr) {
        console.error("🎥 YouTube error:", ytErr.message);
      }

      results.push({
        sport: "hockey",
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
    console.error("❌ Hockey fetch error:", err.message);
    res.status(500).json({ error: "Failed to fetch live hockey matches" });
  }
};
