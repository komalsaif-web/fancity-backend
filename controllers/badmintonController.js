
const axios = require('axios');
const API_KEY = 'ds97BaJKOeSpS2grjXoyqIwAhbLelwbj6BtWr0or';
const BASE_URL = 'https://api.sportradar.com/badminton/trial/v1/en';

function getFormattedDate(offsetDays = 0) {
  const date = new Date();
  date.setDate(date.getDate() + offsetDays);
  return date.toISOString().split('T')[0]; // Format: YYYY-MM-DD
}

// Live matches (Today’s date)
exports.getLiveMatches = async (req, res) => {
  try {
    const today = getFormattedDate();
    const response = await axios.get(`${BASE_URL}/schedules/${today}/schedule.json?api_key=${API_KEY}`);
    const matches = response.data.sport_events || [];
    const liveMatches = matches.filter(match => match.status && match.status.match_status === 'live');
    res.json(liveMatches);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching live matches', error: error.message });
  }
};

// Upcoming matches (Tomorrow’s date)
exports.getUpcomingMatches = async (req, res) => {
  try {
    const tomorrow = getFormattedDate(1);
    const response = await axios.get(`${BASE_URL}/schedules/${tomorrow}/schedule.json?api_key=${API_KEY}`);
    const matches = response.data.sport_events || [];
    res.json(matches);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching upcoming matches', error: error.message });
  }
};

// Past matches (Yesterday’s date)
exports.getPastMatches = async (req, res) => {
  try {
    const yesterday = getFormattedDate(-1);
    const response = await axios.get(`${BASE_URL}/schedules/${yesterday}/schedule.json?api_key=${API_KEY}`);
    const matches = response.data.sport_events || [];
    res.json(matches);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching past matches', error: error.message });
  }
};
