const Property = require("../models/property");

const handleCreateProperty = async (req, res) => {
  try {
    const {
      title,
      description,
      country,
      province,
      city,
      price,
      area,
      street,
      allowWhatsApp,
      allowEmail,
    } = req.body;

    const userId = req.user;
    const createdBy = userId._id;

    const propertyImages =
      req.files && req.files.length > 0
        ? req.files.map((file) => file.secure_url)
        : [
            "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRhVmvwyjPCCOodYpjoSjqYhkhoXIXoX_8_pPBbItJluCyz0fQZrjqt6xI&s",
          ];

    const property = await Property.create({
      title,
      price,
      description,
      country,
      province,
      city,
      area,
      street,
      propertyImages,
      allowWhatsApp,
      allowEmail,
      createdBy,
    });

    return res.status(201).json({ msg: "Property Advertisement Created" });
  } catch (error) {
    console.error("Error Property Creation ", error);
    return res
      .status(500)
      .json({ msg: "Cannot Create Property Advertisement" });
  }
};

module.exports = handleCreateProperty;
