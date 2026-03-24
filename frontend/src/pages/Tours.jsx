import React, { useState, useEffect } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import "../Style/style.css";
import "../Style/Tours.css"; // Modern styles
import axios from 'axios';
const Tours = () => {
  const [tours, setTours] = useState([]);
  const [pagination, setPagination] = useState({});
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate(); // Initialize useNavigate
  const [searchCriteria, setSearchCriteria] = useState({
    destination: '',
    type: '',
    month: '',
    max_price: '',
  });

  const currentPage = parseInt(searchParams.get('page')) || 1;
  const limit = 4;
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];


useEffect(() => {
  const fetchTours = async () => {
    try {
      const query = new URLSearchParams(searchParams).toString();   
      const response = await axios.get(`/api/v1/tours?${query}&page=${currentPage}&limit=${limit}`);
      const data = response.data; 

      if (data.success) {
        setTours(data.data || []);
        setPagination(data.pagination || {});
      }
    } catch (error) {
      console.error('Error fetching tours:', error);
    }
  };

  fetchTours();
}, [searchParams, currentPage]);
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSearchCriteria({ ...searchCriteria, [name]: value });
  };

  const handleSearch = (e) => {
    e.preventDefault();
    const newSearchParams = new URLSearchParams();
    for (const key in searchCriteria) {
      if (searchCriteria[key]) {
        newSearchParams.set(key, searchCriteria[key]);
      }
    }
    newSearchParams.set('page', '1'); // Reset to first page on new search
    setSearchParams(newSearchParams);
  };

  const handlePageChange = (page) => {
    const newSearchParams = new URLSearchParams(searchParams);
    newSearchParams.set('page', page.toString());
    setSearchParams(newSearchParams);
  };

  const topRatedTours = [
    {
      id: 1,
      title: "Historic Istanbul",
      image: "https://tourpress.b-cdn.net/wp-content/uploads/2017/11/istanbul-featured-150x150.jpg",
      oldPrice: "$1,200",
      price: "$990",
      rating: 5,
    },
    {
      id: 2,
      title: "Magical Maldives",
      image: "https://tourpress.b-cdn.net/wp-content/uploads/2017/11/maldives-featured-150x150.jpg",
      oldPrice: null,
      price: "$900",
      rating: 5,
    },
    {
      id: 3,
      title: "Venice The City of Water",
      image: "https://tourpress.b-cdn.net/wp-content/uploads/2017/11/venice-featured-150x150.jpg",
      oldPrice: null,
      price: "$850",
      rating: 5,
    }
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

  const Rating = ({ count }) => {
    const stars = [];
    for (let i = 0; i < 5; i++) {
      stars.push(<i key={i} className={`fa fa-star ${i < count ? 'text-warning' : 'text-muted'}`}></i>);
    }
    return <span>{stars}</span>;
  };

  const renderPagination = () => {
    if (!pagination || pagination.totalPages <= 1) return null;

    const pageNumbers = Array.from({ length: pagination.totalPages }, (_, i) => i + 1);

    return (
      <div className="modern-pagination">
        {pagination.prev && (
          <button onClick={() => handlePageChange(pagination.prev.page)} className="prev">
            Previous
          </button>
        )}

        {pageNumbers.map((number) =>
          number === currentPage ? (
            <span key={number} className="current">{number}</span>
          ) : (
            <button key={number} onClick={() => handlePageChange(number)}>{number}</button>
          )
        )}

        {pagination.next && (
          <button onClick={() => handlePageChange(pagination.next.page)} className="next">
            Next
          </button>
        )}
      </div>
    );
  };

  return (
    <>
      <div id="site-banner" style={{ backgroundImage: "url(https://tourpress.b-cdn.net/wp-content/uploads/2020/04/optimised-banner.jpg)" }}>
        <div className="banner-content">
          <h1>Tours List</h1>
          <ul id="inspiry_breadcrumbs" className="inspiry_breadcrumbs">
            <li className="breadcrumb-item"><a href="/" title="Home">Home</a></li>
            <li>&gt;</li>
            <li className="breadcrumb-item active">Tours List</li>
          </ul>
        </div>
      </div>

      <div className="modern-tours-wrapper">
        <div className="container">
          <div className="row">
            
            <div className="col-12 col-lg-8">
              {tours.length === 0 ? (
                <div className="text-center py-5">
                  <h4 className="text-muted">No tours matched your filters.</h4>
                </div>
              ) : (
                tours.map(tour => {
                  const discount = tour.oldPrice && tour.price < tour.oldPrice
                    ? Math.round(((tour.oldPrice - tour.price) / tour.oldPrice) * 100)
                    : null;

                  return (
                    <div key={tour._id} className="modern-tour-card">
                      <div className="modern-tour-img-wrapper">
                        <Link to={`/tours/${tour._id}`}>
                          <img
                            src={tour.image && tour.image.startsWith('http') ? tour.image : `https://travel-website-hfqu.onrender.com${tour.image}`}
                            className="modern-tour-img"
                            alt={tour.title}
                          />
                        </Link>
                        <div className="tour-days-badge">
                          <i className="fa fa-sun-o"></i> {tour.duration} Days
                        </div>
                      </div>

                      <div className="modern-tour-content">
                        <div className="tour-meta-grid">
                          <div className="tour-meta-item">
                            <i className="fa fa-calendar-check-o"></i>
                            <span>
                              {tour.availability?.startDate ? new Date(tour.availability.startDate).toLocaleString('default', { month: 'short' }) : 'Jan'} - {tour.availability?.endDate ? new Date(tour.availability.endDate).toLocaleString('default', { month: 'short' }) : 'Dec'}
                            </span>
                          </div>
                          <div className="tour-meta-item">
                            <i className="fa fa-map-marker"></i>
                            <span>{tour.location?.city}, {tour.location?.country}</span>
                          </div>
                        </div>

                        <Link to={`/tours/${tour._id}`} className="modern-tour-title">
                          {tour.title}
                        </Link>
                        
                        <div className="mb-3"><Rating count={tour.rating || 5} /></div>

                        <p className="modern-tour-desc" style={{
                              display: '-webkit-box',
                              WebkitLineClamp: 3,
                              WebkitBoxOrient: 'vertical',
                              overflow: 'hidden'
                        }}>
                          {tour.description}
                        </p>

                        <div className="modern-tour-footer">
                          <div className="price-section">
                            {tour.oldPrice && <span className="old-price">${tour.oldPrice}</span>}
                            <span className="current-price">${tour.price}</span>
                            {discount && <span className="discount-tag">{discount}% OFF</span>}
                          </div>
                          <Link to={`/tours/${tour._id}`} className="view-btn">View Details</Link>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}

              {/* Pagination */}
              {renderPagination()}
            </div>

            {/* Sidebar */}
            <div className="col-12 col-lg-4 sidebar">
              <div className="widget">
                <h2 className="widget-title" style={{ color: 'black' }}>Find Tours</h2>
                <form onSubmit={handleSearch}>
                  <div className="form-group position-relative">
                    <select name="destination" className="form-control" value={searchCriteria.destination} onChange={handleInputChange}>
                      <option value="">Destination (Any)</option>
                      <option value="australia">Australia</option>
                      <option value="dubai">Dubai</option>
                      <option value="brazil">Brazil</option>
                      <option value="italy">Italy</option>
                      <option value="maldives">Maldives</option>
                      <option value="singapore">Singapore</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <select name="type" className="form-control" value={searchCriteria.type} onChange={handleInputChange}>
                      <option value="">Tour Type (Any)</option>
                      <option value="wildlife">Wildlife</option>
                      <option value="air-rides">Air Rides</option>
                      <option value="adventure">Adventure</option>
                      <option value="beaches">Beaches</option>
                      <option value="cruises">Cruises</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <select name="month" className="form-control" value={searchCriteria.month} onChange={handleInputChange}>
                      <option value="">Tour Month (Any)</option>
                      {months.map(m => (
                        <option key={m} value={m.toLowerCase()}>{m}</option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group">
                    <input type="number" name="max_price" className="form-control" placeholder="Maximum Price" value={searchCriteria.max_price} onChange={handleInputChange} />
                  </div>
                  <button type="submit" className="modern-search-btn">Search Tours</button>
                </form>
              </div>

              <div className="widget">
                <h2 className="widget-title">Top Rated Tours</h2>
                <ul className="modern-sidebar-list">
                  {topRatedTours.map(tour => (
                    <li key={tour.id}>
                      <Link to={`/tours/${tour.id}`}>
                        <img src={tour.image} className="modern-sidebar-img" alt={tour.title} />
                      </Link>
                      <div className="modern-sidebar-content">
                        <h4><Link to={`/tours/${tour.id}`}>{tour.title}</Link></h4>
                        <div className="mb-1"><Rating count={tour.rating} /></div>
                        <div className="modern-sidebar-meta">
                          {tour.oldPrice && <span className="text-decoration-line-through me-2 text-muted">{tour.oldPrice}</span>}
                          <strong className="text-info">{tour.price}</strong>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="widget">
                <h2 className="widget-title">Recent Posts</h2>
                <ul className="modern-sidebar-list">
                  {recentPosts.map(post => (
                    <li key={post.id}>
                      <a href="#">
                        <img src={post.image} className="modern-sidebar-img" alt={post.title} />
                      </a>
                      <div className="modern-sidebar-content">
                        <h4><a href="#">{post.title}</a></h4>
                        <div className="modern-sidebar-meta"><i className="fa fa-calendar-check-o me-1"></i> {post.date}</div>
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

export default Tours;

