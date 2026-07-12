const fs = require("fs");
const path = require("path");
const Location = require("../models/location");

const handleSeedLocations = async (req, res) => {
  try {
    const filePath = path.join(__dirname, "location.geojson");
    const rawData = fs.readFileSync(filePath);
    const result = JSON.parse(rawData);

    const Records = result.features.map((place) => ({
      country: "Pakistan",
      province: place.properties.adm1_name,
      city: place.properties.adm2_name,
      area: place.properties.adm3_name,
    }));

    const uniqueMap = new Map();

    Records.forEach((element) => {
      const key = `${element.city}-${element.area}`;
      if (!uniqueMap.has(key)) {
        uniqueMap.set(key, element);
      }
    });

    const insertRecords = Array.from(uniqueMap.values());

    await Location.deleteMany({});
    await Location.insertMany(insertRecords);
  } catch (error) {
    console.error("Error Location Feeding ", error);
    return res.status(500).json({msg: "Error Location Feeding"})
  }
};

module.exports = handleSeedLocations;
