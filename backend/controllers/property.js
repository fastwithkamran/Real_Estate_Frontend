const Property = require("../models/property");

const handleCreateProperty = async (req, res) => {
  try {
    console.log(req.body);
    const { title, description, country, province, city, area } = req.body;

    const propertyImages =
      req.files && req.files.length > 0
        ? req.files.map((file) => file.secure_url)
        : [
            "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRhVmvwyjPCCOodYpjoSjqYhkhoXIXoX_8_pPBbItJluCyz0fQZrjqt6xI&s",
          ];

    const property = await Property.create({
      title,
      description,
      country,
      province,
      city,
      area,
      propertyImages,
      createdBy: req.user._id,
    });

    return res
      .status(201)
      .json({ msg: "Property Advertisement Created", data: property });
  } catch (error) {
    console.log("Error Property Creation", error);
    return res
      .status(404)
      .json({ msg: "Error Creating Property Advertisement" });
  }
};

module.exports = handleCreateProperty;
