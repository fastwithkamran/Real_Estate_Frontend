const { Schema, model } = require("mongoose");

const LocationSchema = new Schema({
  country: {
    type: String,
    default: "Pakistan",
  },
  province: {
    type: String,
    default: "Pakistan",
  },
  city: {
    type: String,
    default: "Pakistan",
  },
  area: {
    type: String,
    default: "Pakistan",
  },
});

LocationSchema.index({ city: 1, area: 1 });

const Location = model("location", LocationSchema);

module.exports = Location;
