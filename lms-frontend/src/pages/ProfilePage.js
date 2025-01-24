import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Profile from '../components/Profile';
import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';

const ProfilePage = () => {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/auth/login" />;
  }

  return (
    <div className="page-container">
      <Navbar />
      <main className="main-content">
        <div className="container">
          <Profile />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ProfilePage;