const axios = require('axios');
require('dotenv').config();
const countries = require('country-list');
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


exports.getFootballFixtures = async (req, res) => {
  try {
    const today = new Date().toISOString().split('T')[0]; // format: YYYY-MM-DD

    const response = await axios.get('https://api-football-v1.p.rapidapi.com/v3/fixtures', {
      params: { date: today },
      headers: {
        'X-RapidAPI-Key': 'YOUR_RAPID_API_KEY', // replace with your key
        'X-RapidAPI-Host': 'api-football-v1.p.rapidapi.com',
      },
    });

    const fixtures = response.data.response;

    const matchList = fixtures.slice(0, 10).map(fixture => {
      const team1 = fixture.teams.home.name;
      const team2 = fixture.teams.away.name;
      const homeCountry = fixture.league.country;
      const awayCountry = fixture.league.country; // usually same for both

      // Get 2-letter country code
      const team1Code = countries.getCode(homeCountry)?.toLowerCase() || 'unknown';
      const team2Code = countries.getCode(awayCountry)?.toLowerCase() || 'unknown';

      return {
        sport: 'football',
        competition: fixture.league.name,
        team_1: team1,
        team_2: team2,
        team_1_flag: `https://flagcdn.com/w320/${team1Code}.png`,
        team_2_flag: `https://flagcdn.com/w320/${team2Code}.png`,
        match_date: new Date(fixture.fixture.date).toLocaleDateString('en-GB', {
          day: '2-digit',
          month: 'short',
        }),
        match_time: new Date(fixture.fixture.date).toLocaleTimeString('en-GB', {
          hour: '2-digit',
          minute: '2-digit',
        }),
        venue: fixture.fixture.venue.name || 'TBD',
        status: fixture.fixture.status.long,
        youtube_url: null, // You can later update this manually or via YouTube API
      };
    });

    res.json(matchList);
  } catch (error) {
    console.error('Error fetching football fixtures:', error.message);
    res.status(500).json({ error: 'Failed to fetch fixtures' });
  }
};



