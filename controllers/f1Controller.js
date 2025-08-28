const GROQ_API_URL = "https://api.groq.com/v1/chat/completions";
const API_KEY = process.env.GROQ_API_KEY;

// Helper function
const fetchRaces = async (type, country = "UAE") => {
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
      Authorization: `Bearer ${API_KEY}`,
    },
    body: JSON.stringify({
      model: "llama3-70b-8192",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 800,
      temperature: 0.3,
    }),
  });

  const data = await response.json();
  const content = data.choices?.[0]?.message?.content || "[]";

  try {
    return JSON.parse(content);
  } catch (err) {
    console.error("JSON parse error:", err);
    return [];
  }
};

// Controllers
const getLiveRaces = async (req, res) => {
  try {
    const races = await fetchRaces("live", "UAE");
    res.json({ success: true, races });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getPastRaces = async (req, res) => {
  try {
    const races = await fetchRaces("past", "UAE");
    res.json({ success: true, races });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getUpcomingRaces = async (req, res) => {
  try {
    const races = await fetchRaces("upcoming", "UAE");
    res.json({ success: true, races });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getLiveRaces, getPastRaces, getUpcomingRaces };
