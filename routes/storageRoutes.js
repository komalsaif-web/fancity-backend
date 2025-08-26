// storageRoutes.js
const express = require('express');
const multer = require('multer');
const { uploadFile, getSignedUrl } = require('../controllers/storageController.js');

const router = express.Router();

// Memory storage (file RAM me store hoti hai)
const upload = multer({ storage: multer.memoryStorage() });

router.post('/upload', upload.single('file'), uploadFile);
router.post('/signed-url', getSignedUrl);

module.exports = router;
