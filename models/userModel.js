const pool = require('../config/db');

// ✅ Create new user
const createUser = async (name, email, phone, hashedPassword) => {
  const result = await pool.query(
    'INSERT INTO fancity_users (name, email, phone, password) VALUES ($1, $2, $3, $4) RETURNING *',
    [name, email, phone, hashedPassword]
  );
  return result.rows[0];
};

const findUserByEmail = async (email) => {
  const result = await pool.query(
    'SELECT * FROM fancity_users WHERE email = $1',
    [email]
  );
  return result.rows[0];
};

const findUserByPhone = async (phone) => {
  const result = await pool.query(
    'SELECT * FROM fancity_users WHERE phone = $1',
    [phone]
  );
  return result.rows[0];
};

const updateUserPassword = async (userId, hashedPassword) => {
  await pool.query(
    'UPDATE fancity_users SET password = $1 WHERE id = $2',
    [hashedPassword, userId]
  );
};

const updateUserOtp = async (userId, otp, expireMs) => {
  const expire = new Date(expireMs);
  await pool.query(
    'UPDATE fancity_users SET otp = $1, otp_expire = $2 WHERE id = $3',
    [otp, expire, userId]
  );
};

const verifyOtp = async (email, otp) => {
  const result = await pool.query(
    'SELECT * FROM fancity_users WHERE email = $1 AND otp = $2 AND otp_expire > NOW()',
    [email, otp]
  );
  return result.rows[0];
};

const markUserVerified = async (userId) => {
  await pool.query(
    'UPDATE fancity_users SET is_verified = true WHERE id = $1',
    [userId]
  );
};

const updateUserFields = async (userId, updates) => {
  const keys = Object.keys(updates);
  if (keys.length === 0) return false;

  const setClause = keys.map((key, index) => `${key} = $${index + 1}`).join(', ');
  const values = [...Object.values(updates), userId];
  const query = `UPDATE fancity_users SET ${setClause} WHERE id = $${keys.length + 1}`;

  const result = await pool.query(query, values);
  return result.rowCount > 0;
};

const getUserById = async (id) => {
  const result = await pool.query(
    'SELECT id, name, email, phone, is_verified FROM fancity_users WHERE id = $1',
    [id]
  );
  return result.rows[0];
};

const deleteUserById = async (userId) => {
  const result = await pool.query(
    'DELETE FROM fancity_users WHERE id = $1',
    [userId]
  );
  return result.rowCount > 0;
};

const getUserByEmail = async (email) => {
  const result = await pool.query(
    'SELECT id, name, email, phone, is_verified FROM fancity_users WHERE email = $1',
    [email]
  );
  return result.rows[0];
};

const getAllUsers = async () => {
  const result = await pool.query(
    'SELECT id, name, email, phone, is_verified FROM fancity_users ORDER BY created_at DESC'
  );
  return result.rows;
};

const deleteAllUsers = async () => {
  return await pool.query('DELETE FROM fancity_users');
};
// 🔹 Update saved_videos
const updateSavedVideos = async (userId, videos) => {
  const result = await pool.query(
    'UPDATE fancity_users SET saved_videos = $1 WHERE id = $2',
    [videos, userId]
  );
  return result.rowCount > 0;
};


// 🔹 Update continue_video
const updateContinueVideo = async (userId, video) => {
  const result = await pool.query(
    'UPDATE fancity_users SET continue_video = $1 WHERE id = $2',
    [video, userId]
  );
  return result.rowCount > 0;
};

// 🔹 Get saved_videos
const getSavedVideosByUserId = async (userId) => {
  const result = await pool.query(
    'SELECT saved_videos FROM fancity_users WHERE id = $1',
    [userId]
  );
  return result.rows[0]?.saved_videos || [];
};

// 🔹 Get continue_video
const getContinueVideoByUserId = async (userId) => {
  const result = await pool.query(
    'SELECT continue_video FROM fancity_users WHERE id = $1',
    [userId]
  );
  return result.rows[0]?.continue_video || null;
};
const updateUserVerification = async (userId) => {
  const result = await pool.query(
    'UPDATE fancity_users SET is_verified = true WHERE id = $1',
    [userId]
  );
  return result.rowCount > 0;
};
// 🔹 Save vote for a user
const updateUserVote = async (userId, teamName) => {
  const result = await pool.query(
    'UPDATE fancity_users SET vote = $1 WHERE id = $2',
    [teamName, userId]
  );
  return result.rowCount > 0;
};

// 🔹 Get all votes
const getAllVotes = async () => {
  const result = await pool.query(
    'SELECT id, name, email, vote FROM fancity_users WHERE vote IS NOT NULL'
  );
  return result.rows;
};

// ✅ Export all
module.exports = {
  createUser,
  getAllUsers,
  findUserByEmail,
  findUserByPhone,
  getUserByEmail,
  updateUserPassword,
  updateUserOtp,
  verifyOtp,
  markUserVerified,
  updateUserFields,
  getUserById,
  deleteUserById,
  deleteAllUsers,
   updateSavedVideos,
  updateContinueVideo,
  getSavedVideosByUserId,
  getContinueVideoByUserId,
  updateUserVerification,
   updateUserVote,
  getAllVotes
};
