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

const handleUserLogin = require("../controllers/login.js");
const {
  handleUserSignUp,
  handleGoogleAuth,
} = require("../controllers/signup.js");

router.post("/signup", upload.single("avator"), handleUserSignUp);
router.post("/login", upload.none(), handleUserLogin);
router.post("/google", handleGoogleAuth);

const {
  checkForAuthenticationCookie,
} = require("../middlewares/authentication");

router.get(
  "/verify-auth",
  checkForAuthenticationCookie("token"),
  (req, res) => {
    return res.status(200).json({ msg: "Success" });
  },
);

router.get("/logout", (req, res) => {
  try {
    res.clearCookie("token", {
      path: "/",
      httpOnly: true,
      sameSite: "strict",
      secure: process.env.NODE_ENV === "production",
    });

    return res.status(200).json({ msg: "Logout Success" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ msg: "Server Error During Logout" });
  }
});

const handleUserDelete = require("../controllers/delete");
router.delete("/delete/:id", handleUserDelete);

module.exports = router;
