const { createHmac, randomBytes } = require("crypto");
const { Schema, model } = require("mongoose");
const { createTokenForUser } = require("../services/auth");
const validator = require("validator");

const userSchema = new Schema(
  {
    fullName: {
      type: String,
      required: [true, "Name not found"],
    },
    email: {
      type: String,
      required: [true, "Email not found"],
      unique: true,
      lowercase: true,
      validate: {
        validator: (value) => validator.isEmail(value),
        message: "Please provide a valid email address",
      },
    },
    salt: {
      type: String,
    },
    password: {
      type: String,
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

    if (!user) throw new Error("Incorrect Password or Email");

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
