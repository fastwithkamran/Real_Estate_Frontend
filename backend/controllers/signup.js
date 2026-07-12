const User = require("../models/user");
require("dotenv").config();

const handleUserSignUp = async (req, res) => {
  try {
    const { fullName, email, password, phone } = req.body;

    const emailDuplicate = User.findOne({ email });
    if (emailDuplicate)
      return res.status(400).json({ msg: "This Email is already in use" });

    const phoneDuplicate = User.findOne({ phone });
    if (phoneDuplicate)
      return res.status(400).json({ msg: "This Phone is already in use" });

    const avatorUrl = req.file
      ? req.file.secure_url
      : "https://www.google.com/imgres?q=avatorurl&imgurl=https%3A%2F%2Fimg.magnific.com%2Fpremium-photo%2Fhuman-resources-manager-digital-avatar-generative-ai_934475-9192.jpg%3Fsemt%3Dais_hybrid%26w%3D740%26q%3D80&imgrefurl=https%3A%2F%2Fwww.magnific.com%2Ffree-photos-vectors%2Favatar&docid=ZoMniqxlLaLBzM&tbnid=1W8MKrDI-xCTnM&vet=12ahUKEwitru-F0sKVAxW4VqQEHfcLE6sQnPAOegQILxAA..i&w=740&h=740&hcb=2&ved=2ahUKEwitru-F0sKVAxW4VqQEHfcLE6sQnPAOegQILxAA";

    await User.create({
      fullName,
      email,
      phone,
      password,
      avator: avatorUrl,
    });

    const token = await User.matchPasswordandGenerateToken(email, password);

    return res
      .status(201)
      .cookie("token", token, {
        path: "/",
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 90 * 24 * 60 * 60 * 1000,
      })
      .json({ msg: "Account Created" });
  } catch (error) {
    if (error.message === "User not found")
      return res.status(400).json({ msg: "Invalid Email" });
    if (error.message === "Incorrect Password or Email")
      return res.status(400).json({ msg: "Incorrect Password or Email" });

    if (error.name === "ValidationError") {
      const field = Object.keys(error.errors)[0];
      return res.status(400).json({ msg: error.errors[field].message });
    }

    console.error("Error in SignUp ", error);
    return res.status(500).json({ msg: "Account Not Created" });
  }
};

module.exports = handleUserSignUp;
