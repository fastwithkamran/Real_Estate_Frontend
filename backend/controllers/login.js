const User = require("../models/user");

const handleUserLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const token = await User.matchPasswordandGenerateToken(email, password);
    return res.cookie("token", token).json({msg: "Login success"});
  } catch {
    return res.status(404).json({msg: "Incorrect email or password"});
  }
};

module.exports = handleUserLogin;
