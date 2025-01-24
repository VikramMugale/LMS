const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = 'your-secret-key'; // In production, use environment variable

// Middleware
app.use(cors());
app.use(express.json());

// In-memory database (replace with real database in production)
let users = [];
let courses = [
  {
    id: '1',
    name: 'Introduction to React',
    description: 'Learn the basics of React.js',
    price: 99.99,
    image: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee',
    instructor: 'John Doe',
    duration: '8 weeks',
    enrolled: []
  },
  {
    id: '2',
    name: 'Node.js Fundamentals',
    description: 'Master Node.js and Express',
    price: 89.99,
    image: 'https://images.unsplash.com/photo-1648737963540-306235c8170e',
    instructor: 'Jane Smith',
    duration: '6 weeks',
    enrolled: []
  },
  {
    id: '3',
    name: 'JavaScript Mastery',
    description: 'Advanced JavaScript concepts',
    price: 79.99,
    image: 'https://images.unsplash.com/photo-1579468118864-1b9ea3c0db4a',
    instructor: 'Mike Johnson',
    duration: '10 weeks',
    enrolled: []
  }
];

// Authentication middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Authentication required' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid or expired token' });
    }
    req.user = user;
    next();
  });
};

// Auth endpoints
// In your server.js file, update the signup endpoint:

app.post('/auth/signup', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Validate input
    if (!name || !email || !password) {
      return res.status(400).json({ 
        message: 'Please provide name, email and password' 
      });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ 
        message: 'Please provide a valid email address' 
      });
    }

    // Check if user already exists
    const existingUser = users.find(user => user.email === email);
    if (existingUser) {
      return res.status(400).json({ 
        message: 'User with this email already exists' 
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const newUser = {
      id: Date.now().toString(),
      name,
      email,
      password: hashedPassword,
      enrolledCourses: []
    };

    // Add user to database
    users.push(newUser);

    // Create JWT token
    const token = jwt.sign(
      { id: newUser.id }, 
      JWT_SECRET, 
      { expiresIn: '24h' }
    );

    // Send response
    res.status(201).json({
      message: 'User created successfully',
      token,
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email
      }
    });

  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ 
      message: 'An error occurred during signup' 
    });
  }
});

app.post('/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = users.find(u => u.email === email);
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Check password
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Create token
    const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: '24h' });

    res.json({ token, user: { id: user.id, name: user.name, email } });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Course endpoints
app.get('/courses', (req, res) => {
  res.json(courses);
});

app.get('/courses/:id', (req, res) => {
  const course = courses.find(c => c.id === req.params.id);
  if (!course) {
    return res.status(404).json({ message: 'Course not found' });
  }
  res.json(course);
});

app.post('/courses', authenticateToken, (req, res) => {
  const { name, description, price, image, instructor, duration } = req.body;
  
  const newCourse = {
    id: Date.now().toString(),
    name,
    description,
    price,
    image,
    instructor,
    duration,
    enrolled: []
  };

  courses.push(newCourse);
  res.status(201).json(newCourse);
});

app.put('/courses/:id', authenticateToken, (req, res) => {
  const courseIndex = courses.findIndex(c => c.id === req.params.id);
  if (courseIndex === -1) {
    return res.status(404).json({ message: 'Course not found' });
  }

  courses[courseIndex] = { ...courses[courseIndex], ...req.body };
  res.json(courses[courseIndex]);
});

app.delete('/courses/:id', authenticateToken, (req, res) => {
  const courseIndex = courses.findIndex(c => c.id === req.params.id);
  if (courseIndex === -1) {
    return res.status(404).json({ message: 'Course not found' });
  }

  courses.splice(courseIndex, 1);
  res.status(204).send();
});

// User endpoints
app.get('/user/profile', authenticateToken, (req, res) => {
  const user = users.find(u => u.id === req.user.id);
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  const { password, ...userWithoutPassword } = user;
  res.json(userWithoutPassword);
});

app.put('/user/profile', authenticateToken, async (req, res) => {
  const userIndex = users.findIndex(u => u.id === req.user.id);
  if (userIndex === -1) {
    return res.status(404).json({ message: 'User not found' });
  }

  const { password, ...updateData } = req.body;
  if (password) {
    updateData.password = await bcrypt.hash(password, 10);
  }

  users[userIndex] = { ...users[userIndex], ...updateData };
  const { password: _, ...userWithoutPassword } = users[userIndex];
  res.json(userWithoutPassword);
});

app.post('/courses/:id/enroll', authenticateToken, (req, res) => {
  const course = courses.find(c => c.id === req.params.id);
  if (!course) {
    return res.status(404).json({ message: 'Course not found' });
  }

  const user = users.find(u => u.id === req.user.id);
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  if (user.enrolledCourses.includes(course.id)) {
    return res.status(400).json({ message: 'Already enrolled in this course' });
  }

  user.enrolledCourses.push(course.id);
  course.enrolled.push(user.id);

  res.json({ message: 'Successfully enrolled' });
});

app.get('/user/courses', authenticateToken, (req, res) => {
  const user = users.find(u => u.id === req.user.id);
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  const enrolledCourses = courses.filter(course => 
    user.enrolledCourses.includes(course.id)
  );

  res.json(enrolledCourses);
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});