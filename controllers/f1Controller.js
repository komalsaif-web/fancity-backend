import fetch from "node-fetch";

const GROQ_API_URL = "https://api.groq.com/v1/llama3";
const API_KEY = process.env.GROQ_API_KEY;

// Helper: get F1 races for a country (live/upcoming/past)
export const getF1Races = async (req, res) => {
  try {
    const { country = "UAE", type = "live" } = req.query;

    // Build prompt dynamically for LLaMA 3
    const prompt = `
      Give me ${type} Formula 1 races in ${country}.
      Include:
      - Country
      - Race name
      - Teams and drivers
      - Start time (local)
      Format the output as a JSON array, example:
      [
        {
          "country": "UAE",
          "race": "Abu Dhabi GP",
          "teams": [
            {"team": "Mercedes", "drivers": ["Lewis Hamilton","George Russell"]},
            {"team": "Red Bull", "drivers": ["Max Verstappen","Sergio Perez"]}
          ],
          "start_time": "2025-09-29T15:00:00+04:00"
        }
      ]
    `;

    // Call Groq LLaMA 3 API
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

    // Parse the returned text (assumes JSON array)
    let races = JSON.parse(data.text);

    // --- Simulate "live update" trick ---
    // For example: only show first N races based on current time
    const raceCount = Math.min(
      races.length,
      Math.floor((Date.now() / 1000 / 60) % races.length) + 1 // cycles 1,2,3...
    );

    races = races.slice(0, raceCount);

    res.json({ success: true, races });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};
