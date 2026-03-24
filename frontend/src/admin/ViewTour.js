import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import NewTripForm from './NewTripForm'; // Import the form component
import '../Style/ViewTour.css';

const ViewTour = () => {
    const [tour, setTour] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isEditing, setIsEditing] = useState(false); // State for toggle edit mode
    const { id } = useParams();

    const fetchTour = async () => {
        try {
            setLoading(true);
            const response = await fetch(`https://travel-website-hfqu.onrender.com/api/v1/tours/${id}`);
            const data = await response.json();
            if (data.success) {
                setTour(data.data);
            } else {
                setError('Failed to fetch tour data');
            }
        } catch (err) {
            console.error('Error fetching tour details:', err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTour();
    }, [id]);

    if (loading) return <div className="admin-view-container">Loading tour details...</div>;
    if (error) return <div className="admin-view-container">Error: {error}</div>;
    if (!tour) return <div className="admin-view-container">Tour not found</div>;

    // Render Edit Form if in editing mode
    if (isEditing) {
        return (
            <div className="admin-view-container">
                <NewTripForm
                    existingTour={tour}
                    setShowNewTripForm={setIsEditing}
                    fetchTours={fetchTour}
                />
            </div>
        );
    }

    return (
        <div className="admin-view-container">
            <div className="admin-view-header">
                <h2>Tour Details: {tour.title}</h2>
                <div className="header-actions">
                    <button className="edit-btn" onClick={() => setIsEditing(true)}>Edit Tour</button>
                    <Link to="/admin/trips" className="back-btn">Back to Trips</Link>
                </div>
            </div>

            <div className="admin-tour-card">
                {/* Banner Section */}
                {tour.banner && (
                    <div className="tour-banner-preview">
                        <img src={tour.banner.startsWith('http') ? tour.banner : `https://travel-website-hfqu.onrender.com${tour.banner}`} alt="Tour Banner" />
                        <span className="image-label">Banner Image</span>
                    </div>
                )}

                <div className="tour-info-grid">
                    <div className="info-group">
                        <label>Title:</label>
                        <p>{tour.title}</p>
                    </div>
                    <div className="info-group">
                        <label>Price:</label>
                        <p>${tour.price}</p>
                    </div>
                    <div className="info-group">
                        <label>Duration:</label>
                        <p>{tour.duration} Days</p>
                    </div>
                    <div className="info-group">
                        <label>Location:</label>
                        <p>{tour.location ? `${tour.location.city}, ${tour.location.country}` : 'N/A'}</p>
                    </div>
                    <div className="info-group full-width">
                        <label>Description:</label>
                        <p>{tour.description}</p>
                    </div>
                </div>

                {/* Itinerary Section */}
                <div className="section-block">
                    <h3>Itinerary</h3>
                    {tour.itinerary && tour.itinerary.length > 0 ? (
                        <div className="itinerary-list">
                            {tour.itinerary.map((item, index) => (
                                <div key={index} className="itinerary-item">
                                    <h4>Day {item.day}</h4>
                                    <p>{item.description}</p>
                                </div>
                            ))}
                        </div>
                    ) : <p>No itinerary available.</p>}
                </div>

                {/* Gallery Section */}
                <div className="section-block">
                    <h3>Gallery</h3>
                    {tour.gallery && tour.gallery.length > 0 ? (
                        <div className="gallery-preview-grid">
                            {tour.gallery.map((item, index) => (
                                <div key={index} className="gallery-preview-item">
                                    <img src={item.image.startsWith('http') ? item.image : `https://travel-website-hfqu.onrender.com${item.image}`} alt={`Gallery ${index + 1}`} />
                                </div>
                            ))}
                        </div>
                    ) : <p>No gallery images uploaded.</p>}
                </div>
            </div>
        </div>
    );
};

export default ViewTour;
