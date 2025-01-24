import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { endpoints } from '../services/api';
import './CourseList.css';

const CourseList = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true);
        const response = await endpoints.getCourses();
        setCourses(response.data);
      } catch (err) {
        setError('Failed to fetch courses. Please try again later.');
        console.error('Error fetching courses:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  if (loading) return <div>Loading courses...</div>;
  if (error) return <div className="error-message">{error}</div>;
  if (courses.length === 0) return <div>No courses available.</div>;

  return (
    <div className="course-grid">
      {courses.map(course => (
        <div key={course.id} className="course-card">
          <img 
            src={course.image || "/placeholder.svg"} 
            alt={course.name} 
            className="course-image"
          />
          <div className="course-content">
            <h3 className="course-title">{course.name}</h3>
            <p className="course-description">{course.description}</p>
            <div className="course-footer">
              <span className="course-price">${course.price}</span>
              <Link 
                to={`/courses/${course.id}`} 
                className="btn course-button"
              >
                View Details
              </Link>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default CourseList;

