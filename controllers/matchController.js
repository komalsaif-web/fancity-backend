// ✅ Updated Backend: Fetch Live Cricket Matches with Country Flags & Win Ratio
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
      const team1Flag = match.teamInfo?.[0]?.img || null;
      const team2Flag = match.teamInfo?.[1]?.img || null;
      const status = match.matchStarted ? "Live" : "Upcoming";
      const scoreInfo = match.score?.[0];
      const score = scoreInfo ? `${scoreInfo.inning} ${scoreInfo.r}/${scoreInfo.w} (${scoreInfo.o})` : "N/A";

      // Dummy win ratio logic (random for now, replace with real stats)
      const team1Ratio = Math.floor(Math.random() * 100);
      const team2Ratio = 100 - team1Ratio;

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
        console.error("YouTube error:", ytErr.message);
      }

      results.push({
        sport: "cricket",
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
    console.error("Match fetch error:", err.message);
    res.status(500).json({ error: "Failed to fetch live matches" });
  }
};
