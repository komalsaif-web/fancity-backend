// storageRoutes.js
import express from 'express';
import multer from 'multer';
import { uploadFile, getSignedUrl } from '../controllers/storageController.js';

const router = express.Router();

// Memory storage (file RAM me store hoti hai)
const upload = multer({ storage: multer.memoryStorage() });

router.post('/upload', upload.single('file'), uploadFile);
router.post('/signed-url', getSignedUrl);

module.exports = router;