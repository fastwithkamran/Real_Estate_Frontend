const Property = require("../models/property");

const handleAllProperties = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 9;
    const start = parseInt(req.query.startIndex) || 0;

    const { sell, rent, parking, furnish, type, province, city, area } =
      req.query;
    let filter = {};

    if (sell === "true") {
      filter.sell = true;
    } else {
      filter.sell = { $in: [true, false] };
    }

    if (rent === "true") {
      filter.rent = true;
    } else {
      filter.rent = { $in: [true, false] };
    }

    if (parking === "true") {
      filter.parking = true;
    } else {
      filter.parking = { $in: [true, false] };
    }

    if (furnish === "true") {
      filter.furnish = true;
    } else {
      filter.furnish = { $in: [true, false] };
    }

    if (type === "Residential (houses, flats)") {
      filter.type = type;
    } else if (type === "Commercial (offices, shops)") {
      filter.type = type;
    } else if (type === "Land/Plots") {
      filter.type = type;
    } else {
      filter.type = {
        $in: [
          "Residential (houses, flats)",
          "Commercial (offices, shops)",
          "Land/Plots",
        ],
      };
    }

    if (area) {
      filter.area = area;
    } else if (city) {
      filter.city = city;
    } else if (province) {
      filter.province = province;
    }

    console.log(filter)

    const searchTerm = req.query.searchTerm || "";

    const sort = req.query.sort || "createdAt";

    const order = req.query.order || "desc";

    const result = await Property.find({
      ...filter,
      title: { $regex: searchTerm, $options: "i" },
    })
      .sort({ [sort]: order })
      .select({
        _id: 1,
        title: 1,
        type: 1,
        province: 1,
        city: 1,
        price: 1,
        bedrooms: 1,
        bathrooms: 1,
        propertyImages: { $slice: 1 },
      })
      .skip(start)
      .limit(limit)
      .lean();

    console.log(result);
    return res.status(200).json(result);
  } catch (error) {
    console.error("Error Filtering ", error);
    return res.status(500).json({ msg: "Server could not sent data" });
  }
};

module.exports = handleAllProperties;
