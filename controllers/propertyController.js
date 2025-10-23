const axios = require("axios");
require("dotenv").config();

const GROQ_API_KEY = process.env.GROQ_API_KEY;

// --- Full Property Q&A ---
const PROPERTY_QA = `
Q1: What documents do I need to list a property?
A1: You’ll need proof of ownership or title deed, a valid ID or trade license, and any supporting documents if you're a broker or third party.
Q2: Can I list a property if I’m not the owner?
A2: Yes, but you must be an authorized broker, appointed agent, or representative with a valid mandate or authorization letter.
Q3: How does Not in Market help me close faster? 
A3: We streamline documentation, verify listings upfront, and connect you directly with qualified parties — reducing delays and boosting confidence.
Q4: How do I search for properties in Dubai? 
A4: Use the dropdown filters at the top of the homepage to select country, city, area, and view type. Then click the yellow “Search” button to see listings tailored to your criteria.
Q5: What types of properties are available in Palm, Dubai?
A5: We currently feature 4-bedroom villas starting at AED 4.2M, as well as furnished and unfurnished high-rise apartments ranging from AED 2.9M to AED 3.1M.
Q6: What does “Verified Listing” mean? 
A6: Verified Listings have been reviewed by our team for ownership, documentation, and accuracy. They include a badge and offer added confidence for buyers.
Q7: Are there off-plan properties available? 
A7: Yes. Listings like Avana Residences in JVC District 10 are off-plan, meaning they’re available for purchase before construction is completed. These often come with flexible payment plans and investment potential.
Q8: What details are included in a property’s specifications?
A8: Each listing includes specs like number of bedrooms and bathrooms, square footage, balconies, amenities (e.g. pool, gym), and security features.
Q9: Can I compare similar properties? 
A9: Yes. Below each listing, you’ll find a “Similar Properties” section showing other options with comparable specs and pricing.
Q10: What are distress properties, and do you list them? 
A10: Distress properties are listings priced below market value due to urgent sale conditions — such as financial pressure, relocation, or liquidation. Yes, we feature verified distress opportunities across Dubai, often with flexible terms and fast closing potential. These listings are clearly marked and go through the same verification process as all others.
...
Q50: How do I know if a listing is verified? 
A50: Verified listings display a badge and include full specs, ownership confirmation, and consultant support. These are reviewed by our team before going live.
`;

// --- System Prompt with all Q&A ---
const PROPERTY_PROMPT = `
You are a Property Assistant.
Use ONLY the following Q&A to answer users' property-related questions:

${PROPERTY_QA}

If the user asks anything unrelated, reply:
"Sorry — I only answer property-related questions."
Keep answers short, helpful, and conversational.
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
