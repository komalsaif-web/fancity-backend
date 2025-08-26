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

// ---------------- Prompts for Formula-1 ----------------
const prompts = {
  pastRaces: "Give last 5 Formula 1 races in JSON array with: race_name, circuit, country, winner, date, flag (ISO 2-letter code).",
  upcomingRaces: "Give next 5 Formula 1 races as JSON array: race_name, circuit, country, date, time, flag (ISO 2-letter code).",
  liveRaces: "Give 5 current live Formula 1 races in JSON array with: race_name, circuit, country, lap, total_laps, leader, time_elapsed, flag (ISO 2-letter code)."
};

// ---------------------- All Combined ----------------------
exports.getAllMatches = async (req, res) => {
  console.log("🚀 getAllMatches called");
  try {
    const [pastRaces, upcomingRaces, liveRaces] = await Promise.all([
      fetchMatches(prompts.pastRaces),
      fetchMatches(prompts.upcomingRaces),
      fetchMatches(prompts.liveRaces)
    ]);

    res.json({
      past: pastRaces,
      upcoming: upcomingRaces,
      live: liveRaces
    });
  } catch (err) {
    console.error("❌ getAllMatches error:", err);
    res.status(500).json({ error: err.message });
  }
};
