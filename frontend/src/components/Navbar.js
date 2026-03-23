import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import "../Style/style.css";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  
  const isCartPage = location.pathname === '/Cart';

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const handleCartClick = (e) => {
    if (isCartPage) {
      e.preventDefault();
      navigate('/'); // "Close" the cart page by navigating home
    }
  };

  return (
    <div className="header" role="banner">
      <div className="top-bar">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-md-6 d-none d-md-block">
              <p className="welcome-note mb-0">Selling Travel and Tours in an Easy Way!</p>
            </div>
            <div className="col-md-6">
              <div className="top-bar-right d-flex justify-content-end align-items-center">
                <ul className="social-links-top mb-0 me-3">
                  <li><a target="_blank" href="https://twitter.com/inspirythemes"><i className="fa fa-twitter"></i></a></li>
                  <li><a target="_blank" href="https://www.facebook.com/InspiryThemes/"><i className="fa fa-facebook-official"></i></a></li>
                  <li><a target="_blank" href="https://www.youtube.com/envato"><i className="fa fa-youtube-play"></i></a></li>
                  <li><a target="_blank" href="https://www.instagram.com/envato/"><i className="fa fa-instagram"></i></a></li>
                </ul>
                <div className="header-email-wrap d-none d-lg-block">
                  <a href="mailto:info@example.com" className="header-email-top"><i className="fa fa-envelope-o" aria-hidden="true"></i> info@example.com</a>
                </div>
                <div className="mini-cart-icon ms-3">
                   <Link to="/Cart" className={`cart-toggle-btn ${isCartPage ? 'active' : ''}`} onClick={handleCartClick}>
                    <i className="fa fa-shopping-cart"></i>
                   </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <header className="main-header-content">
        <div className="container">
          <div className="row align-items-center position-relative">
            {/* Logo */}
            <div className="col-lg-3 col-6">
              <div className="logo-wrap">
                <Link to="/" className="site-logo" title="TourPress">
                  <img alt="TourPress" src="https://tourpress.b-cdn.net/wp-content/uploads/2020/04/logo.png" className="img-fluid" />
                </Link>
              </div>
            </div>

            {/* Toggle Button for Mobile */}
            <div className="col-6 d-lg-none text-end">
               <button className={`navbar-mobile-toggle ${isMenuOpen ? 'active' : ''}`} type="button" onClick={toggleMenu}>
                <span className="bar-icon"></span>
                <span className="bar-icon"></span>
                <span className="bar-icon"></span>
              </button>
            </div>

            {/* Center Menu */}
            <div className="col-lg-6 d-none d-lg-block">
              <nav className="main-menu-navigation">
                <ul className="main-menu-list d-flex justify-content-center align-items-center list-unstyled mb-0">
                  <li className={`menu-item ${location.pathname === '/' ? 'current' : ''}`}><Link to="/">Home</Link></li>
                  <li className={`menu-item has-sub ${location.pathname === '/tours' ? 'current' : ''}`}><Link to="/tours">Tours <i className="fa fa-chevron-down small"></i></Link>
                    <ul className="sub-menu">
                      <li><Link to="/tours">Tours List</Link></li>
                      <li><Link to="/gallery">Tours Gallery</Link></li>
                    </ul>
                  </li>
                  <li className={`menu-item ${location.pathname === '/News' ? 'current' : ''}`}><Link to="/News">News</Link></li>
                  <li className={`menu-item has-sub ${location.pathname === '/Account' ? 'current' : ''}`}><Link to="/Account">My account <i className="fa fa-chevron-down small"></i></Link>
                    <ul className="sub-menu">
                      <li><Link to="/shop">Shop</Link></li>
                      <li><Link to="/Cart">Cart</Link></li>
                      <li><Link to="/Checkout">Checkout</Link></li>
                    </ul>
                  </li>
                  <li className={`menu-item ${location.pathname === '/FAQs' ? 'current' : ''}`}><Link to="/FAQs">FAQs</Link></li>
                  <li className={`menu-item ${location.pathname === '/contact' ? 'current' : ''}`}><Link to="/contact">Contact</Link></li>
                </ul>
              </nav>
            </div>

            {/* Contact Info / Phone */}
            <div className="col-lg-3 d-none d-lg-block text-end">
              <div className="header-phone-box">
                <a href="tel:8902345678" className="phone-link">
                   <i className="fa fa-phone" aria-hidden="true"></i>
                  <span>890 234 5678</span>
                </a>
              </div>
            </div>

            {/* Mobile Menu Overlay */}
            {isMenuOpen && (
              <div className="mobile-menu-overlay show">
                <div className="mobile-menu-header">
                   <img alt="TourPress" src="https://tourpress.b-cdn.net/wp-content/uploads/2020/04/logo.png" width="120" />
                   <button className="close-btn" onClick={closeMenu}>&times;</button>
                </div>
                <ul className="mobile-menu-list pt-4">
                  <li><Link to="/" onClick={closeMenu}>Home</Link></li>
                  <li><Link to="/tours" onClick={closeMenu}>Tours</Link></li>
                  <li><Link to="/News" onClick={closeMenu}>News</Link></li>
                  <li><Link to="/Account" onClick={closeMenu}>My Account</Link></li>
                  <li><Link to="/FAQs" onClick={closeMenu}>FAQs</Link></li>
                  <li><Link to="/contact" onClick={closeMenu}>Contact</Link></li>
                </ul>
              </div>
            )}
          </div>
        </div>
      </header>
    </div>
  );
};

export default Navbar;
