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

// --- Prompts for F1, International, and League ---
const prompts = {
  // Formula 1
  past: "Give last 5 Formula 1 races in JSON array with: race_name, date, winner, country, flag (ISO code).",
  upcoming: "Give next 5 Formula 1 races in JSON array with: race_name, date, time, country, flag (ISO code).",
  live: "Give 3 current live Formula 1 races in JSON array with: race_name, lap, leader, country, flag (ISO code), status.",

  // International
  pastInternational: "Give last 5 International races in JSON array with: race_name, date, winner, country, flag (ISO code).",
  upcomingInternational: "Give next 5 International races in JSON array with: race_name, date, time, country, flag (ISO code).",
  liveInternational: "Give 3 current live International races in JSON array with: race_name, lap, leader, country, flag (ISO code), status.",

  // League
  pastLeague: "Give last 5 League races in JSON array with: race_name, date, winner, country, flag (ISO code).",
  upcomingLeague: "Give next 5 League races in JSON array with: race_name, date, time, country, flag (ISO code).",
  liveLeague: "Give 3 current live League races in JSON array with: race_name, lap, leader, country, flag (ISO code), status.",
};

// --- Formula 1 Controllers ---
exports.getPastRaces = async (req, res) => {
  const data = await fetchMatches(prompts.past);
  res.json({ success: true, races: data });
};

exports.getUpcomingRaces = async (req, res) => {
  const data = await fetchMatches(prompts.upcoming);
  res.json({ success: true, races: data });
};

exports.getLiveRaces = async (req, res) => {
  const data = await fetchMatches(prompts.live);
  res.json({ success: true, races: data });
};

// --- International Controllers ---
exports.getPastInternationalRaces = async (req, res) => {
  const data = await fetchMatches(prompts.pastInternational);
  res.json({ success: true, races: data });
};

exports.getUpcomingInternationalRaces = async (req, res) => {
  const data = await fetchMatches(prompts.upcomingInternational);
  res.json({ success: true, races: data });
};

exports.getLiveInternationalRaces = async (req, res) => {
  const data = await fetchMatches(prompts.liveInternational);
  res.json({ success: true, races: data });
};

// --- League Controllers ---
exports.getPastLeagueRaces = async (req, res) => {
  const data = await fetchMatches(prompts.pastLeague);
  res.json({ success: true, races: data });
};

exports.getUpcomingLeagueRaces = async (req, res) => {
  const data = await fetchMatches(prompts.upcomingLeague);
  res.json({ success: true, races: data });
};

exports.getLiveLeagueRaces = async (req, res) => {
  const data = await fetchMatches(prompts.liveLeague);
  res.json({ success: true, races: data });
};