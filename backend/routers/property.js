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
    allowed_formats: ["jpg", "jpeg", "png"],
  },
});

const upload = multer({ storage: storage });

const handleCreateProperty = require("../controllers/property");

const {
  handlePropertyHome,
  handlePropertyPage,
} = require("../services/property");

const handlePropertyFilter = require("../services/filter");
const handleAllProperties = require("../controllers/allProperties");

router.post(
  "/createProperty",
  checkForAuthenticationCookie("token"),
  upload.array("propertyImages", 5),
  handleCreateProperty,
);

router.get("/propertyInfo/home", handlePropertyHome);
router.get("/propertyInfo/page/:id", handlePropertyPage);

router.get("/propertyfilter", handlePropertyFilter);

router.get("/all-properties/:id", handleAllProperties);

module.exports = router;
