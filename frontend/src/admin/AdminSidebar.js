import React from 'react';
import { FaHome, FaPlane, FaDollarSign, FaUserShield, FaUsers, FaEnvelope } from 'react-icons/fa';
import { NavLink } from 'react-router-dom';
import '../Style/AdminSidebar.css';

const AdminSidebar = () => {
  return (
    <aside className="admin-sidebar">
      <div className="sidebar-header">
        <NavLink to="/admin" className="logo-link">
          <img
            src="https://tourpress.b-cdn.net/wp-content/uploads/2020/04/logo.png"
            alt="TourPress Admin"
            className="admin-logo-img"
          />
        </NavLink>
      </div>
      <nav className="sidebar-nav">
        <div className="nav-section">
          <h4 className="nav-title">My View</h4>
          <ul>
            <li><NavLink to="/admin" exact="true" activeclassname="active"><FaHome /> Home</NavLink></li>
            <li><NavLink to="/admin/trips" activeclassname="active"><FaPlane /> Trips</NavLink></li>
            <li><NavLink to="/admin/booking" activeclassname="active"><FaDollarSign /> Booking</NavLink></li>
            <li><NavLink to="/admin/user" activeclassname="active"><FaUsers /> Users</NavLink></li>
            <li><NavLink to="/admin/messages" activeclassname="active"><FaEnvelope /> Messages</NavLink></li>
          </ul>
        </div>
        <div className="nav-section">
          <h4 className="nav-title">Admin View</h4>
          <ul>
            <li><NavLink to="/admin" activeclassname="active"><FaUserShield /> Admin Dashboard</NavLink></li>

          </ul>
        </div>
      </nav>
    </aside>
  );
};

export default AdminSidebar;
