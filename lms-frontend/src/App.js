import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import theme from './styles/theme';
import './styles/App.css';
import HomePage from './pages/HomePage';
import CoursesPage from './pages/CoursePage';
import AuthPage from './pages/AuthPage';
import Profile from './components/Profile';
import CourseDetails from './components/CourseDetails';
import Navbar from './components/Navbar';
const App = () => {
  return (
    <ThemeProvider theme={theme}>
      <Router>
        <Navbar />
        <div className="app-container">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/courses" element={<CoursesPage />} />
            <Route path="/courses/:courseId" element={<CourseDetails />} />
            <Route path="/auth/*" element={<AuthPage />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="*" element={<div>404 Page Not Found</div>} />
          </Routes>
        </div>
      </Router>
    </ThemeProvider>
  );
};

export default App;