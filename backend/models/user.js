const { createHmac, randomBytes } = require("crypto");
const { Schema, model } = require("mongoose");
const { createTokenForUser } = require("../services/auth");

const userSchema = new Schema(
  {
    fullName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    phone: {
      type: Number,
      required: true,
    },
    salt: { 
      type: String,
    },
    password: {
      type: String,
      required: true,
    },
    avator: {
      type: String,
    },
  },
  { timestamps: true },
);

userSchema.pre("save", async function () {
  const user = this;
  if (!user.isModified("password")) return;

  const salt = randomBytes(16).toString("hex");
  const hashedpassword = createHmac("sha256", salt)
    .update(user.password)
    .digest("hex");

  this.salt = salt;
  this.password = hashedpassword;
});

userSchema.static(
  "matchPasswordandGenerateToken",
  async function (email, password) {
    const user = await this.findOne({ email });

    if (!user) throw new Error("User not found");

    const salt = user.salt;
    const hashedpassword = user.password;

    const userProvidedHash = createHmac("sha256", salt)
      .update(password)
      .digest("hex");

    if (hashedpassword != userProvidedHash)
      throw new Error("Incorrect Password or Email");

    const token = createTokenForUser(user);
    return token;
  },
);

const User = model("user", userSchema);

module.exports = User;
