const Property = require("../models/property");

const handleUserProperties = async (req, res) => {
  try {
    const id = req.params.id;

    const result = await Property.find({ createdBy: id })
      .select({
        _id: 1,
        title: 1,
        type: 1,
        province: 1,
        city: 1,
        price: 1,
        bedrooms: 1,
        bathrooms: 1,
        furnish: 1,
        propertyImages: { $slice: 1 },
      })
      .lean();

    return res.status(200).json(result);
  } catch (error) {
    console.error("Cannot Find User Properties ", error);
    return res.status(500).json({ msg: "Server failed to send data" });
  }
};

const handleDeletePropety = async (req, res) => {
  try {
    const result = await Property.findByIdAndDelete(req.params.id);

    if (result) {
      return res.status(200).json({ msg: "Property Deleted Successfully" });
    } else {
      return res.status(404).json({ msg: "Property could not found" });
    }
  } catch (error) {
    console.error("Error Deleting Property", error);
    return res.status(500).json({ msg: "Server failed to send data" });
  }
};

const handlePropertyPage = async (req, res) => {
  try {
    const result = await Property.findById(req.params.id)
      .select({
        type: 1,
        sell: 1,
        rent: 1,
        bedrooms: 1,
        bathrooms: 1,
        parking: 1,
        furnish: 1,
        title: 1,
        country: 1,
        province: 1,
        city: 1,
        area: 1,
        street: 1,
        price: 1,
        phone: 1,
        description: { $slice: 20 },
        propertyImages: { $slice: 5 },
        createdBy: 1,
      })
      .populate("createdBy", "fullName email avator")
      .lean();

    if (!result)
      return res.status(400).json({ msg: "Cannot Find Property Information" });

    return res.status(200).json(result);
  } catch (error) {
    console.error("Error", error);
    return res.status(500).json({ msg: "Server failed to send data" });
  }
};

module.exports = {
  handleUserProperties,
  handleDeletePropety,
  handlePropertyPage,
};
