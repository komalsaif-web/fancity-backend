const axios = require('axios');

// 🔐 Your API Football credentials (hardcoded)
const FOOTBALL_API_KEY = 'c1a411feb8msh42a7436b8c131afp12f762jsnc3cf3b8ca791';
const FOOTBALL_API_HOST = 'api-football-v1.p.rapidapi.com';

// ✅ LIVE FOOTBALL MATCHES
exports.getLiveFootballMatches = async (req, res) => {
  try {
    const response = await axios.get('https://v3.football.api-sports.io/fixtures', {
      headers: {
        'x-apisports-key': FOOTBALL_API_KEY,
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
            key: 'YOUR_YOUTUBE_API_KEY', // replace with your actual key
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

// ✅ UPCOMING FOOTBALL MATCHES
exports.getUpcomingFootballMatches = async (req, res) => {
  try {
    const response = await axios.get('https://api-football-v1.p.rapidapi.com/v2/odds/league/865927/bookmaker/5?page=2', {
      headers: {
        'x-rapidapi-key': FOOTBALL_API_KEY,
        'x-rapidapi-host': FOOTBALL_API_HOST,
      },
    });

    const data = response.data.data || [];

    const upcomingMatches = data.map(match => {
      const dateTime = new Date(match.match_start);
      const date = dateTime.toLocaleDateString('en-GB', { day: '2-digit', month: 'short' });
      const time = dateTime.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });

      return {
        sport: "football",
        league: match.league_name || 'Unknown League',
        match_date: date,
        match_time: time,
        team_1: match.home_team || 'Team 1',
        team_2: match.away_team || 'Team 2',
        team_1_flag: '', // logo not available in this API
        team_2_flag: '',
        status: 'Upcoming',
        odds: match.odds || [],
      };
    });

    res.json(upcomingMatches);
  } catch (err) {
    console.error("Upcoming football match fetch error:", err.message);
    res.status(500).json({ error: "Failed to fetch upcoming football matches" });
  }
};
