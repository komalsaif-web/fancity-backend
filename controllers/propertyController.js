const axios = require("axios");
require("dotenv").config();

const GROQ_API_KEY = process.env.GROQ_API_KEY;

// --- Full Property Q&A (All 50 questions included) ---
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
Q11: What’s the price range for properties in JVC?
A11: Prices start from AED 550,000 for select units and go up to AED 1.2M depending on size, location, and features.
Q12: What’s the difference between Listed Properties and Limited Disclosure Properties?
A12: Listed Properties show full details publicly. Limited Disclosure Properties offer partial information and require direct contact to unlock full specs and pricing.
Q13: Can I view commercial land listings?
A13: Yes. We feature commercial freehold land in Dubai starting at $2.5M for 3,500 sq m plots. These are available under both full and limited disclosure categories.
Q14: What is Not in Market? 
A14: Not in Market is a Dubai-registered real estate brokerage built on trust, transparency, and direct connections. We specialize in off-plan, distress, and ready properties ranging from AED 300,000 to AED 1 billion.
Q15: What makes your platform different from others? 
A15: We eliminate noise and middlemen. Our listings are verified, our workflows are transparent, and we connect buyers and sellers directly — no inflated specs or vague pricing.
Q16: Do you work with certified projects only?
A16: Yes. We only list properties from certified and authentic developers. Every listing goes through a verification process before appearing publicly.
Q17: What is the Not in Market Newsroom?
A17: It’s our hub for property market updates, press releases, and expert insights. We offer timely reporting and verified sources to help investors and industry professionals make informed decisions.
Q18: What kind of stories can I find in the Newsroom? 
A18: You’ll find market insights, company updates, off-plan highlights, verified property features, investor tips, and press releases — all curated for clarity and relevance.
Q19: How often is the Newsroom updated?
A19: We update it regularly with fresh stories, expert opinions, and market comparisons. You can subscribe to stay informed.
Q20: What is The Market Brief?
A20: The Market Brief is our weekly newsletter featuring concise market summaries, headlines, and expert takeaways tailored for investors and press.
Q21: How do I subscribe to The Market Brief? 
A21: Just enter your email in the subscription box on our Newsroom page. You’ll receive weekly insights directly in your inbox.
Q22: Who is The Market Brief for?
A22: It’s designed for investors, journalists, and real estate professionals who want quick, verified updates on Dubai’s property market.
Q23: What’s the difference between Damac and Sobha?
A23: Our editorial team compares developers like Damac and Sobha in terms of design, delivery, and investment performance. You can read detailed comparisons in our Market Insights section.
Q24: Are smart homes becoming more popular in Dubai?
A24: Yes. Smart home features like app-controlled lighting, security, and climate systems are increasingly common in new developments. We highlight these trends in our Featured Stories.
Q25: How do I list my property on Not in Market?
A25: Click “List your property” and follow the four-step process: Submit basic info, Verify identity and authority, Upload required documents, Wait for approval after verification.
Q26: Can I list a property if I’m not the owner?
A26: Yes, but you must be an authorized broker, appointed agent, or representative with a valid mandate or authorization letter.
Q27: Who can list a property on your platform?
A27: Owners, Appointed Agents, Private Offices, and Authorized Brokers can list properties. Each role has its own verification requirements.
Q28: What are my options for submitting a listing? 
A28: You can choose “Call me to list” for concierge support, or “I will list myself” to complete the process independently.
Q29: What happens after I submit a listing? 
A29: You’ll receive an email confirmation, and a Senior Property Consultant will contact you to verify details, discuss marketing, and guide next steps.
Q30: How does listing verification work?
A30: Our team reviews your documents and confirms ownership. Only verified listings appear publicly. Sensitive filters are shared privately upon verified interest.
Q31: Why do you verify listings before publishing? 
A31: To protect buyers and sellers from misinformation, inflated specs, or unauthorized listings. Verification builds trust and ensures transparency.
Q32: What does “Choose Your Role” mean on the How We Work page? 
A32: It helps you identify whether you’re a buyer or seller so we can guide you through the right workflow — from browsing listings to closing deals.
Q33: Where can I find your privacy policy?
A33: You’ll find it in the footer of our website under “Privacy Policy.” It explains how we handle your data and protect your information.
Q34: Is there a way to contact support directly? 
A34: Yes. You can use the “Contact Us” link in the top navigation or email us at contact@notinthemarket.com.
Q35: Do I need to create an account to browse listings?
A35: No account is needed to browse. But if you want to list a property or connect with an agent, you’ll need to sign up or log in.
Q36: Can I filter listings by furnished vs. unfurnished? 
A36: Yes. Listings clearly indicate furnishing status. You can browse both furnished and unfurnished options depending on your preference.
Q37: What does “Off-plan” mean in your listings?
A37: Off-plan means the property is available for purchase before construction is completed. These listings often come with flexible payment plans and investment potential.
Q38: What’s the difference between “View Details” and “Connect with Agent”? 
A38: “View Details” shows full specs and images. “Connect with Agent” lets you speak directly with a consultant for personalized guidance.
Q39: Are your listings suitable for investors?
A39: Absolutely. We feature off-plan, distress, and verified opportunities across a wide price range — ideal for both first-time and seasoned investors.
Q40: How do I know if a property is a good investment?
A40: Our Newsroom and Market Brief offer expert insights, developer comparisons, and verified data to help you make informed decisions.
Q41: Why do you require a title deed or ownership proof?
A41: To ensure every listing is legitimate and protect buyers from fraud. We only publish listings that pass our verification process.
Q42: What happens if my documents are incomplete? 
A42: Our team will reach out to help you complete your submission. Listings won’t go live until all required documents are verified.
Q43: What kind of insights does the Newsroom offer? 
A43: We cover developer comparisons, off-plan trends, buyer trust signals, smart home innovations, and verified listing strategies — all tailored for Dubai’s property market.
Q44: Are the stories in the Newsroom verified?
A44: Yes. We only publish content backed by verified sources and market data. Our editorial team ensures accuracy and relevance.
Q45: Who is the Newsroom for? 
A45: It’s designed for investors, journalists, developers, and serious buyers who want clear, timely, and trustworthy market intelligence.
Q46: What’s the story behind “Luxury Living Redefined in JVC”?
A46: It highlights Azco Real Estate’s latest luxury project in Jumeirah Village Circle, showcasing design, amenities, and investment appeal.
Q47: What’s the Damac vs. Sobha comparison about? 
A47: It’s a side-by-side editorial comparing two leading developers in Dubai — covering delivery timelines, design quality, and buyer sentiment.
Q48: What’s the importance of verified listings in your stories?
A48: Verified listings build buyer trust by ensuring specs, ownership, and pricing are accurate. We spotlight this in both editorial and platform workflows.
Q49: How do I subscribe to Newsroom updates?
A49: Just enter your email in the orange “Subscribe” box on the Newsroom page. You’ll receive The Market Brief weekly.
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
