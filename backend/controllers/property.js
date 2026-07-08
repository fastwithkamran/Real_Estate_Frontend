const Property = require("../models/property");

const handleCreateProperty = async (req, res) => {
  try {
    const { title, description } = req.body;

    const propertyImages =
      req.files && req.files.length > 0
        ? req.files.map((file) => file.secure_url)
        : ["https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRhVmvwyjPCCOodYpjoSjqYhkhoXIXoX_8_pPBbItJluCyz0fQZrjqt6xI&s"];

    const property = await Property.create({
      title,
      description,
      createdBy: req.user._id,
      propertyImages,
    });

    return res.status(201).json({ msg: "Property Advertisement Created", data: property });
  } catch (error) {
    return res
      .status(404)
      .json({ msg: "Error Creating Property Advertisement" });
    console.log("Error Property Creation", error);
  }
};

module.exports = handleCreateProperty;
