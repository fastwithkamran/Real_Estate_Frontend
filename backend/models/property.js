const { Schema, model } = require("mongoose");

const propertySchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    propertyImages: [{
      type: String,
    }],
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "user",
    },
  },
  {
    timestamps: true,
  },
);

const Property = model("properties", propertySchema);

module.exports = Property;
