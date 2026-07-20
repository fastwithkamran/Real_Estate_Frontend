const Property = require("../models/property");

const handleCreateProperty = async (req, res) => {
  try {
    const {
      type,
      title,
      price,
      description,
      country,
      province,
      city,
      area,
      street,
      phone,
      sell,
      rent,
      bedrooms,
      bathrooms,
      parking,
      furnish,
    } = req.body;

    const userId = req.user;
    const createdBy = userId._id;

    const propertyImages =
      req.files && req.files.length > 0
        ? req.files.map((file) => file.secure_url)
        : [
            "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRhVmvwyjPCCOodYpjoSjqYhkhoXIXoX_8_pPBbItJluCyz0fQZrjqt6xI&s",
          ];

    const propertyData = {
      type,
      title,
      price,
      description,
      country,
      province,
      city,
      area,
      street,
      sell,
      rent,
      bedrooms,
      bathrooms,
      parking,
      furnish,
      propertyImages,
    };

    if (phone !== "null") {
      const phoneDuplicate = await Property.findOne({ phone: phone });
      if (phoneDuplicate)
        return res.status(400).json({ msg: "This Phone is already in use" });

      propertyData.phone = phone;
    }

    const property = await Property.create({
      ...propertyData,
      createdBy,
    });

    return res.status(201).json({ msg: "Property Advertisement Created" });
  } catch (error) {
    console.error("Error Property Creation ", error);
    return res
      .status(500)
      .json({ msg: "Server failed to send data" });
  }
};

module.exports = handleCreateProperty;
