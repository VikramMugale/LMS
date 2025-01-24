import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { endpoints } from '../services/api';
import './Home.css';

const Home = () => {
  const [featuredCourses, setFeaturedCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFeaturedCourses = async () => {
      try {
        setLoading(true);
        const response = await endpoints.getCourses();
        setFeaturedCourses(response.data.slice(0, 3));
      } catch (err) {
        setError('Failed to fetch courses');
        console.error('Error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedCourses();
  }, []);

  return (
    <div className="home">
      <section className="home-banner">
        <h1>Welcome to LMS</h1>
        <p>Your gateway to learning and growth.</p>
        <Link to="/courses" className="btn">Explore Courses</Link>
      </section>
      
      <section className="featured-courses container">
        <h2>Featured Courses</h2>
        {loading ? (
          <div className="loading">Loading courses...</div>
        ) : error ? (
          <div className="error">{error}</div>
        ) : (
          <div className="course-list">
            {featuredCourses.map(course => (
              <div key={course.id} className="course-card">
                <img 
                  src={course.image || "/placeholder.svg"} 
                  alt={course.name} 
                  className="course-image"
                />
                <div className="details">
                  <h3>{course.name}</h3>
                  <p>{course.description}</p>
                  <div className="course-footer">
                    <span className="price">${course.price}</span>
                    <Link 
                      to={`/courses/${course.id}`} 
                      className="btn"
                    >
                      Learn More
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default Home;

