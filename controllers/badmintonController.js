const axios = require('axios');

const API_KEY = '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';
const BASE_URL = 'https://api-football-v1.p.rapidapi.com/v3/fixtures';
const HEADERS = {
  'X-RapidAPI-Key': API_KEY,
  'X-RapidAPI-Host': 'api-football-v1.p.rapidapi.com'
};

// Delay utility for live matches (2 mins)
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// 🟢 LIVE MATCHES
const getLiveMatches = async (req, res) => {
  try {
    await delay(120000); // 2 minutes delay
    const response = await axios.get(`${BASE_URL}?live=all`, { headers: HEADERS });

    const liveMatches = response.data.response.map(match => ({
      league: match.league.name,
      country: match.league.country,
      date: match.fixture.date,
      status: match.fixture.status.long,
      homeTeam: {
        name: match.teams.home.name,
        logo: match.teams.home.logo,
        score: match.goals.home
      },
      awayTeam: {
        name: match.teams.away.name,
        logo: match.teams.away.logo,
        score: match.goals.away
      }
    }));

    res.status(200).json({ liveMatches });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch live matches' });
  }
};

// 🟡 UPCOMING MATCHES (next 5)
const getUpcomingMatches = async (req, res) => {
  try {
    const response = await axios.get(`${BASE_URL}?next=5`, { headers: HEADERS });

    const upcoming = response.data.response.map(match => ({
      league: match.league.name,
      country: match.league.country,
      date: match.fixture.date,
      homeTeam: {
        name: match.teams.home.name,
        logo: match.teams.home.logo
      },
      awayTeam: {
        name: match.teams.away.name,
        logo: match.teams.away.logo
      }
    }));

    res.status(200).json({ upcomingMatches: upcoming });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch upcoming matches' });
  }
};

// 🔴 PAST MATCHES (last 5)
const getPastMatches = async (req, res) => {
  try {
    const response = await axios.get(`${BASE_URL}?last=5`, { headers: HEADERS });

    const past = response.data.response.map(match => ({
      league: match.league.name,
      country: match.league.country,
      date: match.fixture.date,
      homeTeam: {
        name: match.teams.home.name,
        logo: match.teams.home.logo,
        score: match.goals.home
      },
      awayTeam: {
        name: match.teams.away.name,
        logo: match.teams.away.logo,
        score: match.goals.away
      }
    }));

    res.status(200).json({ pastMatches: past });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch past matches' });
  }
};

module.exports = {
  getLiveMatches,
  getUpcomingMatches,
  getPastMatches
};
