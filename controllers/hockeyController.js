const API_KEY = process.env.GROQ_API_KEY;
const ENDPOINT = "https://api.groq.com/openai/v1/chat/completions";

// --- Utility to fetch and safely parse JSON from Groq ---
async function fetchMatches(prompt) {
  console.log("🟡 Fetching with prompt:", prompt);
  console.log("🔑 Using API_KEY:", API_KEY ? "✅ Set" : "❌ MISSING");

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

    console.log("📡 Groq status:", res.status);
    const data = await res.json();
    console.log("📦 Raw Groq Response:", JSON.stringify(data, null, 2));

    if (!data.choices || !data.choices[0]?.message?.content) {
      console.error("❌ No content from Groq");
      return [];
    }

    let text = data.choices[0].message.content.trim();
    console.log("📝 Raw AI text:", text);

    // Extract JSON from code block if needed
    const codeBlockMatch = text.match(/```(?:json)?([\s\S]*?)```/i);
    if (codeBlockMatch) {
      text = codeBlockMatch[1].trim();
      console.log("🔍 Extracted JSON text:", text);
    }

    const parsed = JSON.parse(text);
    console.log("✅ Parsed JSON:", parsed);
    return parsed;

  } catch (err) {
    console.error("❌ fetchMatches error:", err);
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
  console.log("🚀 getAllMatches called");
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
    console.error("❌ getAllMatches error:", err);
    res.status(500).json({ error: err.message });
  }
};
