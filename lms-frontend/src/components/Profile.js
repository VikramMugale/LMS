import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { endpoints } from '../services/api';
import './Profile.css';

const Profile = () => {
  const [user, setUser] = useState(null);
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/auth/login');
        return;
      }

      try {
        setLoading(true);
        const userData = localStorage.getItem('user');
        if (!userData) {
          navigate('/auth/login');
          return;
        }
        setUser(JSON.parse(userData));

        try {
          const response = await endpoints.getUserCourses();
          setEnrolledCourses(response.data || []);
        } catch (courseErr) {
          console.error('Error fetching courses:', courseErr);
          setEnrolledCourses([]);
        }
      } catch (err) {
        setError('Failed to load profile data');
        console.error('Profile error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [navigate]);

  return (
    <div className="profile-container">
      
      {loading ? (
        <div className="profile-loading">Loading...</div>
      ) : error ? (
        <div className="profile-error">{error}</div>
      ) : user ? (
        <>
          <div className="profile-header">
            <h2>Profile</h2>
          </div>
          
          <div className="profile-info">
            <div className="info-group">
              <label>Name:</label>
              <p>{user.name}</p>
            </div>
            <div className="info-group">
              <label>Email:</label>
              <p>{user.email}</p>
            </div>
          </div>

          <div className="enrolled-courses">
            <h3>Enrolled Courses</h3>
            {enrolledCourses.length === 0 ? (
              <p>No courses enrolled yet.</p>
            ) : (
              <div className="courses-grid">
                {enrolledCourses.map(course => (
                  <div key={course.id} className="course-card">
                    <img 
                      src={course.image || "/placeholder.svg"} 
                      alt={course.name} 
                      className="course-image"
                    />
                    <div className="course-info">
                      <h4>{course.name}</h4>
                      <p>{course.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      ) : (
        <div className="profile-error">Please log in to view your profile</div>
      )}
    </div>
  );
};

export default Profile;

