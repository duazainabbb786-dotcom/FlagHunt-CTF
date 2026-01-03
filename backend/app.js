const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');

dotenv.config(); // Load .env file

const app = express();
app.use(express.json()); // Replaces body-parser
app.use(cors());

// Logging Middleware
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// Serve static files from the frontend directory (parent folder)
app.use(express.static(path.join(__dirname, '..')));

// Default Route: Serve login.html
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'login.html'));
});

// Connect to MongoDB
const mongoURI = process.env.MONGO_URI || 'mongodb://localhost:27017/flaghunt';
mongoose.connect(mongoURI)
  .then(() => console.log('Connected to MongoDB successfully!'))
  .catch(err => console.log('DB Connection Error:', err));

// Student Schema
const StudentSchema = new mongoose.Schema({
  name: String,
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }
});

const Student = mongoose.model('Student', StudentSchema);

// Register Route
app.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check if user already exists
    const existing = await Student.findOne({ email });
    if (existing) return res.status(400).json({ message: 'Email already registered' });

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Save new student
    const student = new Student({ name, email, password: hashedPassword });
    await student.save();

    res.status(201).json({ message: 'Student registered successfully!' });
  } catch (err) {
    res.status(500).json({ message: 'Error: ' + err.message });
  }
});

// Login Route
app.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const student = await Student.findOne({ email });
    if (!student) return res.status(400).json({ message: 'Invalid email or password' });

    const isMatch = await bcrypt.compare(password, student.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid email or password' });

    // Create token
    const jwtSecret = process.env.JWT_SECRET || 'flaghunt_secret_key_2025';
    const token = jwt.sign({ id: student._id }, jwtSecret, { expiresIn: '1h' });

    res.json({ message: 'Login successful', token });
  } catch (err) {
    res.status(500).json({ message: 'Error: ' + err.message });
  }
});


// Start server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});