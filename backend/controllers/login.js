const User = require("../models/user");
require("dotenv").config();

const handleUserLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user)
      return res.status(400).json({ msg: "Incorrect Password or Email" });

    const token = await User.matchPasswordandGenerateToken(email, password);

    const userData = user.toObject();
    const { _id, fullName, email, avator } = userData;

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

    console.error("Error in Login Page ", error);
    return res.status(500).json({ msg: "Cannot Login" });
  }
};

module.exports = handleUserLogin;
