const axios = require('axios');
const cheerio = require('cheerio');

// Scraping Badminton data
const fetchBadmintonData = async (req, res) => {
  try {
    const { type } = req.query; // 'live', 'past', or 'upcoming'
    const url = 'https://www.flashscore.com/badminton/';

    const response = await axios.get(url);
    const $ = cheerio.load(response.data);
    const matches = [];

    $('.event__match').each((i, el) => {
      const matchStatus = $(el).find('.event__stage--block').text().trim();
      const matchTime = $(el).find('.event__time').text().trim();
      const homePlayer = $(el).find('.event__participant--home').text().trim();
      const awayPlayer = $(el).find('.event__participant--away').text().trim();

      let statusType = 'upcoming';
      if (matchStatus.includes('FT') || matchStatus.includes('Finished')) {
        statusType = 'past';
      } else if (matchStatus !== '') {
        statusType = 'live';
      }

      if (type === statusType) {
        matches.push({
          homePlayer,
          awayPlayer,
          matchTime,
          status: statusType,
        });
      }
    });

    res.json({ success: true, count: matches.length, matches });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Scraping failed' });
  }
};

module.exports = { fetchBadmintonData };
