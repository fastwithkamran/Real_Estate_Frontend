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
const handleUserSignUp = require("../controllers/signup.js");

router.post("/signup", upload.single("avator"), handleUserSignUp);
router.post("/login", upload.none(), handleUserLogin);

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

router.get(
  "/verify-auth/getUserID",
  checkForAuthenticationCookie("token"),
  (req, res) => {
    return res.status(200).json(req.user._id);
  },
);

const User = require("../models/user.js");
router.get(
  "/verify-auth/getUserPayload",
  checkForAuthenticationCookie("token"),
  async (req, res) => {
    try {
      const userData = await User.findById(req.user._id)
        .select({
          fullName: 1,
          email: 1,
          phone: 1,
          avator: 1,
        })
        .lean();

      if (!userData)
        return res.status(400).json({ msg: "User Details not found" });
      return res.status(200).json(userData);
    } catch (error) {
      console.error("Error Getting User Details ", error);
      return res.status(500).json({ msg: "Cant find User Details" });
    }
  },
);

router.get("/logout", (req, res) => {
  try {
    res.clearCookie("token", {
      path: "/",
      httpOnly: true,
      sameSite: "lax",
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
