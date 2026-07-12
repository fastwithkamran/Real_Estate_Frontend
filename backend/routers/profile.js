const { Router } = require("express");
const router = Router();

const handleUpdateProfile = require("../controllers/updateProfile");

router.patch("/profile-update/:id", handleUpdateProfile);
