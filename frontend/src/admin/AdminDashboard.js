
import React, { useState, useEffect } from 'react';
import { FaSearch, FaBell, FaMapMarkerAlt, FaStar, FaCalendarAlt } from 'react-icons/fa';
import '../Style/AdminDashboard.css';
import '../Style/AdminBooking.css'; // Reusing for consistent styling if needed

const AdminDashboard = () => {
  const [tours, setTours] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        const headers = { Authorization: `Bearer ${token}` };

        const [toursRes, bookingsRes] = await Promise.all([
          fetch('https://travel-website-hfqu.onrender.com/api/v1/tours'),
          fetch('https://travel-website-hfqu.onrender.com/api/v1/bookings', { headers })
        ]);

        if (!toursRes.ok) throw new Error('Failed to fetch tours');
        // Bookings might fail if not admin, but assuming admin dashboard access

        const toursData = await toursRes.json();
        const bookingsData = bookingsRes.ok ? await bookingsRes.json() : { data: [] };

        const processedTours = (toursData.data || []).map(tour => ({
          ...tour,
          image: tour.image && tour.image.startsWith('http') ? tour.image : `https://travel-website-hfqu.onrender.com${tour.image}`
        }));
        setTours(processedTours);
        setBookings(bookingsData.data || []);
      } catch (err) {
        console.error("Dashboard fetch error:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Helpers to get specific data subsets
  const featuredTours = tours.slice(0, 3); // Get first 3 for featured
  const bestDestinations = tours.slice(3, 8); // Next 5 for list
  const upcomingSchedule = bookings.slice(0, 3); // Top 3 bookings

  if (loading) return <div className="dashboard-loading">Loading...</div>;

  return (
    <div className="admin-dashboard-container">
      {/* Main Content Area */}
      <div className="dashboard-main">
        {/* Header */}
        <header className="dashboard-header">
          <div className="header-greeting">
            <h1>Hello, Admin 👋</h1>
            <p>Welcome back and explore the world</p>
          </div>
          <div className="header-search">
            <FaSearch className="search-icon" />
            <input type="text" placeholder="Search direction" />
          </div>
          <div className="header-notification">
            <FaBell />
            <span className="notification-dot"></span>
          </div>
        </header>

        {/* Featured Section */}
        <section className="featured-section">
          {featuredTours.map((tour, index) => (
            <div key={tour._id} className="featured-card" style={{ backgroundImage: `url(${tour.image})` }}>
              <div className="card-overlay">
                <h3>{tour.title}</h3>
                <div className="card-location">
                  <FaMapMarkerAlt /> {tour.location ? tour.location.city : 'Unknown'}
                  <span className="card-rating"><FaStar /> 4.8</span>
                </div>
              </div>
            </div>
          ))}
          {featuredTours.length === 0 && <p>No tours available.</p>}
        </section>

        {/* Best Destination List */}
        <section className="best-destination-section">
          <div className="section-header">
            <h2>Best Destination</h2>
            <button className="filter-btn">Filters</button>
          </div>
          <p className="subtitle">{tours.length} Destination found</p>

          <div className="destination-list">
            {bestDestinations.map(tour => (
              <div key={tour._id} className="destination-item">
                <img src={tour.image} alt={tour.title} className="dest-img" />
                <div className="dest-info">
                  <h4>{tour.title}</h4>
                  <p><FaMapMarkerAlt /> {tour.location ? `${tour.location.city}, ${tour.location.country}` : 'Unknown Location'}</p>
                </div>
                <div className="dest-rating">
                  <FaStar className="star" /> 4.8
                </div>
                <div className="dest-price">
                  <span>RM{tour.price}</span>/night
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* Right Sidebar */}
      <div className="dashboard-sidebar">
        {/* User Profile Widget */}
        <div className="user-profile-widget">
          <div className="user-avatar">
            <img src="https://i.pravatar.cc/150?img=12" alt="Admin" />
          </div>
          <div className="user-details">
            <h4>Jemmy Max</h4>
            <p>Traveler Enthusiast</p>
          </div>
        </div>

        {/* Calendar Widget (Static for UI) */}
        <div className="calendar-widget">
          <h3>May 2025</h3>
          <div className="calendar-grid">
            <span className="day-name">Su</span><span className="day-name">Mo</span><span className="day-name">Tu</span><span className="day-name">We</span><span className="day-name">Th</span><span className="day-name">Fr</span><span className="day-name">Sa</span>
            {/* Mock Days */}
            <span className="day disabled">27</span><span className="day disabled">28</span><span className="day disabled">29</span><span className="day disabled">30</span><span className="day">1</span><span className="day">2</span><span className="day">3</span>
            <span className="day selected">4</span><span className="day">5</span><span className="day">6</span><span className="day">7</span><span className="day">8</span><span className="day">9</span><span className="day">10</span>
            <span className="day">11</span><span className="day">12</span><span className="day">13</span><span className="day">14</span><span className="day">15</span><span className="day">16</span><span className="day">17</span>
            <span className="day">18</span><span className="day">19</span><span className="day">20</span><span className="day range-start">21</span><span className="day range-mid">22</span><span className="day range-mid">23</span><span className="day range-end">24</span>
            <span className="day">25</span><span className="day">26</span><span className="day">27</span><span className="day">28</span><span className="day">29</span><span className="day">30</span><span className="day">31</span>
          </div>
        </div>

        {/* Schedule Widget */}
        <div className="schedule-widget">
          <h3>My Schedule</h3>
          <div className="schedule-list">
            {upcomingSchedule.map((booking, index) => (
              <div key={booking._id} className="schedule-item">
                <img
                  src={
                    booking.items && booking.items[0] && booking.items[0].tourId && booking.items[0].tourId.image
                      ? (booking.items[0].tourId.image.startsWith('http')
                        ? booking.items[0].tourId.image
                        : `https://travel-website-hfqu.onrender.com${booking.items[0].tourId.image}`)
                      : 'https://via.placeholder.com/50'
                  }
                  alt="Tour"
                />
                <div className="schedule-info">
                  <h4>{booking.items && booking.items[0] && booking.items[0].tourId ? booking.items[0].tourId.title : 'Tour Booking'}</h4>
                  <p><FaCalendarAlt /> {new Date(booking.bookingDate).toLocaleDateString()}</p>
                  <div className="attendees">
                    {/* Mock attendees avatars */}
                    <span className="avatar-micro" style={{ backgroundImage: 'url(https://i.pravatar.cc/150?img=1)' }}></span>
                    <span className="avatar-micro" style={{ backgroundImage: 'url(https://i.pravatar.cc/150?img=2)' }}></span>
                    <span className="more-count">+{booking.items ? booking.items[0].quantity : 1}</span>
                  </div>
                </div>
              </div>
            ))}
            {upcomingSchedule.length === 0 && <p style={{ color: '#888', fontSize: '0.9rem' }}>No upcoming bookings.</p>}
          </div>
        </div>

        {/* Promo Card (Optional/Static) */}
        <div className="promo-card">
          <div className="promo-content">
            <h3>Let's Explore the beauty</h3>
            <p>Get special offers & news</p>
            <button className="join-now-btn">Join now</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
