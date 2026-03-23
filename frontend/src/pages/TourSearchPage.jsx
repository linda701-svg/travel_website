import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import '../Style/style.css';

const TourSearchPage = () => {
  const [tours, setTours] = useState([]);
  const [pagination, setPagination] = useState({});
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchCriteria, setSearchCriteria] = useState({
    destination: searchParams.get('destination') || '',
    type: searchParams.get('type') || '',
    month: searchParams.get('month') || '',
    max_price: searchParams.get('max_price') || '',
  });

  const currentPage = parseInt(searchParams.get('page')) || 1;
  const limit = 6; // To show 2 rows of 3

  useEffect(() => {
    const fetchTours = async () => {
      try {
        const query = new URLSearchParams(searchParams).toString();
        const response = await fetch(`http://localhost:5000/api/v1/tours?${query}&page=${currentPage}&limit=${limit}`);
        const data = await response.json();
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
    newSearchParams.set('page', '1');
    setSearchParams(newSearchParams);
  };

  const handlePageChange = (page) => {
    const newSearchParams = new URLSearchParams(searchParams);
    newSearchParams.set('page', page.toString());
    setSearchParams(newSearchParams);
  };

  const Rating = ({ count }) => {
    const stars = [];
    for (let i = 0; i < 5; i++) {
      stars.push(<i key={i} className={`fa fa-star-o ${i < count ? 'rated' : ''}`}></i>);
    }
    return <span className="rating">{stars}</span>;
  };

  const renderPagination = () => {
    if (!pagination || pagination.totalPages <= 1) return null;
    const pageNumbers = Array.from({ length: pagination.totalPages }, (_, i) => i + 1);
    return (
      <div className="pagination">
        <div className="nav-links">
          {pagination.prev && (
            <button onClick={() => handlePageChange(pagination.prev.page)} className="prev page-numbers">
              Previous
            </button>
          )}
          {pageNumbers.map((number) =>
            number === currentPage ? (
              <span key={number} className="page-numbers current">{number}</span>
            ) : (
              <button key={number} onClick={() => handlePageChange(number)} className="page-numbers">{number}</button>
            )
          )}
          {pagination.next && (
            <button onClick={() => handlePageChange(pagination.next.page)} className="next page-numbers">
              Next
            </button>
          )}
        </div>
      </div>
    );
  };

  return (
    <>
      <div id="site-banner" style={{ backgroundImage: "url(https://tourpress.b-cdn.net/wp-content/uploads/2020/04/optimised-banner.jpg)" }}>
        <div className="banner-content">
          <h1>Tour Search Page</h1>
          <ul id="inspiry_breadcrumbs" className="inspiry_breadcrumbs">
            <li className="breadcrumb-item"><a href="/" title="Home">Home</a></li>
            <li>&gt;</li>
            <li className="breadcrumb-item active item-current item-258"><span className="bread-current bread-258"> Tour Search Page</span></li>
          </ul>
        </div>
      </div>

      <div id="search-form-wrapper" className="search-form-trapezoid" style={{ backgroundColor: '#f5f5f5', padding: '40px 0' }}>
        <div className="search-form" style={{ maxWidth: '1170px', margin: '0 auto' }}>
          <form id="tours-search" className="clearfix" onSubmit={handleSearch}>
            <div className="form-field tour-destination">
              <select name="destination" id="tour-destination" value={searchCriteria.destination} onChange={handleInputChange}>
                <option value="">Destination (Any)</option>
                <option value="australia">Australia</option>
                <option value="dubai">Dubai</option>
                <option value="brazil">Brazil</option>
                <option value="italy">Italy</option>
                <option value="maldives">Maldives</option>
              </select>
            </div>
            <div className="form-field tour-type">
              <select name="type" id="tour-type" value={searchCriteria.type} onChange={handleInputChange}>
                <option value="">Tour Type (Any)</option>
                <option value="wildlife">Wildlife</option>
                <option value="air-rides">Air Rides</option>
              </select>
            </div>
            <div className="form-field tour-month">
              <select name="month" id="tour-month" value={searchCriteria.month} onChange={handleInputChange}>
                <option value="">Tour Month (Any)</option>
                <option value="january">January</option>
                <option value="february">February</option>
                <option value="march">March</option>
                <option value="april">April</option>
                <option value="may">May</option>
                <option value="june">June</option>
                <option value="july">July</option>
                <option value="august">August</option>
                <option value="september">September</option>
                <option value="october">October</option>
                <option value="november">November</option>
                <option value="december">December</option>
              </select>
            </div>
            <div className="form-field max-price">
              <input type="text" name="max_price" value={searchCriteria.max_price} onChange={handleInputChange} placeholder="Maximum Price" />
            </div>
            <input type="submit" value="Search" />
          </form>
        </div>
      </div>

      <div id="content-wrapper" className="site-page tour-search">
        <div className="container">
          <div className="row">
            <div className="col-sm-12 col-main-content tours-grid-container">
              <div className="tours-listing">
                <div className="row">
                  <h4 className="col-md-12 found-tours">{pagination.totalTours || 0} Tours Found!</h4>
                  {tours.length > 0 ? (
                    tours.map(tour => (
                      <div className="col-sm-6 col-md-4" key={tour._id}>
                        <div className="tour-post clearfix">
                          <figure>
                            <Link to={`/tours/${tour._id}`}>
                              <img width="720" height="560" src={tour.image} className="attachment-inspiry_image_size_720_560 size-inspiry_image_size_720_560 wp-post-image" alt="" />
                            </Link>
                            <div className="sunlight">
                              <i className="fa fa-sun-o" aria-hidden="true"></i>
                              <span className="tour-days">{tour.duration}<i>days</i></span>
                            </div>
                          </figure>
                          <div className="offer-content">
                            <h3><Link to={`/tours/${tour._id}`}>{tour.title}</Link></h3>
                            <Rating count={tour.rating} />
                            <p>{tour.description.substring(0, 100)}...</p>
                            <span className="tour-price">${tour.price}</span>
                            <Link to={`/tours/${tour._id}`} className="read-more">View More</Link>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p>No tours found matching your criteria.</p>
                  )}
                </div>
                {renderPagination()}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default TourSearchPage;
