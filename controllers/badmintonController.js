const puppeteer = require('puppeteer');

const fetchBadmintonData = async (req, res) => {
  try {
    const { type } = req.query; // 'live', 'past', or 'upcoming'
    const url = 'https://www.flashscore.com/badminton/';

    const browser = await puppeteer.launch({ headless: 'new' });
    const page = await browser.newPage();
    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 60000 });

    await page.waitForSelector('.event__match');

    const matches = await page.$$eval('.event__match', (elements, type) => {
      return elements.map(el => {
        const homePlayer = el.querySelector('.event__participant--home')?.textContent.trim();
        const awayPlayer = el.querySelector('.event__participant--away')?.textContent.trim();
        const matchTime = el.querySelector('.event__time')?.textContent.trim();
        const score = el.querySelector('.event__scores')?.textContent.trim() || '';
        const statusText = el.querySelector('.event__stage--block')?.textContent.trim() || '';

        let statusType = 'upcoming';
        if (statusText.includes('FT') || statusText.includes('Finished')) {
          statusType = 'past';
        } else if (statusText) {
          statusType = 'live';
        }

        if (type === statusType) {
          return {
            team1: homePlayer,
            team2: awayPlayer,
            team3: null,
            score: score || null,
            date: matchTime || null,
            team1_country: 'us',
            team2_country: 'us',
            team3_country: null
          };
        }
        return null;
      }).filter(Boolean);
    }, type);

    await browser.close();

    res.json({ success: true, count: matches.length, matches });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Scraping failed' });
  }
};

module.exports = { fetchBadmintonData };
