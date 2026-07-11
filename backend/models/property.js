const { Schema, model } = require("mongoose");

const propertySchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    price: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    country: {
      type: String,
      default: "Pakistan",
    },
    province: {
      type: String,
      required: true,
    },
    city: {
      type: String,
      required: true,
    },
    area: {
      type: String,
      required: true,
    },
    street: {
      type: String,
      required: true,
    },
    propertyImages: [
      {
        type: String,
      },
    ],
    allowWhatsApp: {
      type: Boolean,
      default: false,
    },
    allowEmail: {
      type: Boolean,
      default: false,
    },
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
