import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import '../Style/TourDetail.css';

const months = ["January","February","March","April","May","June","July","August","September","October","November","December"];

const TourDetail = () => {
  const [tour, setTour] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [activeTab, setActiveTab] = useState('details');
  const { id } = useParams();
  const [formData, setFormData] = useState({ name: '', email: '', no_person: '', phone: '', dep_date: '' });
  const [reviewFormData, setReviewFormData] = useState({ rating: 5, comment: '', author: '', email: '' });
  const [isBooking, setIsBooking] = useState(false);
  const [bookingMessage, setBookingMessage] = useState('');
  const [isReviewing, setIsReviewing] = useState(false);
  const [reviewMessage, setReviewMessage] = useState('');

 useEffect(() => {
  const fetchTourData = async () => {
    try {

      const [tourRes, reviewsRes] = await Promise.all([
        axios.get(`/api/v1/tours/${id}`),
        axios.get(`/api/v1/reviews/tour/${id}`),
      ]);

      
      if (tourRes.data.success) setTour(tourRes.data.data);
      if (reviewsRes.data.success) setReviews(reviewsRes.data.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };
  fetchTourData();
}, [id]);

  const handleInputChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
  const handleReviewInputChange = (e) => setReviewFormData({ ...reviewFormData, [e.target.name]: e.target.value });

  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    setIsBooking(true);
    setBookingMessage('');
    if (!formData.name || !formData.email || !formData.no_person || !formData.phone || !formData.dep_date) {
      setBookingMessage('error:Please fill in all required fields.');
      setIsBooking(false); return;
    }
    const persons = parseInt(formData.no_person, 10);
    if (isNaN(persons) || persons <= 0) {
      setBookingMessage('error:Number of persons must be a positive number.');
      setIsBooking(false); return;
    }
    const totalAmount = tour.price * persons;
    const nameParts = formData.name.trim().split(' ');
    const bookingData = {
      cartItems: [{ id: tour._id, quantity: persons, priceAtPurchase: tour.price }],
      customerDetails: {
        firstName: nameParts[0] || formData.name,
        lastName: nameParts.slice(1).join(' ') || '',
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
      },
      shippingAddress: { address: formData.dep_date, city: tour.location?.city || 'N/A', zip: 'N/A', country: tour.location?.country || 'N/A' },
      billingAddress:  { address: formData.dep_date, city: tour.location?.city || 'N/A', zip: 'N/A', country: tour.location?.country || 'N/A' },
      totalAmount,
      deliveryFee: 0,
    };
    try {
      const response = await axios.post('/api/v1/bookings', bookingData, {
        headers: { 'Content-Type': 'application/json' }
      });
      if (response.data.success) {
        setBookingMessage('success:Booking successful! We will contact you shortly.');
        setFormData({ name: '', email: '', no_person: '', phone: '', dep_date: '' });
      } else {
        setBookingMessage('error:Booking failed. Please try again.');
      }
    } catch (error) {
      console.error('Booking error:', error);
      setBookingMessage('error:' + (error.response?.data?.error || 'An error occurred. Please try again later.'));
    } finally {
      setIsBooking(false);
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    setIsReviewing(true);
    setReviewMessage('');
    if (!reviewFormData.comment || !reviewFormData.author || !reviewFormData.email) {
      setReviewMessage('error:Please fill in all required fields.');
      setIsReviewing(false); return;
    }
    try {
      const token = localStorage.getItem('token');
      if (!token) { setReviewMessage('error:You must be logged in to post a review.'); setIsReviewing(false); return; }
      const response = await axios.post('/api/v1/reviews', { tourId: id, rating: parseInt(reviewFormData.rating, 10), comment: reviewFormData.comment }, { headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` } });
      if (response.data.success) {
        setReviewMessage('success:Review posted successfully!');
        setReviewFormData({ rating: 5, comment: '', author: '', email: '' });
        const reviewsRes = await fetch(`/api/v1/reviews/tour/${id}`).then(res => res.json());
        if (reviewsRes.success) setReviews(reviewsRes.data);
      }
    } catch (error) {
      setReviewMessage('error:' + (error.response?.data?.error || 'An error occurred while posting your review.'));
    } finally {
      setIsReviewing(false);
    }
  };

  if (!tour) {
    return (
      <div className="td-loading-screen">
        <div className="td-spinner"></div>
        <p>Loading tour details...</p>
      </div>
    );
  }
const BACKEND_URL = "https://travel-website-hfqu.onrender.com";
  const bannerUrl = tour.banner && tour.banner.startsWith('http') ? tour.banner : `${BACKEND_URL}${tour.banner}`;
  const [bookMsgType, bookMsgText] = bookingMessage.includes(':') ? bookingMessage.split(':') : ['', bookingMessage];
  const [revMsgType, revMsgText] = reviewMessage.includes(':') ? reviewMessage.split(':') : ['', reviewMessage];

  const renderContent = () => {
    switch (activeTab) {
      case 'details':
        return (
          <div className="td-tab-content">
            <h3>Tour Overview</h3>
            <p>{tour.description}</p>
            {tour.services?.included?.length > 0 && (
              <>
                <h4 style={{ color: '#1a2b49', fontWeight: 700, marginTop: 24, marginBottom: 12 }}>Included</h4>
                <ul style={{ paddingLeft: 20, color: '#475569', lineHeight: 2 }}>
                  {tour.services.included.map((s, i) => <li key={i}><i className="fa fa-check text-success me-2"></i>{s}</li>)}
                </ul>
              </>
            )}
            {tour.services?.excluded?.length > 0 && (
              <>
                <h4 style={{ color: '#1a2b49', fontWeight: 700, marginTop: 20, marginBottom: 12 }}>Excluded</h4>
                <ul style={{ paddingLeft: 20, color: '#475569', lineHeight: 2 }}>
                  {tour.services.excluded.map((s, i) => <li key={i}><i className="fa fa-times text-danger me-2"></i>{s}</li>)}
                </ul>
              </>
            )}

            {/* Reviews */}
            <div className="td-reviews-section">
              <h3>Reviews ({reviews.length})</h3>
              {reviews.length > 0 ? reviews.map((rev, i) => (
                <div key={i} className="td-review-card">
                  <div className="td-review-avatar">{(rev.author || 'A')[0].toUpperCase()}</div>
                  <div>
                    <div className="td-review-author">{rev.author || 'Anonymous'}</div>
                    <div className="td-review-stars">
                      {[...Array(5)].map((_, si) => (
                        <i key={si} className={`fa fa-star${si < rev.rating ? '' : '-o'}`}></i>
                      ))}
                    </div>
                    <p className="td-review-text">{rev.comment}</p>
                  </div>
                </div>
              )) : (
                <p className="td-no-reviews"><i className="fa fa-comment-o me-2"></i>No reviews yet. Be the first to review!</p>
              )}

              {/* Leave a Review Form */}
              <div className="td-review-form-wrap">
                <h4 className="td-review-form-title">Leave a Review</h4>
                {reviewMessage && (
                  <div className={`td-form-alert ${revMsgType}`}>{revMsgText}</div>
                )}
                <form onSubmit={handleReviewSubmit}>
                  <div className="td-form-row">
                    <div className="td-form-group">
                      <label className="td-form-label">Your Name *</label>
                      <input type="text" name="author" className="td-form-input" placeholder="John Doe" value={reviewFormData.author} onChange={handleReviewInputChange} required />
                    </div>
                    <div className="td-form-group">
                      <label className="td-form-label">Your Email *</label>
                      <input type="email" name="email" className="td-form-input" placeholder="john@example.com" value={reviewFormData.email} onChange={handleReviewInputChange} required />
                    </div>
                  </div>
                  <div className="td-form-group">
                    <label className="td-form-label">Rating</label>
                    <select name="rating" className="td-form-select" value={reviewFormData.rating} onChange={handleReviewInputChange}>
                      {[5,4,3,2,1].map(r => <option key={r} value={r}>{'★'.repeat(r)}{'☆'.repeat(5-r)} ({r}/5)</option>)}
                    </select>
                  </div>
                  <div className="td-form-group">
                    <label className="td-form-label">Your Review *</label>
                    <textarea name="comment" className="td-form-textarea" placeholder="Share your experience..." value={reviewFormData.comment} onChange={handleReviewInputChange} required></textarea>
                  </div>
                  <button type="submit" className="td-submit-btn" disabled={isReviewing}>
                    {isReviewing ? <><i className="fa fa-spinner fa-spin me-2"></i>Posting...</> : 'Post Review'}
                  </button>
                </form>
              </div>
            </div>
          </div>
        );
      case 'itinerary':
        return (
          <div className="td-tab-content">
            <h3>Tour Itinerary</h3>
            {tour.itinerary && tour.itinerary.length > 0 ? (
              tour.itinerary.map((item, index) => (
                <div key={index} className="td-itinerary-day">
                  <div className="td-day-badge">
                    DAY<span>{item.day}</span>
                  </div>
                  <div className="td-day-body">
                    <h4>Day {item.day}</h4>
                    <p>{item.description}</p>
                  </div>
                </div>
              ))
            ) : (
              <p style={{ color: '#94a3b8' }}>Itinerary details are not available yet.</p>
            )}
          </div>
        );
      case 'location':
        return (
          <div className="td-tab-content">
            <h3>Tour Location</h3>
            {tour.location ? (
              <>
                <p><i className="fa fa-map-marker me-2 text-info"></i><strong>{tour.location.address}, {tour.location.city}, {tour.location.country}</strong></p>
                <div className="td-map-wrap">
                  <iframe
                    title="Tour Location"
                    src={`https://www.google.com/maps?q=${tour.location.latitude},${tour.location.longitude}&hl=en&z=14&output=embed`}
                    allowFullScreen
                  ></iframe>
                </div>
              </>
            ) : (
              <p style={{ color: '#94a3b8' }}>Location details are not available yet.</p>
            )}
          </div>
        );
      case 'gallery':
        return (
          <div className="td-tab-content">
            <h3>Photo Gallery</h3>
            {tour.gallery && tour.gallery.length > 0 ? (
              <div className="td-gallery-grid">
                {tour.gallery.map((item, index) => (
                  <img
                    key={index}
                    src={item.image && item.image.startsWith('http') ? item.image : `${BACKEND_URL}${item.image}`}
                    alt={item.altText || `Gallery image ${index + 1}`}
                    className="td-gallery-img"
                  />
                ))}
              </div>
            ) : (
              <p style={{ color: '#94a3b8' }}>Gallery is not available yet.</p>
            )}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div>
      {/* Hero Banner */}
      <div id="site-banner" style={{
        backgroundImage: `url(${bannerUrl})`,
        height: '500px',
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }}>
        <div className="banner-content">
          <h1>{tour.title}</h1>
          <ul id="inspiry_breadcrumbs" className="inspiry_breadcrumbs">
            <li className="breadcrumb-item"><a href="/" title="Home">Home</a></li>
            <li className="breadcrumb-sep">&gt;</li>
            <li className="breadcrumb-item"><a href="/tours" title="Tours">Tours</a></li>
            <li className="breadcrumb-sep">&gt;</li>
            <li className="breadcrumb-item active"><span>{tour.title}</span></li>
          </ul>
        </div>
      </div>

      {/* Meta Bar */}
      <div className="td-meta-bar">
        <div className="container">
          <div className="td-meta-inner">
            <div className="td-rating-block">
              <div className="stars">
                {[...Array(5)].map((_, i) => <i key={i} className="fa fa-star"></i>)}
              </div>
              <a href="#reviews">(2 Reviews)</a>
            </div>
            <div className="td-price-block">
              <i className="fa fa-tag"></i>
              <span>${tour.price} / Person</span>
            </div>
          </div>

          <ul className="td-meta-list">
            <li>
              <svg enableBackground="new 0 0 30 30" version="1.1" viewBox="0 0 30 30" xmlns="http://www.w3.org/2000/svg">
                <polyline className="st0" points="5.9 3.4 1 3.4 1 29 29 29 29 3.4 24.1 3.4" fill="none" stroke="#3ec1d5" strokeWidth="2" />
                <rect className="st0" x="5.9" y="1" width="3.7" height="4.9" fill="none" stroke="#3ec1d5" strokeWidth="2" />
                <rect className="st0" x="20.5" y="1" width="3.7" height="4.9" fill="none" stroke="#3ec1d5" strokeWidth="2" />
                <line className="st0" x1="9.5" x2="20.5" y1="3.4" y2="3.4" fill="none" stroke="#3ec1d5" strokeWidth="2" />
                <line className="st0" x1="1" x2="29" y1="9.5" y2="9.5" fill="none" stroke="#3ec1d5" strokeWidth="2" />
              </svg>
              {tour.availability?.startDate ? new Date(tour.availability.startDate).toLocaleString('default', { month: 'short' }) : 'Jan'} — {tour.availability?.endDate ? new Date(tour.availability.endDate).toLocaleString('default', { month: 'short' }) : 'Dec'}
            </li>
            <li>
              <svg enableBackground="new 0 0 30 30" version="1.1" viewBox="0 0 30 30" xmlns="http://www.w3.org/2000/svg">
                <circle cx="15" cy="15" r="14" fill="none" stroke="#3ec1d5" strokeWidth="2" />
                <polyline points="14.4 8.3 14.4 15 21.7 21.7" fill="none" stroke="#3ec1d5" strokeWidth="2" />
              </svg>
              {tour.duration} Days
            </li>
            <li>
              <svg enableBackground="new 0 0 30 30" version="1.1" viewBox="0 0 30 30" xmlns="http://www.w3.org/2000/svg">
                <path d="M26.6,12H8.3L5.9,9.5H1l3.7,7.3h9.7l-7.3,7.3h6.1l7.3-7.3h6.1c1.3,0,2.4-1.1,2.4-2.4C29,13,27.9,12,26.6,12z" fill="none" stroke="#3ec1d5" strokeWidth="2" />
              </svg>
              {tour.location?.city}
            </li>
            <li>
              <svg enableBackground="new 0 0 30 30" version="1.1" viewBox="0 0 30 30" xmlns="http://www.w3.org/2000/svg">
                <path d="m24.1 10.1c0 5-9.1 18.9-9.1 18.9s-9.1-13.8-9.1-18.9c0-5 4.1-9.1 9.1-9.1s9.1 4.1 9.1 9.1z" fill="none" stroke="#3ec1d5" strokeWidth="2" />
                <circle cx="15" cy="10.1" r="3.7" fill="none" stroke="#3ec1d5" strokeWidth="2" />
              </svg>
              {tour.location?.country}
            </li>
            <li>
              <i className="fa fa-users" style={{ color: '#3ec1d5', fontSize: 18 }}></i>
              {tour.availability?.maxGroupSize} Members
            </li>
            <li>
              <i className="fa fa-user" style={{ color: '#3ec1d5', fontSize: 18 }}></i>
              18+ Age
            </li>
          </ul>
        </div>
      </div>

      {/* Main Content */}
      <div className="td-page-wrapper">
        <div className="container">
          <div className="row g-4">

            {/* Main Column */}
            <div className="col-12 col-lg-8">
              {/* Tab Navigation */}
              <div className="td-tabs">
                {['details', 'itinerary', 'location', 'gallery'].map(tab => (
                  <button
                    key={tab}
                    className={`td-tab-btn ${activeTab === tab ? 'active' : ''}`}
                    onClick={() => setActiveTab(tab)}
                  >
                    {tab.charAt(0).toUpperCase() + tab.slice(1)}
                  </button>
                ))}
              </div>

              {/* Tab Content */}
              {renderContent()}
            </div>

            {/* Sidebar */}
            <div className="col-12 col-lg-4">
              <div className="td-booking-card">
                <div className="td-booking-header">
                  <h3>Book This Tour</h3>
                  <div className="td-booking-price">
                    ${tour.price} <span>/ Person</span>
                  </div>
                </div>
                <div className="td-booking-body">
                  <form onSubmit={handleBookingSubmit}>
                    <input
                      type="text"
                      name="name"
                      className="td-booking-input"
                      placeholder="Full Name *"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                    />
                    <input
                      type="email"
                      name="email"
                      className="td-booking-input"
                      placeholder="Email Address *"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                    />
                    <div className="td-booking-row">
                      <input
                        type="number"
                        name="no_person"
                        className="td-booking-input"
                        placeholder="Persons *"
                        value={formData.no_person}
                        onChange={handleInputChange}
                        min="1"
                        required
                      />
                      <input
                        type="tel"
                        name="phone"
                        className="td-booking-input"
                        placeholder="Phone *"
                        value={formData.phone}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <select
                      name="dep_date"
                      className="td-booking-input"
                      value={formData.dep_date}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="">Departure Month *</option>
                      {months.map((month, index) => (
                        <option key={index} value={month.toLowerCase()}>{month}</option>
                      ))}
                    </select>

                    {formData.no_person && (
                      <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: 8, padding: '10px 14px', marginBottom: 14, fontSize: 14, color: '#16a34a', fontWeight: 700 }}>
                        Total: ${(tour.price * parseInt(formData.no_person || 0, 10)).toFixed(2)}
                      </div>
                    )}

                    <button type="submit" className="td-book-btn" disabled={isBooking}>
                      {isBooking ? <><i className="fa fa-spinner fa-spin me-2"></i>Booking...</> : <><i className="fa fa-shopping-cart me-2"></i>Book Now</>}
                    </button>

                    {bookingMessage && (
                      <div className={`td-booking-msg ${bookMsgType}`} style={{
                        marginTop: '15px',
                        padding: '12px',
                        borderRadius: '8px',
                        fontSize: '14px',
                        fontWeight: '700',
                        textAlign: 'center',
                        border: '1px solid',
                        backgroundColor: bookMsgType === 'success' ? '#f0fdf4' : '#fef2f2',
                        color: bookMsgType === 'success' ? '#16a34a' : '#ef4444',
                        borderColor: bookMsgType === 'success' ? '#bbf7d0' : '#fee2e2'
                      }}>
                        <i className={`fa ${bookMsgType === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'} me-2`}></i>
                        {bookMsgText}
                      </div>
                    )}
                  </form>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default TourDetail;
