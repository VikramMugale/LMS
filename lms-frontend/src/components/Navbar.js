import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(false);
    }
  }, [location]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setIsAuthenticated(false);
    setIsDropdownOpen(false);
    // Force navigation to home page and refresh
    navigate('/', { replace: true });
    window.location.reload();
  };

  const quickLinks = isAuthenticated
    ? [
        { path: '/', label: 'Home' },
        { path: '/courses', label: 'Courses' },
        { path: '/profile', label: 'Profile' },
        { path: '#', label: 'Logout', onClick: handleLogout }
      ]
    : [
        { path: '/', label: 'Home' },
        { path: '/courses', label: 'Courses' },
        { path: '/auth/login', label: 'Login' },
        { path: '/auth/signup', label: 'Sign Up' }
      ];

  return (
    <nav className="navbar">
      <div className="container navbar-container">
        <Link to="/" className="navbar-logo">LMS</Link>

        {/* Desktop Navigation */}
        <div className="navbar-links desktop-nav">
          {quickLinks.map(link => (
            link.onClick ? (
              <Link
                key={link.path}
                to={link.path}
                className="navbar-link"
                onClick={link.onClick}
              >
                {link.label}
              </Link>
            ) : (
              <Link
                key={link.path}
                to={link.path}
                className={`navbar-link ${location.pathname === link.path ? 'active' : ''}`}
              >
                {link.label}
              </Link>
            )
          ))}
        </div>

        {/* Mobile Navigation */}
        <div className="mobile-nav">
          <button 
            className="dropdown-toggle"
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            aria-expanded={isDropdownOpen}
          >
            <span className={`menu-icon ${isDropdownOpen ? 'open' : ''}`}></span>
          </button>
          
          {isDropdownOpen && (
            <div className="dropdown-menu">
              {quickLinks.map(link => (
                link.onClick ? (
                  <Link
                    key={link.path}
                    to={link.path}
                    className="dropdown-item"
                    onClick={link.onClick}
                  >
                    {link.label}
                  </Link>
                ) : (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={`dropdown-item ${location.pathname === link.path ? 'active' : ''}`}
                    onClick={() => setIsDropdownOpen(false)}
                  >
                    {link.label}
                  </Link>
                )
              ))}
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

