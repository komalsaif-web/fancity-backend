const axios = require('axios');
require('dotenv').config();
const countryNameToCode = require('../utils/countryCodeMapper');
// ✅ LIVE FOOTBALL MATCHES
exports.getLiveFootballMatches = async (req, res) => {
  try {
    const response = await axios.get('https://v3.football.api-sports.io/fixtures', {
      headers: {
        'x-apisports-key': process.env.FOOTBALL_API_KEY,
      },
      params: {
        live: 'all',
      },
    });

    const liveMatches = response.data.response;

    const results = [];

    for (const match of liveMatches) {
      const homeTeam = match.teams.home.name;
      const awayTeam = match.teams.away.name;
      const homeLogo = match.teams.home.logo;
      const awayLogo = match.teams.away.logo;
      const status = match.fixture.status.long;
      const score = `${match.goals.home} - ${match.goals.away}`;

      const team1Ratio = Math.floor(Math.random() * 100);
      const team2Ratio = 100 - team1Ratio;

      let youtube_url = null;
      try {
        const yt = await axios.get('https://www.googleapis.com/youtube/v3/search', {
          params: {
            part: 'snippet',
            q: `${homeTeam} vs ${awayTeam} live football`,
            type: 'video',
            eventType: 'live',
            key: process.env.YOUTUBE_API_KEY,
            maxResults: 1,
          },
        });

        const videoId = yt.data.items?.[0]?.id?.videoId;
        youtube_url = videoId ? `https://www.youtube.com/watch?v=${videoId}` : null;
      } catch (ytErr) {
        console.error("YouTube error:", ytErr.message);
      }

      results.push({
        sport: "football",
        team_1: homeTeam,
        team_2: awayTeam,
        team_1_flag: homeLogo,
        team_2_flag: awayLogo,
        status,
        score,
        team_1_ratio: team1Ratio,
        team_2_ratio: team2Ratio,
        youtube_url
      });
    }

    res.json(results);
  } catch (err) {
    console.error("Football match fetch error:", err.message);
    res.status(500).json({ error: "Failed to fetch football matches" });
  }
};


// Optional: Helper to convert country name to ISO 3166-1 alpha-2 code
 // You can create this file

exports.getUpcomingFootballMatches = async (req, res) => {
  try {
    const response = await axios.get('https://api.football-data.org/v4/matches', {
      headers: {
        'X-Auth-Token': process.env.FOOTBALLDATA_API_KEY,
      },
      params: {
        status: 'SCHEDULED',
        limit: 10,
      },
    });

    const matches = response.data.matches;

    const results = matches.map((match) => {
      const homeTeam = match.homeTeam;
      const awayTeam = match.awayTeam;

      const team1 = homeTeam.name || "Team 1";
      const team2 = awayTeam.name || "Team 2";

      const team1CountryCode = countryNameToCode(homeTeam.area?.name || team1);
      const team2CountryCode = countryNameToCode(awayTeam.area?.name || team2);

      const team1Flag = `https://flagcdn.com/w320/${team1CountryCode}.png`;
      const team2Flag = `https://flagcdn.com/w320/${team2CountryCode}.png`;

      const dateObj = new Date(match.utcDate);
      const matchDate = dateObj.toLocaleDateString('en-GB', { day: '2-digit', month: 'short' });
      const matchTime = dateObj.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });

      return {
        sport: "football",
        competition: match.competition.name || "Unknown League",
        team_1: team1,
        team_2: team2,
        team_1_flag: team1Flag,
        team_2_flag: team2Flag,
        match_date: matchDate,
        match_time: matchTime,
        venue: match?.competition?.area?.name || "TBD", // Using country name as fallback
        status: "Upcoming",
        youtube_url: null,
      };
    });

    res.json(results);
  } catch (err) {
    console.error("Upcoming football match fetch error:", err.message);
    res.status(500).json({ error: "Failed to fetch upcoming football matches" });
  }
};
