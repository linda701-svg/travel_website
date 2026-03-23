import React, { useState, useEffect } from 'react';
import '../Style/AdminMessages.css';

const AdminMessages = () => {
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchMessages = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await fetch('http://localhost:5000/api/v1/contact', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch messages');
                }

                const data = await response.json();
                if (data.success) {
                    setMessages(data.data);
                } else {
                    setError('Failed to load messages');
                }
            } catch (err) {
                console.error('Error fetching messages:', err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchMessages();
    }, []);

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    if (loading) return <div className="admin-messages-container">Loading messages...</div>;
    if (error) return <div className="admin-messages-container">Error: {error}</div>;

    return (
        <div className="admin-messages-container">
            <h2>Contact Messages</h2>
            <div className="messages-list">
                {messages.length === 0 ? (
                    <p>No messages found.</p>
                ) : (
                    messages.map((msg) => (
                        <div key={msg._id} className="message-card">
                            <div className="message-header">
                                <div className="sender-info">
                                    <h4>{msg.firstName} {msg.lastName}</h4>
                                    <span className="sender-email">{msg.email}</span>
                                    {msg.phone && <span className="sender-phone"> | {msg.phone}</span>}
                                </div>
                                <span className="message-date">{formatDate(msg.createdAt)}</span>
                            </div>
                            <div className="message-body">
                                <p>{msg.message}</p>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default AdminMessages;
