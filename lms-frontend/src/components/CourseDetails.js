import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { endpoints } from '../services/api';
import './CourseDetails.css';

const CourseDetails = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCourseDetails = async () => {
      try {
        setLoading(true);
        const response = await endpoints.getCourse(courseId);
        setCourse(response.data);
      } catch (err) {
        setError('Failed to fetch course details');
        console.error('Error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCourseDetails();
  }, [courseId]);

  const handleEnroll = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/auth/login');
        return;
      }
      await endpoints.enrollCourse(courseId);
      navigate('/profile');
    } catch (err) {
      if (err.response?.status === 401) {
        navigate('/auth/login');
      } else {
        setError('Failed to enroll in course');
      }
    }
  };

  if (loading) return <div className="container">Loading...</div>;
  if (error) return <div className="container error-message">{error}</div>;
  if (!course) return <div className="container">Course not found</div>;

  return (
    <main className="main-content">
      <div className="container">
        <div className="course-details">
          <img 
            src={course.image || "/placeholder.svg"} 
            alt={course.name} 
            className="course-image"
          />
          <div className="course-info">
            <h1>{course.name}</h1>
            <p className="description">{course.description}</p>
            <div className="course-meta">
              <p><strong>Instructor:</strong> {course.instructor}</p>
              <p><strong>Duration:</strong> {course.duration}</p>
              <p><strong>Price:</strong> ${course.price}</p>
            </div>
            <button 
              onClick={handleEnroll}
              className="btn enroll-button"
            >
              Enroll Now
            </button>
          </div>
        </div>
      </div>
    </main>
  );
};

export default CourseDetails;

