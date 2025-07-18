const { askGroq } = require('../services/groqservice');

// Prompt example to train AI
const sportsPrompt = (sport) => `
You are a live sports assistant. Always answer in real-time style.
Give me the latest live score or upcoming matches for: ${sport}.
Reply in this format:
1. Match: [Team A] vs [Team B]
2. Time: [Time or LIVE with score]
3. League/Tournament: [League name]
Only show 10 matches max.
`;

exports.getLiveSports = async (req, res) => {
  const { sport } = req.params;

  if (!sport) return res.status(400).json({ error: 'Sport is required' });

  try {
    const response = await askGroq(sportsPrompt(sport));
    res.json({ sport, result: response });
  } catch (error) {
    res.status(500).json({ error: 'Something went wrong' });
  }
};