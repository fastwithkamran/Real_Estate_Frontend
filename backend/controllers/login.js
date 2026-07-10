const User = require("../models/user");
require("dotenv").config();

const handleUserLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const token = await User.matchPasswordandGenerateToken(email, password);
    return res
      .status(201)
      .cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 90 * 24 * 60 * 60 * 1000,
      })
      .json({ msg: "Login Success" });
  } catch(error) {
    console.log("Error in Login", error);
    return res.status(404).json({ msg: "Incorrect email or password" });
  }
};

module.exports = handleUserLogin;
