// controllers/badmintonController.js
const puppeteer = require('puppeteer');

const fetchBadmintonData = async (req, res) => {
  const { type } = req.query;

  try {
    const browser = await puppeteer.launch({ headless: "new" });
    const page = await browser.newPage();
    await page.goto('https://www.google.com/search?q=badminton+live+score', { waitUntil: 'domcontentloaded' });

    await page.waitForSelector('div[jsname]');

    const results = await page.evaluate(() => {
      const matches = [];
      const rows = document.querySelectorAll('div[jsname] div[class*="imspo_mt__"]');

      rows.forEach(row => {
        const title = row.querySelector('.ellipsisize')?.textContent?.trim();
        const time = row.querySelector('.imspo_mt__ts-wt')?.textContent?.trim();
        const status = row.querySelector('.imspo_mt__sta-imspo')?.textContent?.trim();
        const score = row.querySelector('.imspo_mt__scr')?.textContent?.trim();

        if (title) {
          matches.push({
            title,
            time: time || '',
            score: score || '',
            status: status || '',
          });
        }
      });

      return matches;
    });

    await browser.close();

    if (!results.length) {
      return res.status(404).json({ message: 'No data found from Google' });
    }

    // Optionally filter by type: live, past, upcoming
    const filtered = results.filter(match => {
      if (type === 'live') return match.status?.toLowerCase().includes('live');
      if (type === 'past') return match.status?.toLowerCase().includes('final') || match.status?.toLowerCase().includes('won');
      if (type === 'upcoming') return match.status?.toLowerCase().includes('upcoming') || match.time;
      return true; // all
    });

    return res.json(filtered);
  } catch (error) {
    console.error('Scraping error:', error.message);
    return res.status(500).json({ error: 'Failed to scrape Google' });
  }
};

module.exports = { fetchBadmintonData };
