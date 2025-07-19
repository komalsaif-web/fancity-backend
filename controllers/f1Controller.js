const axios = require('axios');
require('dotenv').config();

// ✅ LIVE FORMULA 1 MATCHES
exports.getLiveF1Races = async (req, res) => {
  try {
    const response = await axios.get('https://v1.formula-1.api-sports.io/races', {
      headers: {
        'x-apisports-key': process.env.F1_API_KEY
      },
      params: {
        live: 'all'
      }
    });

    const races = response.data.response || [];

    const results = races.map(race => {
      const circuit = race.circuit?.name || 'Unknown Circuit';
      const competition = race.competition?.name || 'F1 Race';
      const country = race.competition?.location?.country || 'N/A';
      const status = race.status || 'Unknown';
      const date = new Date(race.date);
      const formattedDate = date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short' });
      const formattedTime = date.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });

      return {
        sport: "formula-1",
        competition,
        circuit,
        country,
        status,
        match_date: formattedDate,
        match_time: formattedTime,
        score: "N/A",
        youtube_url: null,
        team_1_ratio: Math.floor(Math.random() * 100),
        team_2_ratio: Math.floor(Math.random() * 100)
      };
    });

    res.json(results);
  } catch (error) {
    console.error("F1 live races error:", error.message);
    res.status(500).json({ error: "Failed to fetch F1 live races" });
  }
};

// ✅ UPCOMING FORMULA 1 RACES
exports.getUpcomingF1Races = async (req, res) => {
  try {
    const response = await axios.get('https://v1.formula-1.api-sports.io/races', {
      headers: {
        'x-apisports-key': process.env.F1_API_KEY
      },
      params: {
        upcoming: true
      }
    });

    const races = response.data.response || [];

    const results = races.map(race => {
      const circuit = race.circuit?.name || 'Unknown Circuit';
      const competition = race.competition?.name || 'F1 Race';
      const country = race.competition?.location?.country || 'N/A';
      const date = new Date(race.date);
      const formattedDate = date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short' });
      const formattedTime = date.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });

      return {
        sport: "formula-1",
        competition,
        circuit,
        country,
        status: "Upcoming",
        match_date: formattedDate,
        match_time: formattedTime,
        score: "N/A",
        youtube_url: null,
        team_1_ratio: Math.floor(Math.random() * 100),
        team_2_ratio: Math.floor(Math.random() * 100)
      };
    });

    res.json(results);
  } catch (error) {
    console.error("F1 upcoming races error:", error.message);
    res.status(500).json({ error: "Failed to fetch upcoming F1 races" });
  }
};
