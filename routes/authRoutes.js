const express = require('express');
const router = express.Router();
const {
  signup,
  verifyOtpCode,
  login,
  forgotPassword,
  resetPassword,
  updateUserInfo,
  getUserDetails,
  deleteUserAccount,
  resendOtp,
  sendOtp,
  getUserByEmailController,
  getAllUsersController,
  deleteAllUsersController,
  addSavedVideo,
  deleteSavedVideo,
  getSavedVideos,
  setContinueVideo,
  getContinueVideo
} = require('../controllers/authController');

router.post('/signup', signup);
router.post('/send-otp', sendOtp);
router.post('/verify-otp', verifyOtpCode);
router.post('/login', login);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);
router.put('/update-user/:id', updateUserInfo);
router.get('/user/:userId', getUserDetails);
router.delete('/delete/:id', deleteUserAccount);
router.post('/resend-otp', resendOtp);
router.get('/email/:email', getUserByEmailController);
router.get('/all-users', getAllUsersController);
router.delete('/delete-all-users', deleteAllUsersController); 
// ✅ Saved Videos
router.post('/:id/save-video', addSavedVideo);
router.delete('/:id/save-video/:videoId', deleteSavedVideo);
router.get('/:id/saved-videos', getSavedVideos);

// ✅ Continue Watching
router.post('/:id/continue-video', setContinueVideo);
router.get('/:id/continue-video', getContinueVideo);
module.exports = router;
 