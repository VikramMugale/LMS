import React from 'react';
import Footer from '../components/Footer';
import Home from '../components/Home';

const HomePage = () => {
  return (
    <div >
      <main className="main-content">
        <Home />
      </main>
      <Footer />
    </div>
  );
};

export default HomePage;