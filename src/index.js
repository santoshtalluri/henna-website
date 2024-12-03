import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";

// Dynamically load Google Maps API script
const loadGoogleMapsScript = () => {
  const apiKey = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;

  if (!apiKey) {
    console.error("Google Maps API key is missing.");
    return;
  }

  const script = document.createElement("script");
  script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
  script.async = true; // Ensures asynchronous loading
  script.defer = true; // Ensures it doesn’t block the DOM
  script.onload = () => console.log("Google Maps script loaded successfully.");
  script.onerror = () => console.error("Error loading Google Maps script.");
  document.head.appendChild(script);
};

loadGoogleMapsScript();


// Render the React app using React 18's createRoot
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
