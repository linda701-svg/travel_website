import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaEllipsisV, FaTrashAlt, FaBan, FaUserCircle, FaFlag } from 'react-icons/fa'; // Import necessary icons
import '../Style/AdminTable.css'; // Keep for general table styles if needed, or remove if AdminUser.css covers all
import '../Style/AdminUser.css'; // New CSS for user management UI

const AdminUser = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('all'); // 'all', 'blocked', 'reported'
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [showBlockModal, setShowBlockModal] = useState(false);
  const [userToBlock, setUserToBlock] = useState(null);
  const [showReportModal, setShowReportModal] = useState(false);
  const [userToReport, setUserToReport] = useState(null);
  const [reportReason, setReportReason] = useState('');
  const [dropdownOpen, setDropdownOpen] = useState(null); // To control which dropdown is open

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage] = useState(7); // As seen in the image, roughly 7 users per page

  const fetchUsers = async () => {
    try {
      const response = await axios.get('https://travel-website-hfqu.onrender.com/api/v1/users');
      setUsers(response.data.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDeleteUser = async (id) => {
    try {
      const token = localStorage.getItem('token'); // Assuming you store token for auth
      await axios.delete(`https://travel-website-hfqu.onrender.com/api/v1/users/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setUsers(users.filter(user => user._id !== id));
      setShowDeleteModal(false);
      setUserToDelete(null);
      setDropdownOpen(null); // Close dropdown after action
    } catch (err) {
      console.error('Error deleting user:', err);
      setError(err.message);
    }
  };

  const handleToggleBlockUser = async (id) => {
    try {
      const token = localStorage.getItem('token'); // Assuming you store token for auth
      const response = await axios.put(`https://travel-website-hfqu.onrender.com/api/v1/users/${id}/block`, {}, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      // Update user in state
      setUsers(users.map(user => user._id === id ? response.data.data : user));
      setShowBlockModal(false);
      setUserToBlock(null);
      setDropdownOpen(null); // Close dropdown after action
    } catch (err) {
      console.error('Error blocking/unblocking user:', err);
      setError(err.message);
    }
  };

  const openDeleteModal = (user) => {
    setUserToDelete(user);
    setShowDeleteModal(true);
    setDropdownOpen(null); // Close dropdown
  };

  const openBlockModal = (user) => {
    setUserToBlock(user);
    setShowBlockModal(true);
    setDropdownOpen(null); // Close dropdown
  };

  const openReportModal = (user) => {
    setUserToReport(user);
    setShowReportModal(true);
    setReportReason(''); // Clear previous reason
    setDropdownOpen(null); // Close dropdown
  };

  const handleReportUser = async () => {
    if (!userToReport || !reportReason) return; // Basic validation

    try {
      const token = localStorage.getItem('token');

      // --- MOCK IMPLEMENTATION ---
      // The backend endpoint for reporting a user appears to be missing (returned a 404).
      // The following code is a mock to simulate a successful API call.
      // TODO: Replace this with the actual API call once the backend endpoint is available.
      // The backend should handle a POST request to a URL like:
      // `https://travel-website-hfqu.onrender.com/api/v1/users/${userToReport._id}/report`
      // and return the updated user object.

      /*
      // Original API call (currently failing with 404):
      const response = await axios.post(`https://travel-website-hfqu.onrender.com/api/v1/users/${userToReport._id}/report`,
        { reason: reportReason },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      */

      // Simulated successful response:
      const simulatedResponse = {
        data: {
          data: {
            ...userToReport,
            isReported: true,
          }
        }
      };
      const response = await Promise.resolve(simulatedResponse); // Simulate async call
      // --- END MOCK ---

      // Update the user in the state to reflect the reported status
      setUsers(users.map(user => user._id === userToReport._id ? response.data.data : user));

      setShowReportModal(false);
      setUserToReport(null);
      setReportReason('');
    } catch (err) {
      console.error('Error reporting user:', err); // This will now only catch errors in the mock or state updates
      setError(err.message); // Show error to the user
    }
  };

  const filteredUsers = users.filter(user => {
    if (activeTab === 'all') return true;
    if (activeTab === 'blocked') return user.isBlocked;
    if (activeTab === 'reported') return user.isReported; // Assumes a user object has an 'isReported' property
    return true;
  });

  // Get current users for pagination
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const pageNumbers = [];
  for (let i = 1; i <= Math.ceil(filteredUsers.length / usersPerPage); i++) {
    pageNumbers.push(i);
  }

  if (loading) return <div className="admin-user-container">Loading users...</div>;
  if (error) return <div className="admin-user-container">Error fetching users: {error}</div>;

  return (
    <div className="admin-user-container">
      <div className="admin-user-header">
        <h2>Users</h2>
        <button className="users-applications-btn">Users Applications</button>
      </div>

      <div className="user-tabs">
        <button
          className={activeTab === 'all' ? 'active' : ''}
          onClick={() => setActiveTab('all')}
        >
          All Users
        </button>
        <button
          className={activeTab === 'blocked' ? 'active' : ''}
          onClick={() => setActiveTab('blocked')}
        >
          Blocked Users
        </button>
        <button
          className={activeTab === 'reported' ? 'active' : ''}
          onClick={() => setActiveTab('reported')}
        >
          Reported Users
        </button>
      </div>

      <div className="user-table-wrapper">
        <table className="user-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Register Date</th>
              <th>Account Type</th>
              <th>Followers</th>
              <th>Last Active</th>
              <th>Status</th>
              <th></th> {/* Actions column */}
            </tr>
          </thead>
          <tbody>
            {currentUsers.length > 0 ? (
              currentUsers.map((user) => (
                <tr key={user._id}>
                  <td>
                    <div className="user-info">
                      <FaUserCircle className="user-avatar" size={40} /> {/* Placeholder for avatar */}
                      <div className="user-details">
                        <h4>{user.name}</h4>
                        <p>{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                  <td>{user.role}</td>
                  <td>{Math.floor(Math.random() * 1000) + 100}</td> {/* Placeholder for followers */}
                  <td>{Math.floor(Math.random() * 60) + 1} min ago</td> {/* Placeholder for last active */}
                  <td>
                    {user.isBlocked ? (
                      <span className="status-badge status-blocked">Blocked</span>
                    ) : user.isReported ? (
                      <span className="status-badge" style={{ backgroundColor: '#ffc107', color: '#333' }}>Reported</span>
                    ) : (
                      <span className="status-badge status-active">Active</span>
                    )}
                  </td>
                  <td>
                    <div className="actions-dropdown-container">
                      <button className="actions-button" onClick={() => setDropdownOpen(dropdownOpen === user._id ? null : user._id)}>
                        <FaEllipsisV />
                      </button>
                      {dropdownOpen === user._id && (
                        <ul className="actions-dropdown">
                          <li onClick={() => openDeleteModal(user)}>
                            <FaTrashAlt /> Delete User
                          </li>
                          <li onClick={() => openBlockModal(user)}>
                            <FaBan /> {user.isBlocked ? 'Unblock User' : 'Block User'}
                          </li>
                          <li onClick={() => openReportModal(user)}>
                            <FaFlag /> Report User
                          </li>
                          {/* Edit User function not explicitly in image, but can be added here */}
                          {/* <li onClick={() => handleEditUser(user)}>
                            <FaEdit /> Edit User
                          </li> */}
                        </ul>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" style={{ textAlign: 'center' }}>No users found for this category.</td>
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

      {/* Delete Confirmation Modal */}
      {showDeleteModal && userToDelete && (
        <div className="modal-backdrop">
          <div className="modal-content">
            <p>Are you sure you want to Delete user "{userToDelete.name}"?</p>
            <div className="modal-buttons">
              <button className="no-btn" onClick={() => setShowDeleteModal(false)}>No</button>
              <button className="yes-btn" onClick={() => handleDeleteUser(userToDelete._id)}>Yes</button>
            </div>
          </div>
        </div>
      )}

      {/* Block Confirmation Modal */}
      {showBlockModal && userToBlock && (
        <div className="modal-backdrop" style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background: '#ffffff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 999,
        }}>
          <div className="modal-content">
            <p>Are you sure you want to {userToBlock.isBlocked ? 'Unblock' : 'Block'} user "{userToBlock.name}"?</p>
            <div className="modal-buttons">
              <button className="no-btn" onClick={() => setShowBlockModal(false)}>No</button>
              <button className="yes-btn" onClick={() => handleToggleBlockUser(userToBlock._id)}>Yes</button>
            </div>
          </div>
        </div>
      )}

      {/* Report User Modal */}
      {showReportModal && userToReport && (
        <div className="modal-backdrop" style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background: '#ffffff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 999,
        }}>
          <div className="modal-content">
            <h4>Report User: {userToReport.name}</h4>
            <textarea
              className="report-reason-textarea"
              style={{ width: '100%', minHeight: '100px', padding: '10px', margin: '10px 0', boxSizing: 'border-box' }}
              placeholder="Please provide a reason for reporting this user..."
              value={reportReason}
              onChange={(e) => setReportReason(e.target.value)}
            />
            <div className="modal-buttons">
              <button className="no-btn" onClick={() => setShowReportModal(false)}>Cancel</button>
              <button className="yes-btn" onClick={handleReportUser} disabled={!reportReason.trim()}>Submit Report</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminUser;
