const { Router } = require("express");
const router = Router();

const Location = require("../models/location");

router.get("/get-provinces", async (req, res) => {
  try {
    const provincesList = await Location.distinct("province");

    if (!provincesList || provincesList.length === 0)
      return res.status(500).json({ msg: "Cannot Get Provinces From Server" });

    res.status(200).json(provincesList);
  } catch (error) {
    console.log("Error", error);
    return res.status(500).json({ msg: "Cannot Get Provinces From Server" });
  }
});

router.get("/get-cities", async (req, res) => {
  try {
    const { provinceName } = req.query;

    if (!provinceName || provinceName.length === 0)
      return res.status(404).json({ msg: "Province not found" });

    const cities = await Location.find({ province: provinceName }).distinct(
      "city",
    );

    res.status(200).json(cities);
  } catch (error) {
    console.log("Error", error);
    return res.status(500).json({ msg: "Cannot Get Provinces From Server" });
  }
});

router.get("/get-areas", async (req, res) => {
  try {
    const { cityName } = req.query;

    if (!cityName || cityName.length === 0)
      return res.status(404).json({ msg: "City Not Found" });

    const areas = await Location.find({ city: cityName }).distinct("area");

    return res.status(200).json(areas);
  } catch (error) {
    console.log("Error", error);
    return res.status(500).json({ msg: "Cannot Get Provinces From Server" });
  }
});

module.exports = router;
