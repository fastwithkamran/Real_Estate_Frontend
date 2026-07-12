const Property = require("../models/property");

const handlePropertyHome = async (req, res) => {
  try {
    const result = await Property.find({})
      .select({
        _id: 1,
        title: 1,
        province: 1,
        city: 1,
        area: 1,
        street: 1,
        price: 1,
        propertyImages: { $slice: 1 },
      })
      .lean();

    if (!result) return res.status(500).json({ msg: "Cannot Find Properties" });
    return res.status(200).json(result);
  } catch (error) {
    console.error("Error", error);
    return res.status(500).json({ msg: "Server failed to send data" });
  }
};

const handlePropertyPage = async (req, res) => {
  try {
    const id = req.params.id;
    const result = await Property.findById(id)
      .select({
        title: 1,
        province: 1,
        city: 1,
        area: 1,
        street: 1,
        price: 1,
        allowWhatsApp: 1,
        allowEmail: 1,
        description: { $slice: 20 },
        propertyImages: { $slice: 5 },
        createdBy: 1,
      })
      .populate("createdBy", "fullName email phone avator")
      .lean();

    if (!result) return res.status(400).json({ msg: "Cannot Find Properties" });

    return res.status(200).json(result);
  } catch (error) {
    console.error("Error", error);
    return res.status(500).json({ msg: "Cannot find Properties" });
  }
};

module.exports = { handlePropertyHome, handlePropertyPage };
