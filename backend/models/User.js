const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true, unique: true },
  uid: { type: String, required: true, unique: true },
  rideHistory: [
    {
      from: { type: String },
      to: { type: String },
      distance: { type: String },
      duration: { type: String },
      fare: { type: String },
      driverName: { type: String },
      driverPhone: { type: String },
      time: { type: String },
    },
  ],
});

const User = mongoose.model("User", UserSchema);

module.exports = User;
