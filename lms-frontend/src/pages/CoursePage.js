import React from 'react';
import Footer from '../components/Footer';
import CourseList from '../components/CourseList';

const CoursesPage = () => {
  return (
    <div>
      <main className="main-content">
        <div className="container">
          <h1>Available Courses</h1>
          <CourseList />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default CoursesPage;