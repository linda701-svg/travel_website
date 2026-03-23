import React from 'react';
import "../Style/style.css";
import "../Style/Footer.css";

const Footer = () => {
  const destinations = [
    "United Arab Emirates", "United Kingdom", "Australia", "Maldives", "Turkey"
  ];

  const blogCategories1 = ["Improve Life", "Productivity", "Sport", "Tools"];
  const blogCategories2 = ["Life", "Self Discipline", "Technology"];

  const tags = [
    "PRODUCTIVITY", "RELAX", "SELF DISCIPLINE", "SOFTWARE",
    "SPORT", "TIME MANAGEMENT", "TOOLS", "VIEW", "WEB", "WORK"
  ];

  return (
    <div className="modern-footer">
      <div className="container">
        <div className="row g-4 g-lg-5">

          {/* Address & Contact */}
          <div className="col-12 col-sm-6 col-lg-3">
            <h3 className="footer-widget-title">Address &amp; Contact</h3>
            <p className="footer-address">
              1234 Somewhere Rd. Estronpark, TN 00018 United States.
            </p>
            <div className="footer-contact-item">
              <i className="fa fa-envelope-o"></i>
              <a href="mailto:sales@example.com">sales@example.com</a>
            </div>
            <div className="footer-contact-item">
              <i className="fa fa-phone"></i>
              <a href="tel:8902345678">890 234 5678</a>
            </div>
            <div className="footer-social">
              <a href="#" aria-label="Facebook"><i className="fa fa-facebook"></i></a>
              <a href="#" aria-label="Twitter"><i className="fa fa-twitter"></i></a>
              <a href="#" aria-label="Instagram"><i className="fa fa-instagram"></i></a>
              <a href="#" aria-label="YouTube"><i className="fa fa-youtube-play"></i></a>
            </div>
          </div>

          {/* Travel Destinations */}
          <div className="col-12 col-sm-6 col-lg-2">
            <h3 className="footer-widget-title">Travel Destinations</h3>
            <ul className="footer-nav-list">
              {destinations.map((dest) => (
                <li key={dest}><a href="#">{dest}</a></li>
              ))}
            </ul>
          </div>

          {/* Blog Categories */}
          <div className="col-12 col-sm-6 col-lg-4">
            <h3 className="footer-widget-title">Blog Categories</h3>
            <div className="footer-cat-grid">
              <ul className="footer-nav-list">
                {blogCategories1.map((cat) => (
                  <li key={cat}><a href="#">{cat}</a></li>
                ))}
              </ul>
              <ul className="footer-nav-list">
                {blogCategories2.map((cat) => (
                  <li key={cat}><a href="#">{cat}</a></li>
                ))}
              </ul>
            </div>
          </div>

          {/* Tags */}
          <div className="col-12 col-sm-6 col-lg-3">
            <h3 className="footer-widget-title">Tags</h3>
            <div className="footer-tags">
              {tags.map((tag) => (
                <a href="#" key={tag} className="footer-tag">{tag}</a>
              ))}
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="footer-bottom">
          <div className="row align-items-center">
            <div className="col-12 col-md-6">
              <p className="footer-copyright">
                © Copyright 2026 <a href="#">TourPress</a> — All Rights Reserved.
              </p>
            </div>
            <div className="col-12 col-md-6">
              <div className="footer-payment-icons">
                <img src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg" alt="Visa" />
                <img src="https://upload.wikimedia.org/wikipedia/commons/3/30/American_Express_logo.svg" alt="Amex" />
                <img src="https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg" alt="PayPal" />
                <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" alt="MasterCard" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll to Top */}
      <a
        href="#top"
        className="footer-scroll-top"
        aria-label="Scroll to top"
        onClick={(e) => {
          e.preventDefault();
          // Target all possible scroll containers
          document.body.scrollTop = 0;
          document.documentElement.scrollTop = 0;
          window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
        }}
      >
        <i className="fa fa-chevron-up"></i>
      </a>
    </div>
  );
};

export default Footer;