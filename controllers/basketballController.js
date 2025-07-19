const axios = require('axios');

// Supported sports list
const validSports = ['football', 'basketball', 'hockey', 'cricket'];

exports.getLiveScoresBySport = async (req, res) => {
  const { sport } = req.params;

  // ✅ Validate sport name
  if (!validSports.includes(sport.toLowerCase())) {
    return res.status(400).json({ error: `Unsupported sport '${sport}'. Supported: ${validSports.join(', ')}` });
  }

  try {
    const response = await axios.get(`https://apiv2.allsportsapi.com/${sport}/`, {
      params: {
        met: 'Livescore',
        APIkey: process.env.ALL_SPORTS_API_KEY
      }
    });

    res.status(200).json({
      sport: sport,
      total_matches: response.data.result?.length || 0,
      matches: response.data.result || []
    });
  } catch (error) {
    console.error(`Error fetching ${sport} live scores:`, error.message);
    res.status(500).json({ error: `Failed to fetch ${sport} live scores` });
  }
};
