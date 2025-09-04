const API_KEY = process.env.GROQ_API_KEY;
const ENDPOINT = "https://api.groq.com/openai/v1/chat/completions";

// --- Utility to fetch and safely parse JSON from Groq ---
async function fetchMatches(prompt) {
  try {
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
      return [];
    }

    let text = data.choices[0].message.content.trim();

    // Extract JSON if wrapped in code block
    const codeBlockMatch = text.match(/```(?:json)?([\s\S]*?)```/i);
    if (codeBlockMatch) {
      text = codeBlockMatch[1].trim();
    }

    return JSON.parse(text);
  } catch (err) {
    console.error("❌ fetchMatches error:", err);
    return [];
  }
}

// --- Prompts ---
const prompts = {
  past: "Give last 5 Basketball matches in JSON array with: match_name, date, winner, country, flag (ISO code).",
  upcoming: "Give next 5 Basketball matches in JSON array with: match_name, date, time, country, flag (ISO code).",
  live: "Give 3 current live Basketball matches in JSON array with: match_name, quarter, leader, country, flag (ISO code), status.",

  pastInternational: "Give last 5 International Basketball matches in JSON array with: match_name, date, winner, country, flag (ISO code).",
  upcomingInternational: "Give next 5 International Basketball matches in JSON array with: match_name, date, time, country, flag (ISO code).",
  liveInternational: "Give 3 current live International Basketball matches in JSON array with: match_name, quarter, leader, country, flag (ISO code), status.",

  pastLeague: "Give last 5 League Basketball matches in JSON array with: match_name, date, winner, country, flag (ISO code).",
  upcomingLeague: "Give next 5 League Basketball matches in JSON array with: match_name, date, time, country, flag (ISO code).",
  liveLeague: "Give 3 current live League Basketball matches in JSON array with: match_name, quarter, leader, country, flag (ISO code), status.",
};

// --- Controllers ---
exports.getPastMatches = async (req, res) => {
  const data = await fetchMatches(prompts.past);
  res.json({ success: true, matches: data });
};

exports.getUpcomingMatches = async (req, res) => {
  const data = await fetchMatches(prompts.upcoming);
  res.json({ success: true, matches: data });
};

exports.getLiveMatches = async (req, res) => {
  const data = await fetchMatches(prompts.live);
  res.json({ success: true, matches: data });
};

// International
exports.getPastInternationalMatches = async (req, res) => {
  const data = await fetchMatches(prompts.pastInternational);
  res.json({ success: true, matches: data });
};

exports.getUpcomingInternationalMatches = async (req, res) => {
  const data = await fetchMatches(prompts.upcomingInternational);
  res.json({ success: true, matches: data });
};

exports.getLiveInternationalMatches = async (req, res) => {
  const data = await fetchMatches(prompts.liveInternational);
  res.json({ success: true, matches: data });
};

// League
exports.getPastLeagueMatches = async (req, res) => {
  const data = await fetchMatches(prompts.pastLeague);
  res.json({ success: true, matches: data });
};

exports.getUpcomingLeagueMatches = async (req, res) => {
  const data = await fetchMatches(prompts.upcomingLeague);
  res.json({ success: true, matches: data });
};

exports.getLiveLeagueMatches = async (req, res) => {
  const data = await fetchMatches(prompts.liveLeague);
  res.json({ success: true, matches: data });
};
