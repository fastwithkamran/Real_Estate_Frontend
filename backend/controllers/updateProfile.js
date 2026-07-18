const User = require("../models/user");
const { createHmac, randomBytes } = require("crypto");

const handleUpdateProfile = async (req, res) => {
  try {
    const id = req.params.id;

    let { fullName, email } = req.body;

    let avator = req.file ? req.file.secure_url : undefined;

    if (email) {
      const emailDuplicate = await User.findOne({ email });
      if (emailDuplicate)
        return res.status(400).json({ msg: "This Email is already in use" });
    }

    const updateData = { fullName, email };

    if (avator) updateData.avator = avator;

    const user = await User.findByIdAndUpdate(id, updateData, {
      returnDocument: "after",
      runValidators: true,
    });

    if (!user) return res.status(400).json({ msg: "User not found" });

    const userData = user.toObject();

    return res
      .status(200)
      .json({
        _id: userData._id,
        fullName: userData.fullName,
        email: userData.email,
        avator: userData.avator,
      });
  } catch (error) {
    if (error.name === "ValidationError") {
      const field = Object.keys(error.errors)[0];
      return res.status(400).json({ msg: error.errors[field].message });
    }

    console.error("Error Updating Profile ", error);
    return res.status(500).json({ msg: "Server failed to send data" });
  }
};

const handleUpdatePassword = async (req, res) => {
  try {
    const id = req.params.userId;
    const { currentpassword, newpassword } = req.body;

    const user = await User.findById(id);

    if (!user) return res.status(400).json({ msg: "User not found" });

    const salt = user.salt;
    const hashedpassword = user.password;

    const userProvidedHash = createHmac("sha256", salt)
      .update(currentpassword)
      .digest("hex");

    if (hashedpassword != userProvidedHash)
      return res.status(400).json({ msg: "Incorrect Current Password" });

    const newHashedPassword = createHmac("sha256", salt)
      .update(newpassword)
      .digest("hex");

    const userPasswordUpdate = await User.findByIdAndUpdate(
      id,
      { password: newHashedPassword },
      {
        returnDocument: "after",
        runValidators: true,
      },
    );

    if (!userPasswordUpdate)
      return res.status(400).json({ msg: "Password could not be updated" });

    return res.status(200).json({ msg: "Password Updated" });
  } catch (error) {
    console.error("Error Updating Password ", error);
    return res.status(500).json({ msg: "Server failed to send data" });
  }
};

module.exports = { handleUpdateProfile, handleUpdatePassword };
