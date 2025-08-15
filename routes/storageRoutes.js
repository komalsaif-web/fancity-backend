const express = require('express');
const multer = require('multer');
const { uploadFile, getSignedUrl } = require('../controllers/storageController');

const router = express.Router();
const upload = multer({ dest: 'temp/' });

router.post('/upload', upload.single('file'), uploadFile);
router.post('/signed-url', getSignedUrl);

module.exports = router;
