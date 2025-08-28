// const fetch = require("node-fetch"); // remove this

const GROQ_API_URL = "https://api.groq.com/v1/llama3";
const API_KEY = process.env.GROQ_API_KEY;

const getF1Races = async (req, res) => {
  try {
    const { country = "UAE", type = "live" } = req.query;

    const prompt = `
      Give me ${type} Formula 1 races in ${country}.
      Include:
      - Country
      - Race name
      - Teams and drivers
      - Start time (local)
      Format as JSON array
    `;

    const response = await fetch(GROQ_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${API_KEY}`,
      },
      body: JSON.stringify({
        model: "llama-3",
        prompt,
        max_tokens: 1200,
      }),
    });

    const data = await response.json();

    let races = JSON.parse(data.text);

    const raceCount = Math.min(
      races.length,
      Math.floor((Date.now() / 1000 / 60) % races.length) + 1
    );

    races = races.slice(0, raceCount);

    res.json({ success: true, races });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getF1Races };
