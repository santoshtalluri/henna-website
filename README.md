# Henna Booking App

A full-stack web application for booking Henna appointments. The application includes features such as appointment scheduling, gallery viewing, and booking management, with backend support using MongoDB and frontend built using React.

---

## Features

- **Appointment Booking**: Users can book appointments by filling out a form with their details.
- **Google Maps Integration**: Validates and fetches user location details.
- **Calendly Integration**: Allows users to schedule appointments seamlessly.
- **Gallery**: Showcases all Henna design images dynamically loaded from the backend.
- **Booking Management**: View, update, and delete bookings from the MongoDB database.

---

## Tech Stack

- **Frontend**: React, React Router, LightGallery, React Places Autocomplete, React Calendly
- **Backend**: Node.js, Express.js
- **Database**: MongoDB
- **External Services**: Google Maps API, Calendly

---

## Installation

### Prerequisites

Ensure you have the following installed:
- Node.js and npm
- MongoDB (local or cloud instance)
- Git

---

### Steps to Set Up Locally

1. Clone the repository:
   ```bash
   git clone https://github.com/santoshtalluri/henna-website.git
   cd henna-website

2. Set up the backend:

bash
Copy code
cd backend
npm install

3. Set up the frontend:

bash
Copy code
cd ../frontend
npm install

4. Create a .env file in the backend folder:
plaintext
Copy code
MONGO_URI=your_mongodb_connection_string
GOOGLE_MAPS_API_KEY=your_google_maps_api_key
EMAIL_USER=your_email
EMAIL_PASS=your_email_password

5. Run the backend server:
bash
Copy code
cd ../backend
node server.js

6. Run the frontend server:
bash
Copy code
cd ../frontend
npm start

7. Access the application at:
arduino
Copy code
http://localhost:3000
