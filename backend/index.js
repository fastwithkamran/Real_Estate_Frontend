require("dotenv").config();
const cors = require("cors");

const express = require("express");
const mongoose = require("mongoose");

const cookieParser = require("cookie-parser");

const authRoute = require("./routers/auth");
const propertyRoute = require("./routers/property");
const locationRoute = require("./routers/location");
const profileRoute = require("./routers/profile");

const handleSeedLocations = require("./services/seedLocation");

const app = express();
const PORT = 8000;

const allowedOrigins = [
  "http://localhost:5173",
  "https://paklands-realestate-project.vercel.app",
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    methods: ["GET", "POST", "PATCH", "DELETE"],
    credentials: true,
  }),
);

app.use(express.json());
app.use(cookieParser());

mongoose
  .connect(process.env.MONGO_URI)
  .then(async () => {
    console.log("MongoDB Atlas Connected");

    await handleSeedLocations();

    app.use("/user", authRoute);
    app.use("/property", propertyRoute);
    app.use("/location", locationRoute);
    app.use("/profile", profileRoute);

    if (process.env.NODE_ENV !== "production") {
      app.listen(PORT, () => console.log("Server Started at ", PORT));
    }
  })
  .catch((err) => {
    console.log("Database Connection Failed", err);
    process.exit(1);
  });

module.exports = app;
