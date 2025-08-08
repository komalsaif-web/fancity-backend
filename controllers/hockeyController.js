const API_KEY = process.env.GROQ_API_KEY;
const ENDPOINT = "https://api.groq.com/openai/v1/chat/completions";

async function fetchMatches(prompt) {
  const res = await fetch(ENDPOINT, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "llama3-70b-8192",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
    }),
  });

  const data = await res.json();
  let text = data.choices[0]?.message?.content || "[]";

  if (text.includes("```")) {
    const start = text.indexOf("```");
    const end = text.lastIndexOf("```");
    text = text.substring(start + 3, end).replace(/^json/, "").trim();
  }

  try {
    return JSON.parse(text);
  } catch (e) {
    console.error("❌ Failed to parse AI response:", text);
    return [];
  }
}

// ---------------------- International ----------------------
exports.getPastInternational = async (req, res) => {
  try {
    const prompt = "Give last 5 international hockey matches in JSON array with: team1, team2, score, date, flag1 (ISO 2-letter code), flag2.";
    const matches = await fetchMatches(prompt);
    res.json(matches);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getUpcomingInternational = async (req, res) => {
  try {
    const prompt = "Give next 5 international hockey matches as JSON array: team1, team2, date, time, flag1 (ISO 2-letter code), flag2.";
    const matches = await fetchMatches(prompt);
    res.json(matches);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getLiveInternational = async (req, res) => {
  try {
    const prompt = "Give 5 current live hockey matches from around the world in JSON array with: team1, team2, score1, score2, time, period, venue, last_play, flag1, flag2 (ISO 2-letter codes).";
    const matches = await fetchMatches(prompt);
    res.json(matches);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ---------------------- League ----------------------
exports.getPastLeague = async (req, res) => {
  try {
    const prompt = "Give last 5 league hockey matches in JSON array with: team1, team2, score, date, league_name, flag1 (ISO 2-letter code), flag2.";
    const matches = await fetchMatches(prompt);
    res.json(matches);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getUpcomingLeague = async (req, res) => {
  try {
    const prompt = "Give next 5 league hockey matches as JSON array: team1, team2, date, time, league_name, flag1 (ISO 2-letter code), flag2.";
    const matches = await fetchMatches(prompt);
    res.json(matches);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getLiveLeague = async (req, res) => {
  try {
    const prompt = "Give 5 current live league hockey matches in JSON array with: team1, team2, score1, score2, time, period, venue, last_play, league_name, flag1, flag2 (ISO 2-letter codes).";
    const matches = await fetchMatches(prompt);
    res.json(matches);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
 