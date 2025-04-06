// Import required modules
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const { connectToMongoDB, getDB, collections } = require('./db');

// Create Express app
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname)); // Serve static files from root directory

// MongoDB connection
let db;
connectToMongoDB()
  .then((database) => {
    db = database;
    console.log('Database connection established');
  })
  .catch(err => {
    console.error('Failed to connect to MongoDB:', err);
  });

// Routes

// Health check endpoint to verify MongoDB connection
app.get('/api/health', async (req, res) => {
  try {
    if (!db) {
      return res.status(500).json({ status: 'error', message: 'Database not connected' });
    }
    
    // Ping the database
    await db.command({ ping: 1 });
    res.json({ status: 'ok', message: 'MongoDB connected' });
  } catch (error) {
    console.error('Health check failed:', error);
    res.status(500).json({ status: 'error', message: error.message });
  }
});

// Serve the login page
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Serve the home page
app.get('/home', (req, res) => {
  res.sendFile(path.join(__dirname, 'home.html'));
});

// Serve the registration page
app.get('/register', (req, res) => {
  res.sendFile(path.join(__dirname, 'register.html'));
});

// API: Login endpoint
app.post('/api/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    
    // Basic validation
    if (!username || !password) {
      return res.status(400).json({ message: 'Username and password are required' });
    }
    
    // Check if user exists in database
    const user = await db.collection(collections.users).findOne({ username });
    
    // In a real app, you would compare hashed passwords
    // This is a simplified example for demonstration
    if (user && user.password === password) {
      return res.status(200).json({ success: true, message: 'Login successful' });
    } else {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error during login' });
  }
});

// API: Registration endpoint
app.post('/api/register', async (req, res) => {
  try {
    console.log('Registration request received:', req.body);
    const { fullname, email, username, password } = req.body;
    
    // Basic validation
    if (!fullname || !email || !username || !password) {
      return res.status(400).json({ 
        success: false, 
        message: 'All fields are required' 
      });
    }
    
    // Check if username already exists
    const existingUsername = await db.collection(collections.users).findOne({ username });
    if (existingUsername) {
      return res.status(400).json({ 
        success: false, 
        message: 'Username already exists',
        error: 'username_exists'
      });
    }
    
    // Check if email already exists
    const existingEmail = await db.collection(collections.users).findOne({ email });
    if (existingEmail) {
      return res.status(400).json({ 
        success: false, 
        message: 'Email already registered',
        error: 'email_exists'
      });
    }
    
    // Create new user document
    const newUser = {
      fullname,
      email,
      username,
      password, // In a real app, this would be hashed
      createdAt: new Date()
    };
    
    // Insert new user into database
    const result = await db.collection(collections.users).insertOne(newUser);
    console.log('User registered successfully:', username);
    
    res.status(201).json({ 
      success: true, 
      message: 'Registration successful',
      userId: result.insertedId
    });
    
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error during registration',
      error: error.message
    });
  }
});

// API: Get all potholes
app.get('/api/potholes', async (req, res) => {
  try {
    const potholes = await db.collection(collections.potholes).find({}).toArray();
    res.status(200).json(potholes);
  } catch (error) {
    console.error('Error fetching potholes:', error);
    res.status(500).json({ message: 'Server error while fetching potholes' });
  }
});

// API: Report a new pothole
app.post('/api/potholes', async (req, res) => {
  try {
    const { latitude, longitude, severity, description } = req.body;
    
    // Basic validation
    if (!latitude || !longitude) {
      return res.status(400).json({ message: 'Latitude and longitude are required' });
    }
    
    // Create pothole document
    const newPothole = {
      latitude,
      longitude,
      severity: severity || 'medium',
      description: description || '',
      reportedAt: new Date(),
      status: 'reported'
    };
    
    // Insert into database
    const result = await db.collection(collections.potholes).insertOne(newPothole);
    
    res.status(201).json({ 
      success: true, 
      message: 'Pothole reported successfully',
      id: result.insertedId
    });
  } catch (error) {
    console.error('Error reporting pothole:', error);
    res.status(500).json({ message: 'Server error while reporting pothole' });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
}); 