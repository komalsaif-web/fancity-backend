const axios = require("axios");

const GROQ_API_KEY = "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";

const PROPERTY_PROMPT = `
You are a Property Assistant.
You ONLY ask and answer questions related to buying, renting, or selling properties.
Ask users relevant questions like:
- "What type of property are you interested in (apartment, villa, townhouse)?"
- "Which location do you prefer?"
- "What is your budget or price range?"
- "How many bedrooms or bathrooms do you need?"
Keep responses short, helpful, and conversational.
If the user asks anything unrelated, reply:
"Sorry — I only answer property-related questions."
`;

const handleChat = async (req, res) => {
  try {
    const { message } = req.body;
    if (!message || message.trim() === "") {
      return res.status(400).json({ error: "Message cannot be empty" });
    }

    const response = await axios.post(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        model: "llama-3.3-70b-versatile",
        messages: [
          { role: "system", content: PROPERTY_PROMPT },
          { role: "user", content: message },
        ],
      },
      {
        headers: {
          Authorization: `Bearer ${GROQ_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    const reply = response.data.choices[0]?.message?.content || "No response.";
    res.json({ reply });
  } catch (err) {
    console.error("Groq API Error:", err.response?.data || err.message);
    res.status(500).json({ error: "Groq API failed" });
  }
};

module.exports = { handleChat };
