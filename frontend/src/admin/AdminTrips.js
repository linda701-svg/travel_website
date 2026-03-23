import React, { useState, useEffect } from 'react';
import TripCard from './TripCard';
import { useNavigate } from 'react-router-dom';
import '../Style/AdminTrips.css'; // Main CSS file for the new layout

const AdminTrips = () => {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const fetchTours = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Authentication token not found. Please log in.');
      }

      // Fetch all tours by setting a large limit
      const response = await fetch('http://localhost:5000/api/v1/tours?limit=1000', {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.status === 401) {
        throw new Error('Unauthorized: Please log in again.');
      }
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();

      const formattedTrips = data.data.map(tour => ({
        id: tour._id,
        title: tour.title,
        company: "Citilink", // Placeholder
        location: tour.location ? `${tour.location.city}, ${tour.location.country}` : 'N/A',
        date: tour.availability.startDate,
        price: tour.price,
        image: tour.image && tour.image.startsWith('http') ? tour.image : `http://localhost:5000${tour.image}`,
      }));
      setTrips(formattedTrips);
    } catch (err) {
      console.error('Error fetching tours:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this trip?')) {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`http://localhost:5000/api/v1/tours/${id}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error('Failed to delete trip');
        }

        // Remove the deleted trip from state
        setTrips(trips.filter(trip => trip.id !== id));
      } catch (err) {
        console.error('Error deleting trip:', err);
        alert('Failed to delete trip');
      }
    }
  };

  useEffect(() => {
    fetchTours();
  }, []);

  if (loading) {
    return <div className="admin-trips-layout">Loading trips...</div>;
  }

  if (error) {
    return <div className="admin-trips-layout">Error: {error}</div>;
  }

  return (
    <div className="admin-trips-layout">
      {/* Main Content: Trip Grid */}
      <div className="main-trip-content">
        <div className="admin-trips-header">
          <h2>Traveling by Plan</h2>
          <button className="new-trip-button" onClick={() => navigate('/admin/trips/new')}>+ New Trip</button>
        </div>


        <div className="trip-grid">
          {trips.map(trip => (
            <TripCard key={trip.id} trip={trip} onDelete={handleDelete} />
          ))}
        </div>
      </div>

      {/* Right Sidebar: Done Trips */}
      <aside className="done-trips-sidebar">
        <h2>Done Trips</h2>
        <div className="done-trip-list">
          {trips.slice(0, 7).map(trip => ( // Displaying first 7 as an example
            <div key={trip.id} className="done-trip-item">
              <img src={trip.image} alt={trip.title} className="done-trip-image" />
              <div className="done-trip-info">
                <h3>{trip.title}</h3>
                <p>{new Date(trip.date).toLocaleDateString()}</p>
              </div>
            </div>
          ))}
        </div>
      </aside>
    </div>
  );
};

export default AdminTrips;