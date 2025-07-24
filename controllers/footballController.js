const axios = require('axios');
require('dotenv').config();

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
// ✅ Simple team-to-country code map
const teamCountryMap = {
  "EC Vitória": "BR",
  "SC Recife": "BR",
  "São Paulo FC": "BR",
  "CR Flamengo": "BR",
  "RB Bragantino": "BR",
  "Grêmio FBPA": "BR",
  "CR Vasco da Gama": "BR",
  "EC Bahia": "BR",
  "CA Mineiro": "BR",
  "Fortaleza EC": "BR",
  "Chelsea FC": "GB",
  "FC Barcelona": "ES",
  "Real Madrid CF": "ES",
  "Paris Saint-Germain FC": "FR",
  "FC Bayern München": "DE"
};

// ✅ UPCOMING FOOTBALL MATCHES (with flags)
exports.getUpcomingFootballMatches = async (req, res) => {
  try {
    const response = await axios.get('https://api.football-data.org/v4/matches', {
      headers: {
        'X-Auth-Token': process.env.FOOTBALLDATA_API_KEY,
      },
      params: {
        status: 'SCHEDULED',
        limit: 15,
      },
    });

    const matches = response.data.matches;

    const results = matches.map((match) => {
      const team1 = match.homeTeam.name;
      const team2 = match.awayTeam.name;

      const team1Code = teamCountryMap[team1] || "unknown";
      const team2Code = teamCountryMap[team2] || "unknown";

      return {
        sport: "football",
        competition: match.competition.name,
        team_1: team1,
        team_2: team2,
        team_1_flag: `https://countryflagsapi.com/png/${team1Code}`,
        team_2_flag: `https://countryflagsapi.com/png/${team2Code}`,
        match_time: match.utcDate,
        venue: match.venue || "TBD",
      };
    });

    res.json(results);
  } catch (err) {
    console.error("Upcoming match fetch error:", err.message);
    res.status(500).json({ error: "Failed to fetch upcoming football matches" });
  }
};

