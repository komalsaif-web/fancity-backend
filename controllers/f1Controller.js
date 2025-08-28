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

// --- Prompts for F1 ---
const prompts = {
  past: "Give last 5 Formula 1 races in JSON array with: race_name, date, winner, country, flag (ISO code).",
  upcoming: "Give next 5 Formula 1 races in JSON array with: race_name, date, time, country, flag (ISO code).",
  live: "Give 3 current live Formula 1 races in JSON array with: race_name, lap, leader, country, flag (ISO code), status.",
};

// --- Controllers ---
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
