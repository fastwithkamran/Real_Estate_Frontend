const User = require("../models/user");
const { createTokenForUser } = require("../services/auth");
require("dotenv").config();

const handleUserSignUp = async (req, res) => {
  try {
    const { fullName, email, password, phone } = req.body;

    const emailDuplicate = await User.findOne({ email });
    if (emailDuplicate)
      return res.status(400).json({ msg: "This Email is already in use" });

    const avatorUrl = req.file
      ? req.file.secure_url
      : "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSNupSKjnCIs8Z8mbmI3Nm1Huhj_wEEm-BQo522KiZjAg&s=10";

    const user = await User.create({
      fullName,
      email,
      password,
      avator: avatorUrl,
    });

    const userData = user.toObject();
    const { _id, avator } = userData;

    const token = createTokenForUser(user);

    return res
      .status(201)
      .cookie("token", token, {
        path: "/",
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 90 * 24 * 60 * 60 * 1000,
      })
      .json({ _id, fullName, email, avator });
  } catch (error) {
    if (error.message === "Incorrect Password or Email")
      return res.status(400).json({ msg: "Incorrect Password or Email" });

    if (error.name === "ValidationError") {
      const field = Object.keys(error.errors)[0];
      return res.status(400).json({ msg: error.errors[field].message });
    }

    console.error("Error in SignUp ", error);
    return res.status(500).json({ msg: "Server failed to send data" });
  }
};

const handleGoogleAuth = async (req, res, next) => {
  try {
    const { fullName , email, avator } = req.body;

    let user = await User.findOne({ email });
    if (!user) {
      user = await User.create({
        fullName,
        email,
        avator,
      });
    }

    const userData = user.toObject();
    const { _id } = userData;

    const token = createTokenForUser(user);

    return res
      .status(201)
      .cookie("token", token, {
        path: "/",
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 90 * 24 * 60 * 60 * 1000,
      })
      .json({ _id, fullName, email, avator });
  } catch (error) {
    if (error.name === "ValidationError") {
      const field = Object.keys(error.errors)[0];
      return res.status(400).json({ msg: error.errors[field].message });
    }

    console.error("Error in Google SignUp ", error);
    return res.status(500).json({ msg: "Server failed to send data" });
  }
};

module.exports = { handleUserSignUp, handleGoogleAuth };
