import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container footer-content">
        <div className="footer-section">
          <h3>About Us</h3>
          <p>LMS is your gateway to learning and growth.</p>
        </div>
        <div className="footer-section">
          <h3>Quick Links</h3>
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/courses">Courses</Link></li>
            <li><Link to="/profile">Profile</Link></li>
          </ul>
        </div>
        <div className="footer-section">
          <h3>Contact Us</h3>
          <p>Email: <a href="mailto:info@lms.com">info@lms.com</a></p>
          <p>Phone: <a href="tel:+1234567890">(123) 456-7890</a></p>
        </div>
      </div>
      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} LMS. All Rights Reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;

