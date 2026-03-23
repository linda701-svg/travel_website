import React from 'react';
import { FaMapMarkerAlt, FaTrash, FaEye } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import '../Style/TripCard.css';

const TripCard = ({ trip, onDelete }) => {

  const formatDate = (dateString) => {
    const options = { day: '2-digit', month: 'short', hour: 'numeric', minute: 'numeric', hour12: true };
    const date = new Date(dateString);
    const day = date.toLocaleDateString('en-US', { day: '2-digit' });
    const month = date.toLocaleDateString('en-US', { month: 'short' });
    const time = date.toLocaleTimeString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true });
    return `${day} ${month} ${time}`;
  };

  return (
    <div className="trip-card">
      <div className="trip-card-image-content">
        <img src={trip.image} alt={trip.title} className="trip-card-image" />
        <div className="card-actions">
          <Link to={`/admin/trips/${trip.id}`} className="view-trip-btn" title="View Trip">
            <FaEye />
          </Link>
          <button className="delete-trip-btn" onClick={() => onDelete(trip.id)} title="Delete Trip">
            <FaTrash />
          </button>
        </div>
      </div>
      <div className="trip-card-content">
        <div className="trip-card-header">
          <h3>{trip.title}</h3>
          <p className="trip-company">{trip.company}</p>
        </div>
        <p className="trip-location"><FaMapMarkerAlt /> {trip.location || 'N/A'}</p>
      </div>
      <div className="trip-details-bottom">
        <span className="trip-date">{formatDate(trip.date)}</span>
        <span className="trip-price">${trip.price}/dAY</span>
      </div>
    </div>
  );
};

export default TripCard;
