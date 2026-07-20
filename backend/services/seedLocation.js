const fs = require("fs");
const path = require("path");
const Location = require("../models/location");

const handleSeedLocations = async () => {
  try {
    const existingData = await Location.countDocuments();

    if (existingData > 0) {
      return;
    }

    const filePath = path.join(__dirname, "location.geojson");

    if (!fs.existsSync(filePath)) {
      console.error("geoJson file not exist");
      return;
    }

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
      if (!uniqueMap.has(key)) uniqueMap.set(key, element);
    });

    const insertRecords = Array.from(uniqueMap.values());
    const seedResult = await Location.insertMany(insertRecords);
  } catch (error) {
    console.error("Error Location Seeding:", error.message);
  }
};

module.exports = handleSeedLocations;
