const { Schema, model } = require("mongoose");

const LocationSchema = new Schema({
  country: {
    type: String,
  },
  province: {
    type: String,
  },
  city: {
    type: String,
  },
  area: {
    type: String,
  },
});

LocationSchema.index({ city: 1, area: 1 });

const Location = model("location", LocationSchema);

module.exports = Location;
