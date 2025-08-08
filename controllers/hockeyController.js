const API_KEY = process.env.GROQ_API_KEY;
const ENDPOINT = "https://api.groq.com/openai/v1/chat/completions";

// --- Utility to fetch and safely parse JSON from Groq ---
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

  if (!data.choices || !data.choices[0]?.message?.content) {
    console.error("❌ No content from Groq:", data);
    return [];
  }

  let text = data.choices[0].message.content.trim();

  // Extract only JSON from markdown code block
  const codeBlockMatch = text.match(/```(?:json)?([\s\S]*?)```/i);
  if (codeBlockMatch) {
    text = codeBlockMatch[1].trim();
  }

  try {
    return JSON.parse(text);
  } catch (err) {
    console.error("❌ Failed to parse AI JSON:", text);
    return [];
  }
}

// Prompts
const prompts = {
  pastInternational: "Give last 5 international hockey matches in JSON array with: team1, team2, score, date, flag1 (ISO 2-letter code), flag2.",
  upcomingInternational: "Give next 5 international hockey matches as JSON array: team1, team2, date, time, flag1 (ISO 2-letter code), flag2.",
  liveInternational: "Give 5 current live international hockey matches in JSON array with: team1, team2, score1, score2, time, period, venue, last_play, flag1, flag2 (ISO 2-letter codes).",
  pastLeague: "Give last 5 league hockey matches in JSON array with: team1, team2, score, date, league_name, flag1 (ISO 2-letter code), flag2.",
  upcomingLeague: "Give next 5 league hockey matches as JSON array: team1, team2, date, time, league_name, flag1 (ISO 2-letter code), flag2.",
  liveLeague: "Give 5 current live league hockey matches in JSON array with: team1, team2, score1, score2, time, period, venue, last_play, league_name, flag1, flag2 (ISO 2-letter codes)."
};

// ---------------------- All Combined ----------------------
exports.getAllMatches = async (req, res) => {
  try {
    const [
      pastInternational,
      upcomingInternational,
      liveInternational,
      pastLeague,
      upcomingLeague,
      liveLeague
    ] = await Promise.all([
      fetchMatches(prompts.pastInternational),
      fetchMatches(prompts.upcomingInternational),
      fetchMatches(prompts.liveInternational),
      fetchMatches(prompts.pastLeague),
      fetchMatches(prompts.upcomingLeague),
      fetchMatches(prompts.liveLeague)
    ]);

    res.json({
      past: {
        international: pastInternational,
        league: pastLeague
      },
      upcoming: {
        international: upcomingInternational,
        league: upcomingLeague
      },
      live: {
        international: liveInternational,
        league: liveLeague
      }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ---------------------- Individual ----------------------
exports.getPastInternational = async (req, res) => {
  res.json(await fetchMatches(prompts.pastInternational));
};

exports.getUpcomingInternational = async (req, res) => {
  res.json(await fetchMatches(prompts.upcomingInternational));
};

exports.getLiveInternational = async (req, res) => {
  res.json(await fetchMatches(prompts.liveInternational));
};

exports.getPastLeague = async (req, res) => {
  res.json(await fetchMatches(prompts.pastLeague));
};

exports.getUpcomingLeague = async (req, res) => {
  res.json(await fetchMatches(prompts.upcomingLeague));
};

exports.getLiveLeague = async (req, res) => {
  res.json(await fetchMatches(prompts.liveLeague));
};
