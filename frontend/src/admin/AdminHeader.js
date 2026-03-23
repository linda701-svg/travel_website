import React, { useState, useEffect } from 'react';
import { FaSearch, FaBell, FaUserCircle, FaChevronDown } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import '../Style/AdminHeader.css'; // Assuming a common CSS for header

const AdminHeader = () => {
  const [userName, setUserName] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const navigate = useNavigate(); // Initialize useNavigate

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user && user.name) {
      setUserName(user.name);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    navigate('/'); // Redirect to home/login page after logout
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  return (
    <header className="admin-header">
      <div className="header-left">
        <h1 className="header-title">Trips</h1>
        {/* Navigation for All Trips, Pending Trips, Approved */}
        <nav className="trip-tabs">
          <a href="#" className="active">All Trips</a>
          <a href="#">Pending Trips</a>
          <a href="#">Approved</a>
        </nav>
      </div>
      <div className="header-right">
        <FaBell className="notification-icon" />
        <div className="user-profile">
          <FaUserCircle className="user-avatar" />
          <span>{userName || 'Admin'}</span>
          <FaChevronDown className="dropdown-icon" onClick={toggleDropdown} />
          {isDropdownOpen && (
            <div className="user-dropdown">
              <button onClick={handleLogout} className="logout-button">Logout</button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;
