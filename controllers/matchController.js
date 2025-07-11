const axios = require('axios');
require('dotenv').config();

exports.getLiveMatches = async (req, res) => {
  try {
    const cricket = await axios.get(`https://api.cricapi.com/v1/currentMatches?apikey=${process.env.CRIC_API_KEY}`);
    const liveCricket = cricket.data.data.filter(m => m.matchStarted === true);

    const results = [];

    for (const match of liveCricket) {
      const team1 = match.teams?.[0] || match.teamInfo?.[0]?.name || "TBD";
      const team2 = match.teams?.[1] || match.teamInfo?.[1]?.name || "TBD";
      const status = match.matchStarted ? "live" : "upcoming";
      const scoreInfo = match.score?.[0];
      const score = scoreInfo ? `${scoreInfo.inning} ${scoreInfo.r}/${scoreInfo.w} (${scoreInfo.o})` : "N/A";

      // 🔍 Search YouTube for live video
      let youtube_url = null;
      try {
        const yt = await axios.get('https://www.googleapis.com/youtube/v3/search', {
          params: {
            part: 'snippet',
            q: `${team1} vs ${team2} live`,
            type: 'video',
            eventType: 'live',
            key: process.env.YOUTUBE_API_KEY,
            maxResults: 1
          }
        });
        const videoId = yt.data.items?.[0]?.id?.videoId;
        youtube_url = videoId ? `https://www.youtube.com/watch?v=${videoId}` : null;
      } catch (ytErr) {
        console.error("❌ YouTube fetch error:", ytErr.message);
      }

      results.push({
        sport: "cricket",
        team_1: team1,
        team_2: team2,
        status,
        score,
        youtube_url
      });
    }

    res.json(results);
  } catch (err) {
    console.error("❌ Match fetch error:", err.message);
    res.status(500).json({ error: "Failed to fetch live matches" });
  }
};
