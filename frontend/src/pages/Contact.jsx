import React, { useState } from 'react';
import axios from 'axios';
import '../Style/style.css';
import '../Style/Contact.css';

const Contact = () => {
  const [formData, setFormData] = useState({
    fname: '',
    lname: '',
    phone: '',
    email: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [responseMessage, setResponseMessage] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setResponseMessage('');

    try {
      const response = await axios.post('http://localhost:5000/api/v1/contact', formData);
      if (response.data.success) {
        setResponseMessage('Thank you for your message! We will get back to you soon.');
        setFormData({
          fname: '',
          lname: '',
          phone: '',
          email: '',
          message: '',
        });
      } else {
        setResponseMessage('Failed to send message. Please try again.');
      }
    } catch (error) {
      console.error('Contact form submission error:', error);
      setResponseMessage('An error occurred. Please try again later.');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const socialLinks = [
    { name: "facebook", icon: "fa-facebook", url: "https://facebook.com" },
    { name: "twitter", icon: "fa-twitter", url: "https://twitter.com" },
    { name: "instagram", icon: "fa-instagram", url: "https://instagram.com" },
    { name: "pinterest", icon: "fa-pinterest-p", url: "https://pinterest.com" },
  ];

  const headOffice = {
    city: "Dubai",
    address: "ACICO Business Park Port Saeed Deira Dubai",
    phone: "222 333 4444",
    email: "dubai@example.com",
    openingHours: {
      weekdays: "Monday to Friday",
      weekdaysTime: "9.00 am to 5.00 pm",
      weekends: "Saturday & Sunday",
      weekendsTime: "Closed",
    },
  };

  const branchOffices = [
    {
      city: "Singapore",
      address: "Magazine Road Central Mall Office Tower Singapore",
      phone: "444 555 6666",
      email: "singapore@example.com",
    },
    {
      city: "London",
      address: "111 Harrow Road, Wembley, UK",
      phone: "555 666 7777",
      email: "london@example.com",
    },
  ];

  const sidebarTourDestinations = [
    { value: "australia", label: "Australia" },
    { value: "brazil", label: "Brazil" },
    { value: "italy", label: "Italy" },
    { value: "maldives", label: "Maldives" },
    { value: "singapore", label: "Singapore" },
    { value: "united-arab-emirates", label: "United Arab Emirates" },
    { value: "united-kingdom", label: "United Kingdom" },
    { value: "turkey", label: "Turkey" },
  ];

  const sidebarTourTypes = [
    { value: "wildlife", label: "Wildlife" },
    { value: "air-rides", label: "Air Rides" },
    { value: "tracking", label: "Tracking" },
    { value: "adventure", label: "Adventure" },
    { value: "beaches", label: "Beaches" },
    { value: "cruises", label: "Cruises" },
  ];

  const sidebarTourMonths = [
    { value: "january", label: "January" },
    { value: "february", label: "February" },
    { value: "march", label: "March" },
    { value: "april", label: "April" },
    { value: "may", label: "May" },
    { value: "june", label: "June" },
    { value: "july", label: "July" },
    { value: "august", label: "August" },
    { value: "september", label: "September" },
    { value: "october", label: "October" },
    { value: "november", label: "November" },
    { value: "december", label: "December" },
  ];

  const recentPosts = [
    {
      id: 1,
      title: "Try Living A Simple Life",
      date: "December 11, 2017",
      image: "https://tourpress.b-cdn.net/wp-content/uploads/2017/10/patrick-hendry-150x150.jpg"
    },
    {
      id: 2,
      title: "Start Writing A Journal",
      date: "December 10, 2017",
      image: "https://tourpress.b-cdn.net/wp-content/uploads/2017/10/cathryn-lavery-67851-150x150.jpg"
    },
    {
      id: 3,
      title: "Make Running A Part of Life",
      date: "December 9, 2017",
      image: "https://tourpress.b-cdn.net/wp-content/uploads/2017/10/jenny-hill-150x150.jpg"
    }
  ];

  return (
    <>
      <div id="site-banner" style={{ backgroundImage: "url(https://tourpress.b-cdn.net/wp-content/uploads/2020/04/optimised-banner.jpg)" }}>
        <div className="banner-content">
          <h1>Contact Us</h1>
          <ul id="inspiry_breadcrumbs" className="inspiry_breadcrumbs">
            <li className="breadcrumb-item"><a href="/" title="Home">Home</a></li>
            <li>&gt;</li>
            <li className="breadcrumb-item active item-current item-46"><span className="bread-current bread-46"> Contact</span></li>
          </ul>
        </div>
      </div>

      <div className="modern-contact-wrapper">
        <style>
          {`
            .modern-contact-wrapper .form-control {
              font-size: 16px !important;
              height: auto !important;
              min-height: 52px !important;
              line-height: normal !important;
              padding: 14px 20px !important;
              background-color: #ffffff !important;
              color: #2d3748 !important;
              border: 1px solid #e2e8f0 !important;
              border-radius: 8px !important;
            }
            .modern-contact-wrapper .form-control::placeholder {
              font-size: 16px !important;
              color: #9cb3c9 !important;
              opacity: 1 !important;
            }
            .modern-contact-wrapper select.form-control {
              background-position: calc(100% - 15px) center !important;
              background-color: #ffffff !important;
            }
          `}
        </style>
        <div className="container">
          <div className="row">
            <div className="col-12 col-lg-8">
              
              <div className="contact-card">
                <h3>Drop Us a Message</h3>
                <p className="text-muted mb-4">You are so important to us, simply complete the enquiry form &amp; we will respond as soon as we can.</p>
                
                <form onSubmit={handleSubmit}>
                  <div className="row">
                    <div className="col-md-6 form-group">
                      <input type="text" name="fname" placeholder="First Name" required className="form-control" value={formData.fname} onChange={handleInputChange} />
                    </div>
                    <div className="col-md-6 form-group">
                      <input type="text" name="lname" placeholder="Last Name" required className="form-control" value={formData.lname} onChange={handleInputChange} />
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-md-6 form-group">
                      <input type="tel" name="phone" placeholder="Mobile" required className="form-control" value={formData.phone} onChange={handleInputChange} />
                    </div>
                    <div className="col-md-6 form-group">
                      <input type="email" name="email" placeholder="Email Address" required className="form-control" value={formData.email} onChange={handleInputChange} />
                    </div>
                  </div>
                  <div className="form-group">
                    <textarea name="message" placeholder="How can we help you?" required className="form-control" value={formData.message} onChange={handleInputChange}></textarea>
                  </div>
                  
                  {responseMessage && (
                    <div className={`alert ${responseMessage.includes('Thank you') ? 'alert-success' : 'alert-danger'} mt-3 mb-4`}>
                      {responseMessage}
                    </div>
                  )}

                  <button type="submit" className="modern-btn" disabled={isSubmitting}>
                    {isSubmitting ? 'Sending...' : 'Send Message'}
                  </button>
                </form>
              </div>

              <div className="contact-card">
                <h3>Our Offices</h3>
                
                <div className="row">
                  <div className="col-md-6">
                    <div className="office-item">
                      <h4>{headOffice.city} (Head Office)</h4>
                      <div className="office-detail">
                        <i className="fa fa-map-marker"></i>
                        <span>{headOffice.address}</span>
                      </div>
                      <div className="office-detail">
                        <i className="fa fa-phone"></i>
                        <span>{headOffice.phone}</span>
                      </div>
                      <div className="office-detail">
                        <i className="fa fa-envelope"></i>
                        <a href={`mailto:${headOffice.email}`}>{headOffice.email}</a>
                      </div>
                      <div className="mt-3 text-muted" style={{ fontSize: '16px', lineHeight: '1.6' }}>
                        <strong style={{ fontSize: '18px' }}>Hours:</strong><br />
                        {headOffice.openingHours.weekdays}: {headOffice.openingHours.weekdaysTime}<br />
                        {headOffice.openingHours.weekends}: {headOffice.openingHours.weekendsTime}
                      </div>
                    </div>
                  </div>
                  
                  {branchOffices.map(office => (
                    <div className="col-md-6" key={office.city}>
                      <div className="office-item">
                        <h4>{office.city}</h4>
                        <div className="office-detail">
                          <i className="fa fa-map-marker"></i>
                          <span>{office.address}</span>
                        </div>
                        <div className="office-detail">
                          <i className="fa fa-phone"></i>
                          <span>{office.phone}</span>
                        </div>
                        <div className="office-detail">
                          <i className="fa fa-envelope"></i>
                          <a href={`mailto:${office.email}`}>{office.email}</a>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="contact-card">
                <h3>Stay Connected</h3>
                <div className="social-grid">
                  {socialLinks.map(link => (
                    <a key={link.name} href={link.url} target="_blank" rel="noopener noreferrer" className="social-circle">
                      <i className={`fa ${link.icon}`}></i>
                    </a>
                  ))}
                </div>
              </div>

              <div className="map-container mb-5">
                <iframe
                  title="Google Map"
                  width="100%"
                  height="400"
                  frameBorder="0"
                  style={{ border: 0, display: "block" }}
                  loading="lazy"
                  allowFullScreen
                  src="https://www.google.com/maps?q=ACICO+Business+Park+Port+Saeed+Deira+Dubai&output=embed"
                ></iframe>
              </div>

            </div>

            <div className="col-12 col-lg-4 modern-sidebar">
              
              <div className="widget">
                <h2 className="widget-title">Find Tours</h2>
                <form id="tours-search">
                  <div className="form-group">
                    <select className="form-control">
                      <option value="">Destination (Any)</option>
                      {sidebarTourDestinations.map(dest => (
                        <option key={dest.value} value={dest.value}>{dest.label}</option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group">
                    <select className="form-control">
                      <option value="">Tour Type (Any)</option>
                      {sidebarTourTypes.map(type => (
                        <option key={type.value} value={type.value}>{type.label}</option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group">
                    <select className="form-control">
                      <option value="">Tour Month (Any)</option>
                      {sidebarTourMonths.map(month => (
                        <option key={month.value} value={month.value}>{month.label}</option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group">
                    <input type="text" className="form-control" placeholder="Maximum Price" />
                  </div>
                  <button type="submit" className="modern-btn" style={{ padding: '12px' }}>Search Tours</button>
                </form>
              </div>

              <div className="widget">
                <h2 className="widget-title">Recent Posts</h2>
                <ul className="list-unstyled mb-0">
                  {recentPosts.map(post => (
                    <li key={post.id} className="d-flex align-items-center mb-4">
                      <img 
                        src={post.image} 
                        alt={post.title} 
                        style={{ width: '70px', height: '70px', objectFit: 'cover', borderRadius: '8px', marginRight: '15px' }} 
                      />
                      <div>
                        <h4 style={{ fontSize: '15px', fontWeight: 'bold', margin: '0 0 5px 0' }}>
                          <a href="#" style={{ color: '#1a2b49', textDecoration: 'none' }}>{post.title}</a>
                        </h4>
                        <small className="text-muted"><i className="fa fa-calendar-check-o me-1"></i> {post.date}</small>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>

            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Contact;
