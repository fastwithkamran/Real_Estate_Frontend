const { Router } = require("express");
const router = Router();

require("dotenv").config();

const multer = require("multer");
const cloudinaryModule = require("cloudinary");
const cloudinary = cloudinaryModule.v2;
const CloudinaryStorage = require("multer-storage-cloudinary");

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinaryModule,
  params: {
    folder: "real-estate/avatars",
    allowed_formats: ["jpg", "jpeg", "png"],
  },
});

const upload = multer({ storage: storage });

const {handleUpdateProfile, handleUpdatePassword} = require("../controllers/updateProfile");

router.patch(
  "/profile-update/:id",
  upload.single("avator"),
  handleUpdateProfile,
);

router.patch("/update-password/:userId", upload.none(), handleUpdatePassword);

module.exports = router;
