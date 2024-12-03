import axios from "axios";

const API_BASE_URL = "http://localhost:5001"; // Replace with your backend URL if deployed

// Function to save booking
export const saveBooking = async (bookingData) => {
  return axios.post(`${API_BASE_URL}/bookings`, bookingData);
};

// Function to fetch all bookings
export const getBookings = async () => {
  return axios.get(`${API_BASE_URL}/bookings`);
};
