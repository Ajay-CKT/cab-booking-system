const express = require("express");
const {
  signup,
  login,
  profile,
  updateProfile,
  signupDrive,
  loginDrive,
  profileDrive,
  updateProfileDrive,
  passengerHistory,
  driverHistory,
} = require("../controllers/authController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();
//passenger
router.post("/signup", signup);
router.post("/login", login);
router.get("/profile", authMiddleware, profile);
router.put("/update", authMiddleware, updateProfile);
router.get("/history-passenger", authMiddleware, passengerHistory);
//driver
router.post("/signup-drive", signupDrive);
router.post("/login-drive", loginDrive);
router.get("/profile-drive", authMiddleware, profileDrive);
router.put("/update-drive", authMiddleware, updateProfileDrive);
router.get("/history-driver", authMiddleware, driverHistory);

module.exports = router;
