require("dotenv").config(); // Load environment variables
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const { MongoClient } = require("mongodb");
const { Client } = require("@googlemaps/google-maps-services-js");
const nodemailer = require("nodemailer");

const app = express();
const PORT = process.env.PORT || 5001; // Updated port

// Middleware
app.use(cors());
app.use(bodyParser.json());

// MongoDB Configuration
const client = new MongoClient(process.env.MONGO_URI);

let db;

async function connectToMongoDB() {
  try {
    await client.connect();
    console.log("Connected to MongoDB");
    db = client.db("henna_booking"); // Replace with your database name
  } catch (error) {
    console.error("MongoDB connection failed:", error);
  }
}
connectToMongoDB();

// Google Maps Client
const googleMapsClient = new Client({});

// **Route: Save Booking Details**
app.post("/bookings", async (req, res) => {
  const { name, phone, email, location, service } = req.body;

  try {
    const response = await googleMapsClient.distancematrix({
      params: {
        origins: [location],
        destinations: ["Lathrop, California, 95330"],
        key: process.env.GOOGLE_MAPS_API_KEY,
      },
    });

    const distance = response.data.rows[0].elements[0].distance.value / 1000;

    const bookingsCollection = db.collection("bookings");
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

    res.status(200).json({ message: "Booking saved successfully", bookingId: result.insertedId });
  } catch (error) {
    console.error("Error saving booking:", error);
    res.status(500).json({ message: "Error processing booking" });
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
      console.error("Error sending email:", err);
    } else {
      console.log("Email sent:", info.response);
    }
  });
};

// **Route: Get All Bookings**
app.get("/bookings", async (req, res) => {
  try {
    const bookingsCollection = db.collection("bookings");
    const bookings = await bookingsCollection.find({}).toArray();
    res.status(200).json(bookings);
  } catch (error) {
    console.error("Error fetching bookings:", error);
    res.status(500).json({ message: "Error fetching bookings" });
  }
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
