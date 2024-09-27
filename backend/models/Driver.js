const mongoose = require("mongoose");

const DriverSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true, unique: true },
  vehicleNumber: { type: String },
  rcBookImage: { type: String },
  vehicleImage: { type: String },
  licenseImage: { type: String },
  passportPhoto: { type: String },
  uid: { type: String, required: true, unique: true },
  rideHistory: [
    {
      from: { type: String },
      to: { type: String },
      distance: { type: String },
      duration: { type: String },
      fare: { type: String },
      passengerName: { type: String },
      passengerPhone: { type: String },
      time: { type: Date },
    },
  ],
});

const Driver = mongoose.model("Driver", DriverSchema);

module.exports = Driver;
