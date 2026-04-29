const express = require('express');
const { authMiddleware } = require('../middlewares/auth');
const { uploadPdf, uploadImage } = require('../middlewares/upload');
const c = require('../controllers/uploadController');

const router = express.Router();

router.post('/pdf', authMiddleware, uploadPdf.single('file'), c.uploadPdf);
router.post('/image', authMiddleware, uploadImage.single('file'), c.uploadImage);

module.exports = router;
