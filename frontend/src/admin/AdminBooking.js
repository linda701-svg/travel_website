import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaCalendarAlt, FaEllipsisV, FaEdit, FaTrashAlt } from 'react-icons/fa';
import '../Style/AdminTable.css';
import '../Style/AdminBooking.css';

const AdminBooking = () => {
  const [allBookings, setAllBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeStatusFilter, setActiveStatusFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  // State for dropdowns
  const [dropdownOpen, setDropdownOpen] = useState(null);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [bookingsPerPage] = useState(7);

  const fetchBookings = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('https://travel-website-hfqu.onrender.com/api/v1/bookings', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAllBookings(response.data.data);
    } catch (err) {
      console.error('Error fetching bookings:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleDeleteBooking = async (id) => {
    if (window.confirm('Are you sure you want to remove this booking?')) {
      try {
        const token = localStorage.getItem('token');
        await axios.delete(`https://travel-website-hfqu.onrender.com/api/v1/bookings/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setAllBookings(allBookings.filter(booking => booking._id !== id));
      } catch (err) {
        console.error('Error deleting booking:', err);
        setError('Failed to delete booking. Please try again.');
      }
    }
  };

  const handleEditBooking = (id) => {
    navigate(`/admin/bookings/edit/${id}`);
  };

  const getCountsByStatus = () => {
    const counts = {
      pending: 0,    // Will include pending_payment and pending_COD
      confirmed: 0,
      completed: 0,
      all: allBookings.length,
    };
    allBookings.forEach(booking => {
      if (booking.status === 'pending_payment' || booking.status === 'pending_COD') {
        counts.pending++;
      } else if (booking.status === 'confirmed') {
        counts.confirmed++;
      } else if (booking.status === 'completed') {
        counts.completed++;
      }
      // Add other statuses if needed, e.g., cancelled, refunded
    });
    return counts;
  };

  const counts = getCountsByStatus();

  const filteredBookings = allBookings.filter(booking => {
    // Filter by status
    if (activeStatusFilter === 'all') {
      return true;
    } else if (activeStatusFilter === 'pending') {
      return booking.status === 'pending_payment' || booking.status === 'pending_COD';
    } else if (activeStatusFilter === 'confirmed') {
      return booking.status === 'confirmed';
    } else if (activeStatusFilter === 'completed') {
      return booking.status === 'completed';
    }
    return false; // Should not reach here with valid activeStatusFilter values
  }).filter(booking => { // Chain with search term filter
    // Filter by search term (customer name or email, tour title)
    if (searchTerm) {
      const lowerCaseSearchTerm = searchTerm.toLowerCase();
      const userName = booking.customerDetails ? booking.customerDetails.name.toLowerCase() : '';
      const userEmail = booking.customerDetails ? booking.customerDetails.email.toLowerCase() : '';
      const tourTitle = (booking.items && booking.items.length > 0) ? booking.items[0].tourId.title.toLowerCase() : '';

      return (
        userName.includes(lowerCaseSearchTerm) ||
        userEmail.includes(lowerCaseSearchTerm) ||
        tourTitle.includes(lowerCaseSearchTerm)
      );
    }
    return true;
  });

  // Get current bookings for pagination
  const indexOfLastBooking = currentPage * bookingsPerPage;
  const indexOfFirstBooking = indexOfLastBooking - bookingsPerPage;
  const currentBookings = filteredBookings.slice(indexOfFirstBooking, indexOfLastBooking);

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const pageNumbers = [];
  for (let i = 1; i <= Math.ceil(filteredBookings.length / bookingsPerPage); i++) {
    pageNumbers.push(i);
  }

  const formatBookingDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' }); // e.g., 08 Aug 2021
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false }); // e.g., 01:00
  };

  const formatCurrency = (amount) => {
    return `RM ${amount.toFixed(2)}`; // Assuming RM currency as per image
  };

  if (loading) return <div className="admin-booking-container">Loading bookings...</div>;
  if (error) return <div className="admin-booking-container">Error fetching bookings: {error}</div>;

  return (
    <div className="admin-booking-container">
      <div className="admin-booking-header">
        <h2>RESERVATION LIST</h2>
        <button className="resync-btn">Resync Branch Code</button>
      </div>

      <div className="status-cards-container">
        {Object.keys(counts).filter(key => key !== 'all').map(status => (
          <div
            key={status}
            className={`status-card ${activeStatusFilter === status ? 'active' : ''}`}
            onClick={() => setActiveStatusFilter(status)}
          >
            <h4>{status.charAt(0).toUpperCase() + status.slice(1)}</h4>
            <p>{counts[status]}</p>
          </div>
        ))}
        {/* The 'All' count is implicitly handled by the sum of others or can be added explicitly */}
      </div>

      <div className="filter-bar">
        <input
          type="text"
          placeholder="Search customer, tour..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <div className="date-input-container">
          <input type="text" placeholder="Date Period DD/MM/YY" />
          <FaCalendarAlt />
        </div>
        <select>
          <option>Pickup Location All</option>
        </select>
        <select>
          <option>Return Location All</option>
        </select>
        <select>
          <option>Fleet All</option>
        </select>
      </div>

      <div className="booking-table-wrapper">
        <table className="booking-table">
          <thead>
            <tr>
              <th className="col-no">No.</th>
              <th>Tour Details</th>
              <th>Customer</th>
              <th>Travelers</th>
              <th>Mobile No.</th>
              <th>Payment</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentBookings.length > 0 ? (
              currentBookings.map((booking, index) => (
                <tr key={booking._id}>
                  <td className="col-no">{indexOfFirstBooking + index + 1}.</td>
                  <td>
                    <strong>{booking.items && booking.items.length > 0 ? booking.items[0].tourId.title : 'No Tour Info'}</strong> <br />
                    {formatBookingDate(booking.bookingDate)} {formatTime(booking.bookingDate)}
                  </td>
                  <td>
                    <a href="#" className="customer-link">
                      {booking.customerDetails ? booking.customerDetails.name : 'User Deleted'}
                    </a> <br />
                    {booking.customerDetails ? booking.customerDetails.email : ''}
                  </td>
                  <td>{booking.items ? booking.items.reduce((sum, item) => sum + item.quantity, 0) : 0}</td>
                  <td>
                    {booking.customerDetails?.phone || 'N/A'}
                  </td>
                  <td>
                    {formatCurrency(booking.totalAmount)} <br />
                    <span className={`payment-status ${booking.status === 'completed' ? 'paid' : booking.status}`}>
                      {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                    </span>
                  </td>
                  <td>
                    <div className="actions-dropdown-container">
                      <button className="actions-button" onClick={() => setDropdownOpen(dropdownOpen === booking._id ? null : booking._id)}>
                        <FaEllipsisV />
                      </button>
                      {dropdownOpen === booking._id && (
                        <ul className="actions-dropdown">
                          <li onClick={() => handleEditBooking(booking._id)}>
                            <FaEdit /> Edit
                          </li>
                          <li onClick={() => handleDeleteBooking(booking._id)}>
                            <FaTrashAlt /> Remove
                          </li>
                        </ul>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" style={{ textAlign: 'center' }}>No bookings found for this criteria.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="pagination">
        <button onClick={() => paginate(currentPage - 1)} disabled={currentPage === 1}>&larr;</button>
        {pageNumbers.map(number => (
          <button key={number} onClick={() => paginate(number)} className={currentPage === number ? 'active' : ''}>
            {number}
          </button>
        ))}
        <button onClick={() => paginate(currentPage + 1)} disabled={currentPage === pageNumbers.length}>&rarr;</button>
      </div>

    </div>
  );
};

export default AdminBooking;
