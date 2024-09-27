const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const mongoose = require("mongoose");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const authRoutes = require("./routes/auth");
const User = require("./models/User");
const Driver = require("./models/Driver");

require("dotenv").config();

const appForSocket = express();
appForSocket.use(express.json());
appForSocket.use(cookieParser());
const server = http.createServer(appForSocket);
const io = socketIo(server, { cors: { origin: "*" } });

io.on("connection", (socket) => {
  console.log("New connection: ", socket.id);
  // Passenger sending booking request
  socket.on("request_cab", (data) => {
    io.emit("new_request", data); // Notify all drivers
    console.log("New Request data: ", data);
  });
  // Driver accepts booking
  socket.on("accept_request", async (data) => {
    console.log("Accept Request data: ", data);
    const { uid, name, phone, vehicleNumber, vehicleImage, passportPhoto } =
      data.driverProfile;
    const {
      passengerId,
      passengerName,
      passengerPhone,
      from,
      to,
      distance,
      duration,
      fare,
    } = data.request;
    const { time } = data.time;
    const rideDetailsForDriver = {
      from,
      to,
      distance,
      duration,
      fare,
      passengerName,
      passengerPhone,
      time,
    };
    const rideDetailsForPassenger = {
      from,
      to,
      distance,
      duration,
      fare,
      driverName: name,
      driverPhone: phone,
      time,
    };
    try {
      await Driver.findOneAndUpdate(
        { uid },
        { $push: { rideHistory: rideDetailsForDriver } }
      );

      await User.findOneAndUpdate(
        { uid: passengerId },
        {
          $push: { rideHistory: rideDetailsForPassenger },
        }
      );

      io.emit("request_accepted", {
        name,
        phone,
        vehicleNumber,
        vehicleImage,
        passportPhoto,
      });
      console.log(
        "Request accepted and ride history updated for both driver and passenger:"
      );
    } catch (error) {
      console.error("Error updating ride history: ", error);
    }
  });
  // Driver ends the ride shows feedback form
  socket.on("end_ride", (data) => {
    console.log("Ride ended by driver for passenger: ", data);
    io.emit("show_feedback_form");
  });
  socket.on("Payment_done", (data) => {
    console.log("some data: ", data);

    io.emit("show_payment_done");
  });
  socket.on("disconnect", () => {
    console.log("Disconnected: ", socket.id);
  });
});

const PORT1 = process.env.PORT1;
const PORT2 = process.env.PORT2;
const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(cors({ origin: "YOUR_FRONTEND_URL", credentials: true })); // provide your frontend url

app.use("/api/auth", authRoutes);
app.get("/api/drivers", async (req, res) => {
  try {
    // Fetch all drivers
    const drivers = await Driver.find({});
    res.status(200).json(drivers);
  } catch (error) {
    res.status(500).json({ message: "Error fetching data", error });
  }
});
app.get("/api/passengers", async (req, res) => {
  try {
    // Fetch all drivers
    const passengers = await User.find({});
    res.status(200).json(passengers);
  } catch (error) {
    res.status(500).json({ message: "Error fetching data", error });
  }
});
app.delete("/api/drivers/:id", async (req, res) => {
  try {
    await Driver.findByIdAndDelete(req.params.id);
    res.status(200).send({ message: "Driver deleted successfully" });
  } catch (error) {
    res.status(500).send({ message: "Error deleting driver" });
  }
});

app.delete("/api/passengers/:id", async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.status(200).send({ message: "Passenger deleted successfully" });
  } catch (error) {
    res.status(500).send({ message: "Error deleting passenger" });
  }
});

mongoose
  .connect(process.env.mongoDB)
  .then(() => {
    console.log("Database connected");
  })
  .catch((err) => console.error(err));

app.listen(PORT1, () => console.log(`Server running on port ${PORT1}`));
server.listen(PORT2, () => console.log(`Server running on port ${PORT2}`));
