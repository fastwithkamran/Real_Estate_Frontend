const User = require("../models/user");
const Property = require("../models/property");

const handleUserDelete = async (req, res) => {
  try {
    const propertiesDelete = await Property.deleteMany({
      createdBy: req.params.id,
    });

    res.clearCookie("token", {
      path: "/",
      httpOnly: true,
      sameSite: "strict",
      secure: process.env.NODE_ENV === "production",
    });
    
    const userDelete = await User.findByIdAndDelete(req.params.id);
    if (userDelete) {
      return res.status(200).json({ msg: "Account Deleted Successfully" });
    } else {
      return res.status(404).json({ msg: "User Not Found" });
    }
  } catch (error) {
    console.error("Error Deleting User Account ", error);
    return res.status(500).json({ msg: "Server failed to delete data" });
  }
};

module.exports = handleUserDelete;
