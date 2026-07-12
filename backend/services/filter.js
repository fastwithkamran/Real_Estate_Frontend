const Property = require("../models/property");

const handlePropertyFilter = async (req, res) => {
  try {
    const { province, city, area } = req.query;
    let filter = {};
    if (area) {
      filter.area = area;
    } else if (city) {
      filter.city = city;
    } else if (province) {
      filter.province = province;
    } else {
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
      return res.status(200).json(result);
    }
    const result = await Property.find(filter)
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
    return res.status(200).json(result);
  } catch (error) {
    console.error("Error Filtering ", error);
    return res.status(500).json({ msg: "Filter is not responding" });
  }
};

module.exports = handlePropertyFilter;
