require("dotenv").config();
const cors = require("cors");

const express = require("express");
const mongoose = require("mongoose");
const path = require("path");

const cookieParser = require("cookie-parser");

const authRoute = require("./routers/auth");
const propertyRoute = require("./routers/property");
const locationRoute = require("./routers/location")

const {
  checkForAuthenticationCookie,
} = require("./middlewares/authentication");

const handleSeedLocations = require("./services/seedLocation")

const app = express();
const PORT = process.env.PORT;

mongoose
  .connect("mongodb://localhost:27017/real-estate")
  .then(() => {
    console.log("MongoDB connected");
  })
  .catch((err) => {
    console.log("Error", err);
  });

app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  }),
);

app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

handleSeedLocations();

app.use("/user", authRoute);
app.use("/property", checkForAuthenticationCookie("token"), propertyRoute);
app.use("/location", locationRoute);

app.listen(PORT, () => console.log("Server Started at ", PORT));
