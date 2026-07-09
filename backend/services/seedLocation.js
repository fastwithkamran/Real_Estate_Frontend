const fs = require("fs");
const Location = require("../models/location");

const handleSeedLocations = async (req, res) => {
  try {
    const rawData = fs.readFileSync("./location.geojson");
    const result = JSON.parse(rawData);

    const Records = result.features.map((place) => ({
      country: "Pakistan",
      province: features.properties.adm1_name,
      city: features.properties.adm2_name,
      area: features.properties.adm3_name,
    }));

    const uniqueMap = new Map();

    Records.forEach((element) => {
      const key = `${element.city}-${element.item}`;
      if (!uniqueMap.has(key)) {
        uniqueMap.set(key, element);
      }
    });

    const insertRecords = Array.from(uniqueMap.values());

    await Location.deleteMany({});
    await Location.insertMany(insertRecords);
  } catch (error) {
    console.log("Error Location Feeding", error);
  }
};

module.exports = handleSeedLocations;
