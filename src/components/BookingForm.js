import React, { useState } from "react";
import PlacesAutocomplete, { geocodeByAddress, getLatLng } from "react-places-autocomplete";
import { InlineWidget } from "react-calendly";

const BookingForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    location: "",
    service: "Service1",
    appointmentDateTime: "",
  });

  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleLocationChange = (address) => {
    setFormData((prev) => ({ ...prev, location: address }));
  };

  const handleSelectLocation = async (address) => {
    try {
      const results = await geocodeByAddress(address);
      const latLng = await getLatLng(results[0]);
      console.log("Geocoded Location:", results[0]);
      console.log("Latitude and Longitude:", latLng);
      setFormData((prev) => ({ ...prev, location: address }));
    } catch (error) {
      console.error("Error with location validation:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Booking Submitted", formData);

    try {
      const response = await fetch("http://localhost:5001/api/bookings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setMessage("Your booking has been successfully submitted!");
        setFormData({
          name: "",
          phone: "",
          email: "",
          location: "",
          service: "Service1",
          appointmentDateTime: "",
        });
      } else {
        const errorData = await response.json();
        setMessage(errorData.message || "An error occurred while booking.");
      }
    } catch (error) {
      console.error("Error submitting booking:", error);
      setMessage("An error occurred while booking.");
    }
  };

  return (
    <div className="booking-form">
      <h2>Book an Appointment</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <input
            type="text"
            name="name"
            placeholder="Your Name"
            onChange={handleChange}
            value={formData.name}
            required
          />
          <input
            type="text"
            name="phone"
            placeholder="Your Phone Number"
            onChange={handleChange}
            value={formData.phone}
            required
          />
        </div>
        <div className="form-group">
          <input
            type="email"
            name="email"
            placeholder="Your Email"
            onChange={handleChange}
            value={formData.email}
            required
          />
          {/* Google Places Autocomplete for Location */}
          <PlacesAutocomplete
            value={formData.location}
            onChange={handleLocationChange}
            onSelect={handleSelectLocation}
          >
            {({ getInputProps, suggestions, getSuggestionItemProps, loading }) => (
              <div>
                <input
                  {...getInputProps({
                    placeholder: "Your Location",
                    className: "location-input",
                  })}
                  required
                />
                <div className="autocomplete-dropdown">
                  {loading && <div>Loading...</div>}
                  {suggestions.map((suggestion) => {
                    const className = suggestion.active
                      ? "suggestion-item--active"
                      : "suggestion-item";
                    return (
                      <div
                        {...getSuggestionItemProps(suggestion, {
                          className,
                        })}
                        key={suggestion.placeId}
                      >
                        <span>{suggestion.description}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </PlacesAutocomplete>
        </div>
        <div className="form-group">
          <select name="service" onChange={handleChange} value={formData.service}>
            <option value="Service1">Service1</option>
            <option value="Service2">Service2</option>
            <option value="Service3">Service3</option>
          </select>
        </div>
        <div className="form-group">
          <input
            type="datetime-local"
            name="appointmentDateTime"
            placeholder="Appointment Date & Time"
            onChange={handleChange}
            value={formData.appointmentDateTime}
            required
          />
        </div>
        <button type="submit">Book Now</button>
      </form>
      {message && <p>{message}</p>}
      <h3>Or schedule through Calendly</h3>
      <InlineWidget url="https://calendly.com/tprashu30" />
    </div>
  );
};

export default BookingForm;
