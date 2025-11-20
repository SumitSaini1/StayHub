const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');


cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
  secure: true,
  timeout: 60000, 
});

const storage = new CloudinaryStorage({
  cloudinary,
  params: (req, file) => ({
    folder: "StayHub Dev",
    resource_type: "image",
    allowed_formats: ["jpg", "jpeg", "png"],
    
  }),
});

module.exports = { cloudinary, storage };