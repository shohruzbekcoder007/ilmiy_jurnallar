const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const env = require('./env');

cloudinary.config({
  cloud_name: env.CLOUDINARY.cloud_name,
  api_key: env.CLOUDINARY.api_key,
  api_secret: env.CLOUDINARY.api_secret,
});

const pdfStorage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => ({
    folder: 'ilmiy-jurnallar/pdf',
    resource_type: 'raw',
    public_id: `${Date.now()}-${file.originalname.replace(/\.[^.]+$/, '')}`,
    format: 'pdf',
  }),
});

const imageStorage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => ({
    folder: 'ilmiy-jurnallar/images',
    resource_type: 'image',
    public_id: `${Date.now()}-${file.originalname.replace(/\.[^.]+$/, '')}`,
  }),
});

module.exports = { cloudinary, pdfStorage, imageStorage };
