const axios = require("axios");
require("dotenv").config();

const GROQ_API_KEY = process.env.GROQ_API_KEY;

// --- Controller with embedded PowerCourses Q&A + study fallback ---
const handlePowercoursesChat = async (req, res) => {
  try {
    const { message } = req.body;
    if (!message || message.trim() === "") {
      return res.status(400).json({ error: "Message cannot be empty" });
    }

    // --- Full PowerCourses Q&A ---
    const POWERCOURSES_QA = `
Q: What is PowerCourses? 
A: PowerCourses is a smart learning platform that empowers students, parents, and schools through personalized, AI-driven education tools.

Q: Who can use PowerCourses? 
A: Students, parents, teachers, and school administrators — each has tailored tools to support learning, tracking, and planning.

Q: What makes PowerCourses different from other platforms? 
A: We focus on outcomes, not just content. Every feature is designed to unlock opportunities and help learners thrive.

Q: Is PowerCourses available internationally? 
A: Yes! We support global curricula like IB, Cambridge, CBSE, and more — and we’re expanding across regions including the Middle East.

Q: How do I sign up or log in? 
A: Click the “Login” or “Sign Up” button at the top of the homepage to access your dashboard or create a new account.

📱 Products & Features
Q: What is EDU Concierge? 
A: EDU Concierge is your personal education manager — helping you plan lessons, track progress, and connect with experts.

Q: What does the Spark App do? 
A: Spark is a mobile app that offers AI-powered study support, personalized learning plans, and progress tracking for students and parents.

Q: Can I use EDU Concierge and Spark together? 
A: Yes! They’re designed to work seamlessly — Spark handles daily learning, while EDU Concierge manages your overall academic journey.

Q: What is the Education Manager service? 
A: It’s a dedicated expert who helps organize your child’s study routine, schedules sessions, and keeps you informed every step of the way.

Q: What dashboards are available? 
A: Students get a learning dashboard, parents can track progress, and teachers use a dashboard to assign support and monitor outcomes.

💸 Pricing & Plans
Q: What plans are available for EDU Concierge? 
A: We offer Basic (AED 30/month), Plus (AED 200/month), and Annual Basic (AED 375/year) — each with different support levels.

Q: What’s included in the Basic plan? 
A: A dedicated Edu Manager, support for one student, and live assistance — but no foundation or school fee support.

Q: What’s the difference between Basic and Plus? 
A: Plus supports up to 5 students and includes foundation and school fee support — ideal for families with multiple learners.

Q: Are there free plans available? 
A: Yes! Spark offers a free plan with limited mentor and AI access, plus basic dashboard features.

Q: Can I switch plans anytime? 
A: Absolutely. Our plans are customizable — you can upgrade, downgrade, or switch based on your learning needs.

🎁 Social Impact & Trust
Q: What is the Quarterly Lottery? 
A: It’s a self-funded raffle that offers back-to-school vouchers and financial support to families — currently available in the UAE.

Q: Is the lottery fair and transparent? 
A: Yes! Every participant has an equal chance, and the process is designed to be open and trustworthy.

Q: Are teachers qualified? 
A: All our educators are certified and experienced in global curricula like IB, Cambridge, CBSE, and more.

Q: How does PowerCourses ensure quality? 
A: We follow top learning standards, use vetted resources, and offer transparent pricing with no hidden fees.

Q: Can I trust the platform with my child’s education? 
A: Definitely. Thousands of students, parents, and schools rely on PowerCourses — and our testimonials speak for themselves.

🚀 Onboarding & Support
Q: How do I get started with Spark? 
A: Download the app, select your user type, choose a plan, and begin your personalized learning journey.

Q: What user types can I choose in Spark? 
A: You can sign up as a student, parent, or teacher — each experience is tailored to your role.

Q: Does Spark offer AI chat support? 
A: Yes! Spark’s AI assistant helps with homework, study planning, and learning guidance.

Q: How do parents stay involved? 
A: Parents get a dashboard to track progress, receive updates, and stay connected to their child’s learning journey.

Q: Where can I learn more about each feature? 
A: Just click “Explore” or “Learn More” next to any feature or plan — or ask me here and I’ll guide you!

Q: What’s the difference between Spark and EDU Concierge, and how does EDU Concierge work for schools? 
A: Spark is a mobile app designed for students and parents — it offers AI-powered study support, personalized learning plans, and real-time progress tracking. EDU Concierge provides a dedicated education manager who helps organize lessons, track academic progress, and connect with mentors. For schools, EDU Concierge is fully customized with branding, dashboards, and teacher/admin tools to manage learning across classrooms.
`;

    // --- System Prompt ---
    const POWERCOURSES_PROMPT = `
You are a PowerCourses Assistant.
Use ONLY the following Q&A to answer users' questions:

${POWERCOURSES_QA}

If the user asks anything unrelated, but it is study/education related (like homework, learning, students, exam), give a helpful generic study answer.
If the question is completely unrelated, reply:
"Sorry — I only answer PowerCourses or study-related questions."
Keep answers short, helpful, and conversational.
`;

    // --- Call Groq API ---
    const response = await axios.post(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        model: "llama-3.3-70b-versatile",
        messages: [
          { role: "system", content: POWERCOURSES_PROMPT },
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

module.exports = { handlePowercoursesChat };
