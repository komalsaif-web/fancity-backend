const axios = require('axios');

exports.getRugbyMatches = async (req, res) => {
  const { date = '2025-07-19', timezone = 'Asia/Karachi' } = req.query;

  try {
    const response = await axios.get('https://v1.rugby.api-sports.io/games', {
      headers: {
        'x-apisports-key': '8418de2cdd88bb19f017e22ef83e8d8f'
      },
      params: { date, timezone }
    });

    const games = response.data.response;

    const formattedMatches = games.map(game => ({
      homeTeam: game.teams.home.name,
      awayTeam: game.teams.away.name,
      homeLogo: game.teams.home.logo,
      awayLogo: game.teams.away.logo,
      status: game.status.long,
      score: `${game.scores.home.total ?? 'N/A'} - ${game.scores.away.total ?? 'N/A'}`,
      league: game.league.name,
      country: game.league.country,
      season: game.league.season,
      date: game.date
    }));

    res.json({ count: formattedMatches.length, matches: formattedMatches });
  } catch (error) {
    console.error('Rugby fetch error:', error.message);
    res.status(500).json({ error: 'Failed to fetch Rugby matches' });
  }
};
