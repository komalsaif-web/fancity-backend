const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const CryptoJS = require('crypto-js');

const {
  createUser,
  findUserByEmail,
  findUserByPhone,
  updateUserPassword,
  updateUserOtp,
  verifyOtp,
  markUserVerified,
  updateUserFields,
  getUserById,
  deleteUserById,
  getUserByEmail,
  getAllUsers,
  deleteAllUsers,
  updateSavedVideos,
  updateContinueVideo,
  getSavedVideosByUserId,
  getContinueVideoByUserId,
} = require('../models/userModel');

// 📧 Send OTP via email
const sendOtpEmail = async (email, otp) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });

  await transporter.sendMail({
    from: `"PHARMASENZ" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: 'Your OTP Code',
    text: `Your OTP is ${otp}. It will expire in 1 minute.`,
  });
};
// ✅ SIGNUP FUNCTION with token
const signup = async (req, res) => {
  try {
    const { name, email, phone, password } = req.body;

    // ✅ Only name, email, and password are required now
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email, and password are required' });
    }

    const existingUser = await findUserByEmail(email);
    if (existingUser) {
      return res.status(409).json({ message: 'User already exists with this email' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await createUser(name, email, phone || null, hashedPassword); // ✅ default to null if not provided

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '7d' });
    const encryptedToken = CryptoJS.AES.encrypt(token, process.env.ENCRYPTION_SECRET).toString();

    res.status(201).json({
      message: 'Signup successful. Please verify your email separately.',
      token: encryptedToken,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        is_verified: false
      }
    });
  } catch (error) {
    console.error('Signup Error:', error);
    res.status(500).json({ message: 'Signup failed', error: error.message });
  }
};

const sendOtp = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) return res.status(400).json({ message: 'Email is required' });

    const user = await findUserByEmail(email);
    if (!user) return res.status(404).json({ message: 'User not found' });

    if (user.is_verified) {
      return res.status(400).json({ message: 'User is already verified' });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expire = new Date(Date.now() + 60 * 1000); // expires in 1 minute

    await updateUserOtp(user.id, otp, expire);
    console.log(`Generated OTP for ${email}: ${otp}`);

    await sendOtpEmail(email, otp);

    res.status(200).json({ message: 'OTP sent successfully' });
  } catch (error) {
    console.error('❌ Send OTP Error:', error.message);
    res.status(500).json({ message: 'Failed to send OTP', error: error.message });
  }
};
// ✅ VERIFY OTP
const verifyOtpCode = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({ message: 'Email and OTP are required' });
    }

    const user = await verifyOtp(email, otp);
    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired OTP' });
    }

    await markUserVerified(user.id);

    res.status(200).json({ message: 'Email verified successfully. You can now log in.' });
  } catch (error) {
    console.error('OTP Verification Error:', error);
    res.status(500).json({ message: 'OTP verification failed', error: error.message });
  }
};

// ✅ LOGIN FUNCTION
const login = async (req, res) => {
  try {
    const { loginId, password } = req.body;

    if (!loginId || !password) {
      return res.status(400).json({ message: 'Email/Phone and Password are required' });
    }

    const user = loginId.includes('@')
      ? await findUserByEmail(loginId)
      : await findUserByPhone(loginId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (!user.is_verified) {
      return res.status(403).json({ message: 'Please verify your email before login' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '7d' });
    const encryptedToken = CryptoJS.AES.encrypt(token, process.env.ENCRYPTION_SECRET).toString();

    res.status(200).json({
      message: 'Login successful',
      token: encryptedToken,
      id: user.id,
      user: {
        name: user.name,
        email: user.email,
        phone: user.phone
      }
    });
  } catch (error) {
    console.error('Login Error:', error);
    res.status(500).json({ message: 'Login failed', error: error.message });
  }
};

// ✅ FORGOT PASSWORD
const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) return res.status(400).json({ message: 'Email is required' });

    const user = await findUserByEmail(email);
    if (!user) return res.status(404).json({ message: 'User not found' });

    res.status(200).json({ message: 'You can now reset your password' });
  } catch (error) {
    res.status(500).json({ message: 'Forgot password error', error: error.message });
  }
};

// ✅ RESET PASSWORD
const resetPassword = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and new password are required' });
    }

    const user = await findUserByEmail(email);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const hashed = await bcrypt.hash(password, 10);
    await updateUserPassword(user.id, hashed);

    res.status(200).json({ message: 'Password reset successful' });
  } catch (error) {
    res.status(500).json({ message: 'Password reset failed', error: error.message });
  }
};

// ✅ UPDATE USER INFO
const updateUserInfo = async (req, res) => {
  try {
    const userId = req.params.id;
    const { email, phone, password, name } = req.body;

    if (!userId) return res.status(400).json({ message: 'User ID is required' });
    if (!email && !phone && !password && !name) {
      return res.status(400).json({ message: 'At least one field is required to update' });
    }

    const updates = {};
    if (email) updates.email = email;
    if (phone) updates.phone = phone;
    if (name) updates.name = name;
    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      updates.password = hashedPassword;
    }

    const updated = await updateUserFields(userId, updates);

    if (updated) {
      res.status(200).json({ message: 'User updated successfully' });
    } else {
      res.status(500).json({ message: 'Update failed' });
    }
  } catch (error) {
    console.error('Update Error:', error);
    res.status(500).json({ message: 'Update failed', error: error.message });
  }
};

// ✅ GET USER BY ID
const getUserDetails = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!userId) return res.status(400).json({ message: 'User ID is required' });

    const user = await getUserById(userId);

    if (!user) return res.status(404).json({ message: 'User not found' });

    res.status(200).json({ user });
  } catch (error) {
    console.error('Get User Error:', error);
    res.status(500).json({ message: 'Failed to fetch user', error: error.message });
  }
};

// ✅ DELETE USER
const deleteUserAccount = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) return res.status(400).json({ message: 'User ID is required' });

    const deleted = await deleteUserById(id);
    if (deleted) {
      res.status(200).json({ message: 'User deleted successfully' });
    } else {
      res.status(404).json({ message: 'User not found or already deleted' });
    }
  } catch (error) {
    console.error('Delete User Error:', error);
    res.status(500).json({ message: 'Failed to delete user', error: error.message });
  }
};
const resendOtp = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) return res.status(400).json({ message: 'Email is required' });

    const user = await findUserByEmail(email);
    if (!user) return res.status(404).json({ message: 'User not found' });

    if (user.is_verified) {
      return res.status(400).json({ message: 'User is already verified' });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expire = new Date(Date.now() + 60 * 1000); // ✅ 1 minute expiry

    await updateUserOtp(user.id, otp, expire);
    await sendOtpEmail(email, otp);

    res.status(200).json({ message: 'OTP resent successfully' });
  } catch (error) {
    console.error('Resend OTP Error:', error);
    res.status(500).json({ message: 'Failed to resend OTP', error: error.message });
  }
};
// ✅ Get user by email controller
const getUserByEmailController = async (req, res) => {
  try {
    const { email } = req.params;

    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }

    const user = await getUserByEmail(email);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({ user });
  } catch (error) {
    console.error('Get User by Email Error:', error);
    res.status(500).json({ message: 'Failed to fetch user', error: error.message });
  }
};
const getAllUsersController = async (req, res) => {
  try {
    const users = await getAllUsers();
    res.status(200).json({ users });
  } catch (error) {
    console.error('Get All Users Error:', error);
    res.status(500).json({ message: 'Failed to fetch users', error: error.message });
  }
};

const deleteAllUsersController = async (req, res) => {
  try {
    const deleted = await deleteAllUsers();
    res.status(200).json({
      message: `All users deleted successfully (${deleted.rowCount} records removed)`
    });
  } catch (error) {
    console.error('Delete All Users Error:', error);
    res.status(500).json({ message: 'Failed to delete all users', error: error.message });
  }
};
// 🔹 Add to saved videos (using only video URL)
const addSavedVideo = async (req, res) => {
  const { id } = req.params;
  const { video_url, thumbnail_url } = req.body;

  if (!video_url || !thumbnail_url) {
    return res.status(400).json({ message: 'Video URL and Thumbnail URL are required' });
  }

  try {
    const user = await getUserById(id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const currentVideos = await getSavedVideosByUserId(id); // from DB
    const updatedVideos = [...currentVideos, { video_url, thumbnail_url }];

    await updateSavedVideos(id, JSON.stringify(updatedVideos)); // 💡 cast to JSON string

    res.status(200).json({
      message: 'Video added successfully',
      saved_videos: updatedVideos,
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to save video', error: error.message });
  }
};


// 🔹 Delete saved video by video_id
const deleteSavedVideo = async (req, res) => {
  const { id, videoUrl } = req.params;

  try {
    const user = await getUserById(id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const currentVideos = await getSavedVideosByUserId(id);

    const updatedVideos = currentVideos.filter(
      (v) => v.video_url !== videoUrl
    );

    await updateSavedVideos(id, JSON.stringify(updatedVideos));

    res.status(200).json({ message: 'Video removed', saved_videos: updatedVideos });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete video', error: error.message });
  }
};


// 🔹 Get saved videos
const getSavedVideos = async (req, res) => {
  const { id } = req.params;

  try {
    const user = await getUserById(id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const videos = await getSavedVideosByUserId(id);
    res.status(200).json({ saved_videos: videos });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch saved videos', error: error.message });
  }
};


// 🔹 Set continue watching
const setContinueVideo = async (req, res) => {
  const { id } = req.params;
  const { video } = req.body;

  if (!video) return res.status(400).json({ message: 'Video is required' });

  try {
    await updateContinueVideo(id, video);
    res.status(200).json({ message: 'Continue video set', continue_video: video });
  } catch (err) {
    res.status(500).json({ message: 'Failed to set continue video', error: err.message });
  }
};

const getContinueVideo = async (req, res) => {
  const { id } = req.params;

  try {
    const video = await getContinueVideoByUserId(id);

    if (!video) {
      return res.status(404).json({ message: 'No continue watching video found' });
    }

    res.status(200).json({
      continue_watching: {
        video_url: video.video_url,
        thumbnail_url: video.thumbnail_url,
      },
    });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch continue video', error: err.message });
  }
};


module.exports = {
  signup,
  resendOtp,
  verifyOtpCode,
  login,
  sendOtp,
  forgotPassword,
  resetPassword,
  updateUserInfo,
  getUserDetails,
  deleteUserAccount,
  getUserByEmailController,
  getAllUsersController,
  deleteAllUsersController,
    addSavedVideo,
  deleteSavedVideo,
  getSavedVideos,
  setContinueVideo,
  getContinueVideo,
};
