const axios = require('axios');
require('dotenv').config();

exports.getLiveTennisMatches = async (req, res) => {
  try {
    const response = await axios.get(
      `https://api.sportradar.us/tennis/trial/v3/en/schedules/live/summaries.json?api_key=${process.env.TENNIS_API_KEY}`
    );

    const matches = response.data.summaries || [];

    const results = matches.map(match => {
      const competitors = match?.sport_event?.competitors || [];
      const team1 = competitors[0]?.name || "TBD";
      const team2 = competitors[1]?.name || "TBD";

      return {
        sport: "tennis",
        team_1: team1,
        team_2: team2,
        team_1_flag: null,
        team_2_flag: null,
        status: match.sport_event_status?.match_status || "Live",
        score: match.sport_event_status?.score?.toString() || "N/A",
        team_1_ratio: Math.floor(Math.random() * 100),
        team_2_ratio: 100 - Math.floor(Math.random() * 100),
        youtube_url: null // no YouTube integration here
      };
    });

    res.json(results);
  } catch (err) {
    console.error("Tennis API error:", err.message);
    res.status(500).json({ error: "Failed to fetch live tennis matches" });
  }
};
