import React from 'react';
import { Routes, Route, Navigate, Link, useLocation } from 'react-router-dom';
import Login from '../components/Login';
import Signup from '../components/Signup';
import './AuthPage.css';

const AuthPage = () => {
  const location = useLocation();
  const isLoginPage = location.pathname === '/auth/login';

  return (
    <div className="container">
      <div className="auth-nav">
        <Link 
          to="/auth/login" 
          className={`auth-nav-link ${isLoginPage ? 'active' : ''}`}
        >
          Login
        </Link>
        <Link 
          to="/auth/signup" 
          className={`auth-nav-link ${!isLoginPage ? 'active' : ''}`}
        >
          Sign Up
        </Link>
      </div>
      <Routes>
        <Route path="login" element={<Login />} />
        <Route path="signup" element={<Signup />} />
        <Route path="*" element={<Navigate to="login" replace />} />
      </Routes>
    </div>
  );
};

export default AuthPage;