const Property = require("../models/property");

const handlePropertyFilter = async (req, res) => {
  try {
    const { province, city, area } = req.query;

    if (area && area !== "undefined") {
      filter.area = area;
    } else if (city && city !== "undefined") {
      filter.city = city;
    } else if (province && province !== "undefined") {
      filter.province = province;
    } else {
      const result = await Property.find({});
      return res.status(200).json(result);
    }

    const result = await Property.find(filter);
    return res.status(200).json(result);
  } catch (error) {
    console.log("Error Filtering", error);
    return res.status(500).json({ msg: "Server error while filtering" });
  }
};

module.exports = handlePropertyFilter;
