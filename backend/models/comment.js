const { Schema, model } = require("mongoose");

const commentSchema = new Schema(
  {
    comment: {
      type: String,
      required: true,
    },
    propertyId: {
      type: Schema.Types.ObjectId,
      ref: "properties",
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "user",
    },
  },
  { timestamps: true },
);

const Comment = model("comments", commentSchema);

module.exports = Comment;