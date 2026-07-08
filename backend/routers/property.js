const { Router } = require("express");
const route = Router();

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
    folder: "real-estate/avatars",
    allowed_formats: ["jpg", "jpeg", "png"],
  },
});

const upload = multer({ storage: storage });

const handleCreateProperty = require("../controllers/property");
const handleCreateComment = require("../controllers/comment");

router.post(
  "/createProperty",
  upload.array("propertyImages", 5),
  handleCreateProperty,
);

router.post("/createComment", upload.none(), handleCreateComment);

module.exports = router;
