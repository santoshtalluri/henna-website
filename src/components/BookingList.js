import React, { useState } from "react";

const BookingList = ({ bookings, fetchBookings }) => {
  const [editingId, setEditingId] = useState(null);
  const [editingData, setEditingData] = useState({});

  const handleEdit = (booking) => {
    setEditingId(booking._id);
    setEditingData({ ...booking });
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this booking?")) {
      try {
        const response = await fetch(`http://localhost:5001/api/bookings/${id}`, {
          method: "DELETE",
        });

        if (response.ok) {
          alert("Booking deleted successfully.");
          fetchBookings(); // Refresh the booking list
        } else {
          alert("Failed to delete booking.");
        }
      } catch (error) {
        console.error("Error deleting booking:", error);
        alert("An error occurred while deleting the booking.");
      }
    }
  };

  const handleUpdate = async () => {
    try {
      const response = await fetch(`http://localhost:5001/api/bookings/${editingId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editingData),
      });

      if (response.ok) {
        alert("Booking updated successfully.");
        setEditingId(null); // Exit editing mode
        fetchBookings(); // Refresh the booking list
      } else {
        alert("Failed to update booking.");
      }
    } catch (error) {
      console.error("Error updating booking:", error);
      alert("An error occurred while updating the booking.");
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditingData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="booking-list">
      <h2>Existing Bookings</h2>
      {bookings.map((booking) => (
        <div key={booking._id} className="booking-card">
          {editingId === booking._id ? (
            <>
              <input
                type="text"
                name="name"
                value={editingData.name}
                onChange={handleInputChange}
                placeholder="Name"
              />
              <input
                type="text"
                name="phone"
                value={editingData.phone}
                onChange={handleInputChange}
                placeholder="Phone"
              />
              <input
                type="email"
                name="email"
                value={editingData.email}
                onChange={handleInputChange}
                placeholder="Email"
              />
              <input
                type="text"
                name="location"
                value={editingData.location}
                onChange={handleInputChange}
                placeholder="Location"
              />
              <select
                name="service"
                value={editingData.service}
                onChange={handleInputChange}
              >
                <option value="Service1">Service1</option>
                <option value="Service2">Service2</option>
                <option value="Service3">Service3</option>
              </select>
              <button onClick={handleUpdate}>Update Appointment</button>
              <button onClick={() => setEditingId(null)}>Cancel</button>
            </>
          ) : (
            <>
              <p><strong>Name:</strong> {booking.name}</p>
              <p><strong>Phone:</strong> {booking.phone}</p>
              <p><strong>Email:</strong> {booking.email}</p>
              <p><strong>Location:</strong> {booking.location}</p>
              <p><strong>Service:</strong> {booking.service}</p>
              <button onClick={() => handleEdit(booking)}>Edit</button>
              <button onClick={() => handleDelete(booking._id)}>Delete</button>
            </>
          )}
        </div>
      ))}
    </div>
  );
};

export default BookingList;
