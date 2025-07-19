const axios = require('axios');

exports.getLiveRugbyMatches = async (req, res) => {
  const { timezone = 'Asia/Karachi' } = req.query;

  try {
    const response = await axios.get('https://v1.rugby.api-sports.io/games', {
      headers: {
        'x-apisports-key': '8418de2cdd88bb19f017e22ef83e8d8f'
      },
      params: {
        live: 'all',      // ✅ This will fetch all live matches
        timezone
      }
    });

    const matches = response.data.response || [];

    const formatted = matches.map(match => ({
      id: match.id,
      date: match.date.start,
      status: match.status?.long || 'Unknown',
      league: match.league?.name || 'N/A',
      country: match.league?.country || 'N/A',
      season: match.league?.season || 'N/A',
      homeTeam: {
        name: match.teams?.home?.name || 'N/A',
        logo: match.teams?.home?.logo || ''
      },
      awayTeam: {
        name: match.teams?.away?.name || 'N/A',
        logo: match.teams?.away?.logo || ''
      },
      score: {
        home: match.scores?.home || 'N/A',
        away: match.scores?.away || 'N/A'
      }
    }));

    res.json({ count: formatted.length, matches: formatted });
  } catch (err) {
    console.error("Live Rugby API Error:", err.response?.data || err.message);
    res.status(500).json({ error: 'Failed to fetch live rugby matches' });
  }
};
