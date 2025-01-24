import React, { createContext, useState, useEffect } from 'react';
import { api } from '../services/api'; // Use centralized api service

export const CourseContext = createContext();

const CourseProvider = ({ children }) => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get('/courses');
      setCourses(response.data);
    } catch (error) {
      setError('Failed to fetch courses. Please try again later.');
      console.error('Error fetching courses:', error);
    } finally {
      setLoading(false);
    }
  };

  const addCourse = async (courseData) => {
    try {
      const response = await api.post('/courses', courseData);
      setCourses(prevCourses => [...prevCourses, response.data]);
      return response.data;
    } catch (error) {
      throw new Error('Failed to add course');
    }
  };

  const updateCourse = async (courseId, courseData) => {
    try {
      const response = await api.put(`/courses/${courseId}`, courseData);
      setCourses(prevCourses => 
        prevCourses.map(course => 
          course.id === courseId ? response.data : course
        )
      );
      return response.data;
    } catch (error) {
      throw new Error('Failed to update course');
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  return (
    <CourseContext.Provider value={{ 
      courses,
      loading,
      error,
      fetchCourses,
      addCourse,
      updateCourse
    }}>
      {children}
    </CourseContext.Provider>
  );
};

export default CourseProvider;