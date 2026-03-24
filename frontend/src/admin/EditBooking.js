import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../Style/AdminBooking.css'; // Re-use styles if applicable

const EditBooking = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [tours, setTours] = useState([]);
  const [formData, setFormData] = useState({
    tourId: '',
    name: '',
    email: '',
    phone: '',
    numberOfTravelers: '',
    status: '',
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        const [bookingRes, toursRes] = await Promise.all([
          axios.get(`https://travel-website-hfqu.onrender.com/api/v1/bookings/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get('https://travel-website-hfqu.onrender.com/api/v1/tours'),
        ]);

        const bookingData = bookingRes.data.data;
        setTours(toursRes.data.data);

        // Ensure bookingData.items and bookingData.customerDetails exist
        const tourIdToSet = bookingData.items && bookingData.items.length > 0 ? bookingData.items[0].tourId._id : '';
        const customerName = bookingData.customerDetails ? bookingData.customerDetails.name : '';
        const customerEmail = bookingData.customerDetails ? bookingData.customerDetails.email : '';
        const customerPhone = bookingData.customerDetails ? bookingData.customerDetails.phone : '';
        const calculatedTravelers = bookingData.items ? bookingData.items.reduce((sum, item) => sum + item.quantity, 0) : '';

        setFormData({
          tourId: tourIdToSet,
          name: customerName,
          email: customerEmail,
          phone: customerPhone || '',
          numberOfTravelers: calculatedTravelers,
          status: bookingData.status,
        });
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');

      // Find the selected tour to get the price
      const selectedTour = tours.find(tour => tour._id === formData.tourId);
      const priceAtPurchase = selectedTour ? selectedTour.price : 0;

      // Construct payload to match backend structure
      const payload = {
        customerDetails: {
          name: formData.name,
          email: formData.email,
          phone: formData.phone
        },
        items: [
          {
            tourId: formData.tourId,
            quantity: Number(formData.numberOfTravelers),
            priceAtPurchase: priceAtPurchase
          }
        ],
        status: formData.status,
      };

      await axios.put(`https://travel-website-hfqu.onrender.com/api/v1/bookings/${id}`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });
      navigate('/admin/booking'); // Navigate back to the bookings list
    } catch (err) {
      console.error('Error updating booking:', err);
      setError('Failed to update booking. Please try again.');
    }
  };

  if (loading) return <div className="admin-booking-container">Loading...</div>;
  if (error) return <div className="admin-booking-container">Error: {error}</div>;

  return (
    <div className="admin-booking-container">
      <h2>Edit Booking</h2>
      <br />
      <form onSubmit={handleSubmit} className="booking-edit-form">
        <div className="form-group">
          <label htmlFor="name">Customer Name</label>
          <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} className="form-control" />
        </div>
        <div className="form-group">
          <label htmlFor="email">Customer Email</label>
          <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} className="form-control" />
        </div>
        <div className="form-group">
          <label htmlFor="phone">Mobile No.</label>
          <input type="text" id="phone" name="phone" value={formData.phone} onChange={handleChange} className="form-control" />
        </div>
        <div className="form-group">
          <label htmlFor="tourId">Tour</label>
          <select id="tourId" name="tourId" value={formData.tourId} onChange={handleChange} className="form-control">
            <option value="">Select a Tour</option>
            {tours.map(tour => (
              <option key={tour._id} value={tour._id}>{tour.title}</option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="numberOfTravelers">Number of Travelers</label>
          <input
            type="number"
            id="numberOfTravelers"
            name="numberOfTravelers"
            value={formData.numberOfTravelers}
            onChange={handleChange}
            className="form-control"
          />
        </div>
        <div className="form-group">
          <label htmlFor="status">Status</label>
          <select
            id="status"
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="form-control"
          >
            <option value="pending">Pending</option>
            <option value="confirmed">Confirmed</option>
            <option value="completed">Completed</option>
          </select>
        </div>
        <br />
        <div className="modal-buttons">
          <button type="button" className="no-btn" onClick={() => navigate('/admin/booking')}>Cancel</button>
          <button type="submit" className="yes-btn">Save Changes</button>
        </div>
        {error && <p className="error-message" style={{ color: 'red', marginTop: '10px' }}>{error}</p>}
      </form>
    </div>
  );
};

export default EditBooking;
