const { Router } = require("express");
const router = Router();

const multer = require('multer');
const cloudinaryModule = require('cloudinary');
const cloudinary = cloudinaryModule.v2;
const CloudinaryStorage = require("multer-storage-cloudinary");

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinaryModule,
  params: {
    folder: "real-estate/avatars",
    allowed_formats: ["jpg", "jpeg", "png"],
  },
});

const upload = multer({storage: storage});

const handleUserLogin = require ("../controllers/login.js")
const handleUserSignUp = require ("../controllers/signup.js")

router.get("/login", (req, res) => {
  return res.redirect("/user/login");
});
router.get("/signup", (req, res) => {
  return res.redirect("/user/signup");
});

router.post("/signup",upload.single("avator"), handleUserSignUp);
router.post("/login", upload.none(), handleUserLogin);

module.exports = router;