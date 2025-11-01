const axios = require("axios");
require("dotenv").config();

const GROQ_API_KEY = process.env.GROQ_API_KEY;

// --- Yalla Nellab Q&A ---
const YALLA_NELLAB_QA = `
Q1: What is Yalla Nellab?
A1: Yalla Nellab is a UAE-based community sports organization redefining access to sports across the Middle East. We host inclusive tournaments and events that unite people through Jujitsu, Cricket, and Football.
Q2: What does “Play Without Barriers” mean?
A2: It’s our philosophy — that sport should be open to everyone, regardless of age, gender, background, or ability. We build communities where everyone can belong, move, and play freely.
Q3: Is Yalla Nellab a sports club or an organization?
A3: Yalla Nellab is an inclusive sports organization, not a club. We focus on community-driven events, CSR leagues, and initiatives that promote equality through sport.
Q4: Where is Yalla Nellab based?
A4: We’re headquartered in the United Arab Emirates, with growing community networks and events across the Middle East.
Q5: Which sports does Yalla Nellab promote?
A5: Our primary focus is on Jujitsu, Cricket, and Football — sports that unite communities through teamwork, respect, and resilience.
Q6: How can I join a Yalla Nellab event?
A6: You can register online for any open event or tournament. Once registered, simply show up and play — no trials or divisions required.
Q7: What are Open Events?
A7: Open Events are casual community games where anyone can participate. They’re designed to connect people from all walks of life through sport and fun.
Q8: Do I need to be an athlete to participate?
A8: Not at all! Our events are built for everyone — beginners, hobby players, and professionals alike.
Q9: Are your events free or paid?
A9: Most of our community events are free or supported by sponsors. Some leagues may have minimal registration fees to cover logistics and facilities.
Q10: Can women participate in Yalla Nellab events?
A10: Absolutely. Yalla Nellab promotes gender inclusion — everyone is welcome to join and play.
Q11: What is BloomDay?
A11: BloomDay is Yalla Nellab’s signature event that empowers individuals with physical or mental disabilities through adaptive sports and inclusive play.
Q12: Who can join BloomDay?
A12: Anyone with a disability who wants to experience the joy of sport in a safe, welcoming environment supported by trained volunteers.
Q13: How is BloomDay different from other events?
A13: BloomDay is built around safety, inclusion, and empowerment — it uses adapted equipment, personalized support, and accessible venues.
Q14: Are volunteers trained for BloomDay?
A14: Yes. All volunteers receive guidance on working with participants with disabilities to ensure a respectful and supportive experience.
Q15: Can organizations sponsor BloomDay?
A15: Definitely. We welcome corporate and community partners to sponsor or volunteer in BloomDay initiatives to expand impact.
Q16: What is the Heroes Cup?
A16: The Heroes Cup is Yalla Nellab’s corporate social responsibility tournament that celebrates UAE labour workers through competitive and community-driven football.
Q17: Who participates in the Heroes Cup?
A17: Labour workers across the UAE represent their companies and communities in a spirit of equality, teamwork, and pride.
Q18: How can a company take part in the Heroes Cup?
A18: Companies can register teams, sponsor uniforms, and join hands with their workers in this CSR-driven tournament.
Q19: Why is it called the “Heroes Cup”?
A19: Because it honours the unsung heroes of the nation — labour workers — and gives them a platform to be celebrated beyond their daily work.
Q20: How does the Heroes Cup support CSR goals?
A20: It helps organizations strengthen employee engagement, promote inclusion, and showcase social responsibility through sport.
Q21: What kind of impact has Yalla Nellab created?
A21: We’ve united hundreds of people — workers, students, professionals, and individuals with disabilities — through shared sporting experiences.
Q22: What is Yalla Nellab’s main goal?
A22: To build a lasting movement where sport becomes a bridge of connection, equality, and empowerment across the Middle East.
Q23: Do you collaborate with schools or universities?
A23: Yes. We partner with educational institutions for inclusive tournaments and community engagement programs.
Q24: How does Yalla Nellab measure its impact?
A24: By tracking participation, community feedback, and partnerships that promote sustainable inclusion in sports.
Q25: Can local communities host Yalla Nellab events?
A25: Absolutely. We collaborate with local organizers and volunteers to bring Yalla Nellab’s inclusive model to new areas.
Q26: How do I register for an event?
A26: Visit our website or social media pages to find upcoming events. Each listing includes an easy registration form and participation details.
Q27: Do I need to sign up for an account?
A27: No account is required to browse events, but you’ll need to sign up to register as a participant or volunteer.
Q28: Can companies sponsor Yalla Nellab tournaments?
A28: Yes. We offer partnership opportunities for companies interested in supporting inclusive sports and CSR initiatives.
Q29: Are there different categories for players?
A29: No — Yalla Nellab’s events are designed without barriers. Everyone plays together in a fair, friendly environment.
Q30: What happens after I register?
A30: You’ll receive confirmation and event details via email or WhatsApp, along with match timings and location info.
Q31: Does Yalla Nellab use AI-generated images?
A31: No. We only use authentic photographs from real participants and events to represent our community truthfully.
Q32: What inspires your website design and storytelling style?
A32: We take inspiration from Right To Play’s approach — real stories, real people, and impactful visuals that reflect true inclusion.
Q33: How often do you update your website or news section?
A33: Regularly. We share updates about upcoming tournaments, partnerships, and impact stories as our community grows.
Q34: Can I feature my story on Yalla Nellab’s website?
A34: Yes! We love highlighting participant experiences that reflect teamwork, inclusion, and community connection.
Q35: How do you ensure authenticity in your content?
A35: Every story, image, and statistic we share is verified by our team to ensure accuracy and transparency.
Q36: What’s next for Yalla Nellab?
A36: We’re expanding our programs across the Middle East, building larger leagues, and introducing more inclusive sporting platforms.
Q37: Does Yalla Nellab plan to add new sports?
A37: Yes. As our community grows, we plan to include more sports that align with our mission of accessibility and inclusion.
Q38: How can I collaborate with Yalla Nellab?
A38: You can reach out via our contact form or email to explore partnership, sponsorship, or volunteer opportunities.
Q39: Is Yalla Nellab open to international participants?
A39: Yes. While our events are UAE-based, participants from across the Middle East and beyond are welcome to join.
Q40: How can I contact Yalla Nellab for media or sponsorship inquiries?
A40: Use the “Contact Us” section on our website or email our team directly. We’ll connect you with the right department for collaboration.
`;

// --- System Prompt ---
const YALLA_PROMPT = `
You are a Yalla Nellab Assistant.
Use ONLY the following Q&A to answer users' questions:

${YALLA_NELLAB_QA}

If the user asks anything unrelated, reply:
"Sorry — I only answer Yalla Nellab-related questions."
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
          { role: "system", content: YALLA_PROMPT },
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
