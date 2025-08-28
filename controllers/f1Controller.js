const GROQ_API_URL = "https://api.groq.com/v1/chat/completions";
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
      Format the response strictly as a JSON array only.
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

    // Groq AI ka jawaab
    const content = data.choices?.[0]?.message?.content || "[]";

    let races;
    try {
      races = JSON.parse(content); // ensure JSON array ban jaye
    } catch (err) {
      console.error("JSON parse error:", err);
      races = [];
    }

    res.json({ success: true, races });
  } catch (error) {
    console.error("Groq fetch error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getF1Races };
