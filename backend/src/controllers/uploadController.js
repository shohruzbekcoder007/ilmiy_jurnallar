const ApiError = require('../utils/ApiError');
const asyncHandler = require('../utils/asyncHandler');

exports.uploadPdf = asyncHandler(async (req, res) => {
  if (!req.file) throw new ApiError(400, 'No file uploaded');
  res.json({
    success: true,
    data: {
      url: req.file.path || req.file.secure_url,
      filename: req.file.originalname,
      size: req.file.size,
    },
  });
});

exports.uploadImage = asyncHandler(async (req, res) => {
  if (!req.file) throw new ApiError(400, 'No file uploaded');
  res.json({
    success: true,
    data: {
      url: req.file.path || req.file.secure_url,
      filename: req.file.originalname,
      size: req.file.size,
    },
  });
});
