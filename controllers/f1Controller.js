const GROQ_API_URL = "https://api.groq.com/v1/chat/completions";
const API_KEY = process.env.GROQ_API_KEY;

const getF1Races = async (req, res) => {
  try {
    const { country = "UAE", type = "live" } = req.query;

    const prompt = `
      Act as a JSON API.
      Respond ONLY with a valid JSON array (no text before or after).
      Give me ${type} Formula 1 races in ${country}.
      Each object should have:
      - country
      - race_name
      - teams (array of {team, drivers: []})
      - start_time (local ISO8601 format)
    `;

    const response = await fetch(GROQ_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${API_KEY}`,
      },
      body: JSON.stringify({
        model: "llama3-70b-8192",
        messages: [{ role: "user", content: prompt }],
        max_tokens: 800,
        temperature: 0.3,
      }),
    });

    const data = await response.json();

    let content = data.choices?.[0]?.message?.content || "[]";

    // Cleanup: extract JSON array
    const jsonMatch = content.match(/\[.*\]/s);
    if (jsonMatch) {
      content = jsonMatch[0];
    }

    let races;
    try {
      races = JSON.parse(content);
    } catch (err) {
      console.error("JSON parse error:", err, "Raw:", content);
      races = [];
    }

    res.json({ success: true, races });
  } catch (error) {
    console.error("Groq fetch error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getF1Races };
