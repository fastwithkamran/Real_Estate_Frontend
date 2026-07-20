const { Router } = require("express");
const router = Router();

const {
  checkForAuthenticationCookie,
} = require("../middlewares/authentication");

const multer = require("multer");
const cloudinaryModule = require("cloudinary");
const cloudinary = cloudinaryModule.v2;
const CloudinaryStorage = require("multer-storage-cloudinary");

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinaryModule,
  params: {
    folder: "real-estate/properties",
  },
});

const upload = multer({ storage: storage });

const handleCreateProperty = require("../controllers/property");
const {
  handleUserProperties,
  handleDeletePropety,
  handlePropertyPage,
} = require("../controllers/handleProperties");

const handleAllProperties = require("../services/filter");

router.post(
  "/createProperty",
  checkForAuthenticationCookie("token"),
  upload.array("propertyImages", 5),
  handleCreateProperty,
);

router.get("/userProperties/:id", handleUserProperties);

router.get("/propertyInfo/:id", handlePropertyPage);

router.get("/allProperties", handleAllProperties);

router.delete("/delete/:id", handleDeletePropety);

module.exports = router;
