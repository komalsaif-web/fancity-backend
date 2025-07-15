const axios = require('axios');
require('dotenv').config();

// ✅ LIVE MATCHES
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
      const status = "Live";

      const scoreData = match.score?.[0];
      const score = scoreData
        ? `${scoreData.inning}: ${scoreData.r}/${scoreData.w} in ${scoreData.o} overs`
        : "Score not available";

      const team1Ratio = Math.floor(Math.random() * 100);
      const team2Ratio = 100 - team1Ratio;

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
        console.error("YouTube API error:", ytErr.message);
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
    console.error("Live match fetch error:", err.message);
    res.status(500).json({ error: "Failed to fetch live matches" });
  }
};

// upcoming
exports.getUpcomingMatches = async (req, res) => {
  try {
    const response = await axios.get(`https://api.cricapi.com/v1/matches?apikey=${process.env.CRICAPI_KEY}`);
    const matches = response.data.data || [];

    const upcomingMatches = matches
      .filter(match => match.matchStarted === false && Array.isArray(match.teams) && match.teams.length >= 2)
      .map(match => {
        const dateTimeStr = match.dateTimeGMT || '';
        let date = 'TBD', time = 'TBD';

        if (dateTimeStr) {
          try {
            const dt = new Date(dateTimeStr);
            date = dt.toLocaleDateString('en-GB', { day: '2-digit', month: 'short' });
            time = dt.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
          } catch (_) {}
        }

        const team1 = match.teams?.[0] || match.teamInfo?.[0]?.name || "Team 1";
        const team2 = match.teams?.[1] || match.teamInfo?.[1]?.name || "Team 2";
        const team1Flag = match.teamInfo?.[0]?.img || 'https://h.cricapi.com/img/icon512.png';
        const team2Flag = match.teamInfo?.[1]?.img || 'https://h.cricapi.com/img/icon512.png';
        const league = match.series || 'Unknown League';
        const venue = match.venue || 'TBD';

        return {
          sport: "cricket",
          team_1: team1,
          team_2: team2,
          team_1_flag: team1Flag,
          team_2_flag: team2Flag,
          status: "Upcoming",
          match_date: date,
          match_time: time,
          league,
          venue,
          youtube_url: null
        };
      });

    res.json(upcomingMatches);
  } catch (err) {
    console.error("Upcoming match fetch error:", err.message);
    res.status(500).json({ error: "Failed to fetch upcoming matches" });
  }
};

