const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Driver = require("../models/Driver");
const adminAuth = require("../firebaseAdmin");

exports.signup = async (req, res) => {
  const { name, email, phone, uid } = req.body;

  try {
    const existingUser = await User.findOne({ $or: [{ email }, { phone }] });
    if (existingUser)
      return res.status(400).json({ message: "User already exists" });

    const user = new User({ name, email, phone, uid });
    await user.save();

    res.status(201).json({ message: "User created successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.login = async (req, res) => {
  const { uid } = req.body;

  try {
    const user = await User.findOne({ uid });
    if (!user) return res.status(400).json({ message: "User does not exist" });

    const token = jwt.sign({ uid: user.uid }, "secret", {
      expiresIn: "1h",
    });
    res.cookie("token", token, { httpOnly: true });

    res.json({ message: "Login successful" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.profile = async (req, res) => {
  const { uid } = req.user;
  try {
    const user = await User.findOne({ uid });
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateProfile = async (req, res) => {
  const { uid } = req.user;
  const { name, email, phone, password } = req.body;

  try {
    const hashedPassword = password
      ? await bcrypt.hash(password, 10)
      : undefined;
    const updateData = { name, email, phone };
    if (hashedPassword) updateData.password = hashedPassword;

    await User.updateOne({ uid }, { $set: updateData });
    res.json({ message: "Profile updated successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// driver

exports.signupDrive = async (req, res) => {
  const { name, email, phone, uid } = req.body;

  try {
    const existingUser = await Driver.findOne({ $or: [{ email }, { phone }] });
    if (existingUser)
      return res.status(400).json({ message: "User already exists" });

    const user = new Driver({ name, email, phone, uid });
    await user.save();

    res.status(201).json({ message: "User created successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.loginDrive = async (req, res) => {
  const { uid } = req.body;

  try {
    const user = await Driver.findOne({ uid });
    if (!user) return res.status(400).json({ message: "User does not exist" });

    const token = jwt.sign({ uid: user.uid }, "secret", {
      expiresIn: "1h",
    });
    res.cookie("token", token, { httpOnly: true });

    res.json({ message: "Login successful" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.profileDrive = async (req, res) => {
  const { uid } = req.user;
  try {
    const user = await Driver.findOne({ uid });
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateProfileDrive = async (req, res) => {
  const { uid } = req.user;
  const {
    name,
    email,
    phone,
    vehicleNumber,
    rcBookImage,
    vehicleImage,
    licenseImage,
    passportPhoto,
    password,
  } = req.body;

  try {
    const hashedPassword = password
      ? await bcrypt.hash(password, 10)
      : undefined;
    const updateData = {
      name,
      email,
      phone,
      vehicleNumber,
      rcBookImage,
      vehicleImage,
      licenseImage,
      passportPhoto,
    };
    if (hashedPassword) updateData.password = hashedPassword;

    await Driver.updateOne({ uid }, { $set: updateData });
    res.json({ message: "Profile updated successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.passengerHistory = async (req, res) => {
  const { uid } = req.user;
  try {
    const user = await User.findOne({ uid });
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.driverHistory = async (req, res) => {
  const { uid } = req.user;
  try {
    const user = await Driver.findOne({ uid });
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
