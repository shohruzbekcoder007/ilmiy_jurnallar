const multer = require('multer');
const ApiError = require('../utils/ApiError');
const { pdfStorage, imageStorage } = require('../config/cloudinary');

const pdfFilter = (req, file, cb) => {
  const okMime = file.mimetype === 'application/pdf';
  const okExt = /\.pdf$/i.test(file.originalname);
  if (!okMime || !okExt) return cb(new ApiError(400, 'Only PDF files are allowed'));
  cb(null, true);
};

const imageFilter = (req, file, cb) => {
  if (!/^image\/(png|jpe?g|webp|gif)$/.test(file.mimetype)) {
    return cb(new ApiError(400, 'Only image files are allowed'));
  }
  cb(null, true);
};

const uploadPdf = multer({
  storage: pdfStorage,
  fileFilter: pdfFilter,
  limits: { fileSize: 25 * 1024 * 1024 },
});

const uploadImage = multer({
  storage: imageStorage,
  fileFilter: imageFilter,
  limits: { fileSize: 5 * 1024 * 1024 },
});

module.exports = { uploadPdf, uploadImage };
