import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import "./App.css";
import BookingForm from "./components/BookingForm";
import BookingList from "./components/BookingList";
import Gallery from "./components/Gallery";
import Footer from "./components/Footer";

function App() {
  // State to hold bookings
  const [bookings, setBookings] = useState([]);

  // Function to fetch bookings from the backend
  const fetchBookings = async () => {
    try {
      const response = await fetch("http://localhost:5001/api/bookings");
      if (response.ok) {
        const data = await response.json();
        setBookings(data);
      } else {
        console.error("Failed to fetch bookings:", response.statusText);
      }
    } catch (error) {
      console.error("Error fetching bookings:", error);
    }
  };

  // Fetch bookings on component mount
  useEffect(() => {
    fetchBookings();
  }, []);

  return (
    <Router>
      <div className="App">
        <header className="App-header">
          <nav className="navbar">
            <h1>Henna Booking App</h1>
            <ul className="nav-links">
              <li><Link to="/">Home</Link></li>
              <li><Link to="/my-work">My Work</Link></li>
              <li><Link to="/view-bookings">View Bookings</Link></li>
            </ul>
          </nav>
        </header>
        <main>
          <Routes>
            {/* Home route */}
            <Route
              path="/"
              element={
                <>
                  <section id="book">
                    <BookingForm />
                  </section>
                  <section id="gallery">
                    <Gallery />
                  </section>
                </>
              }
            />
            {/* My Work route */}
            <Route path="/my-work" element={<Gallery />} />

            {/* View Bookings route */}
            <Route
              path="/view-bookings"
              element={
                <section id="bookings">
                  <BookingList bookings={bookings} fetchBookings={fetchBookings} />
                </section>
              }
            />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
