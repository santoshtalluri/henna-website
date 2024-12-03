require("dotenv").config(); // Load environment variables
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const { MongoClient, ObjectId } = require("mongodb"); // Import ObjectId
const { Client } = require("@googlemaps/google-maps-services-js");
const nodemailer = require("nodemailer");
const path = require("path");
const fs = require("fs");

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// MongoDB Configuration
const client = new MongoClient(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
let db;

// Connect to MongoDB
async function connectToMongoDB() {
  try {
    await client.connect();
    console.log("✅ Connected to MongoDB");
    db = client.db("henna_booking"); // Replace with your database name
  } catch (error) {
    console.error("❌ MongoDB connection failed:", error.message);
    process.exit(1); // Exit process if unable to connect
  }
}
connectToMongoDB();

// Google Maps Client
const googleMapsClient = new Client({});

// **Route: Save Booking Details**
app.post("/api/bookings", async (req, res) => {
  const { name, phone, email, location, service } = req.body;

  if (!name || !phone || !email || !location || !service) {
    return res.status(400).json({ message: "All fields are required." });
  }

  try {
    const bookingsCollection = db.collection("bookings");
    const existingBooking = await bookingsCollection.findOne({ email });

    if (existingBooking) {
      return res.status(409).json({ message: "A booking with this email already exists." });
    }

    const response = await googleMapsClient.distancematrix({
      params: {
        origins: [location],
        destinations: ["Lathrop, California, 95330"],
        key: process.env.GOOGLE_MAPS_API_KEY,
      },
    });

    const distance = response.data.rows[0].elements[0].distance
      ? response.data.rows[0].elements[0].distance.value / 1000
      : null;

    if (distance === null) {
      return res.status(400).json({ message: "Invalid location or unable to calculate distance." });
    }

    const result = await bookingsCollection.insertOne({
      name,
      phone,
      email,
      location,
      distance,
      service,
      created_at: new Date(),
    });

    sendConfirmationEmail(email, name);

    res.status(201).json({
      message: "Booking saved successfully.",
      bookingId: result.insertedId,
    });
  } catch (error) {
    console.error("Error in /api/bookings:", error.message || error);
    res.status(500).json({ message: "Error processing booking." });
  }
});

// **Function: Send Confirmation Email**
const sendConfirmationEmail = (email, name) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Booking Confirmation",
    text: `Hi ${name},\n\nThank you for booking with us! We look forward to serving you.\n\nBest regards,\nHenna Artist`,
  };

  transporter.sendMail(mailOptions, (err, info) => {
    if (err) {
      console.error("❌ Error sending email:", err.message || err);
    } else {
      console.log("✅ Email sent:", info.response);
    }
  });
};

// **Route: Get All Bookings**
app.get("/api/bookings", async (req, res) => {
  try {
    const bookingsCollection = db.collection("bookings");
    const bookings = await bookingsCollection.find({}).toArray();
    res.status(200).json(bookings);
  } catch (error) {
    console.error("Error fetching bookings:", error.message || error);
    res.status(500).json({ message: "Error fetching bookings." });
  }
});

// **Route: Update Booking**
app.put("/api/bookings/:id", async (req, res) => {
  const { id } = req.params;
  const { name, phone, email, location, service } = req.body;

  if (!name || !phone || !email || !location || !service) {
    return res.status(400).json({ message: "All fields are required." });
  }

  try {
    const bookingsCollection = db.collection("bookings");
    const result = await bookingsCollection.updateOne(
      { _id: new ObjectId(id) },
      { $set: { name, phone, email, location, service, updated_at: new Date() } }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({ message: "Booking not found." });
    }

    res.status(200).json({ message: "Booking updated successfully." });
  } catch (error) {
    console.error("Error updating booking:", error.message || error);
    res.status(500).json({ message: "Error updating booking." });
  }
});

// **Route: Delete Booking**
app.delete("/api/bookings/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const bookingsCollection = db.collection("bookings");
    const result = await bookingsCollection.deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return res.status(404).json({ message: "Booking not found." });
    }

    res.status(200).json({ message: "Booking deleted successfully." });
  } catch (error) {
    console.error("Error deleting booking:", error.message || error);
    res.status(500).json({ message: "Error deleting booking." });
  }
});

// **Gallery Route**
app.get("/gallery", (req, res) => {
  const galleryPath = path.join(__dirname, "public/gallery");
  fs.readdir(galleryPath, (err, files) => {
    if (err) {
      console.error("Error reading gallery folder:", err);
      return res.status(500).json({ message: "Error reading gallery folder." });
    }
    const imageFiles = files.filter((file) => /\.(jpg|jpeg|png|gif)$/i.test(file));
    res.json(imageFiles);
  });
});

// **Health Check Route**
app.get("/", (req, res) => {
  res.status(200).json({ message: "Henna Booking API is running!" });
});

// Start Server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
