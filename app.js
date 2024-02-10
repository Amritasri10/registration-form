const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const colors = require("colors");
const dotenv = require("dotenv");
const path = require('path');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const app = express();

// Load environment variables
dotenv.config();

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(morgan('dev'));
app.use(cors());
app.use(express.static(path.join(__dirname, 'public')));

// MongoDB connection
mongoose.connect('mongodb://127.0.0.1:27017/user_db', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => {
    console.log(`Connected to MongoDB Database: ${mongoose.connection.host}`.blue.bold);
  })
  .catch((error) => {
    console.log(`Error: ${error.message}`.red.underline);
  });

// Define mongoose schema and model for user
const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, 'Username is required'],
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
  },
  password: {
    type: String,
    required: [true, 'Password is required']
  },
}, {
  timestamps: true
});

const User = mongoose.model('User', UserSchema);

// Routes
app.get('/', (req, res) => {
  res.sendFile(path.dirname(__dirname) + '/public/index.html');
});

app.post('/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;
    // Validation
    if (!username || !email || !password) {
      return res.status(400).json({
        message: "All fields are required",
        success: false
      })
    }
    // Existing user
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(200).json({
        message: "User already exists",
        success: false
      })
    }
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    // Save user
    const user = await new User({ username, email, password: hashedPassword }).save();
    // Redirect to success.html
    return res.redirect('/success');
  }catch (error) {
    console.log(error);
    // Redirect to error.html on error
    return res.redirect('/error');
  }
});
app.get('/success', (req, res) => {
  res.sendFile(path.join(__dirname, '/public/success.html'));
});
app.get('/error', (req, res) => {
  res.sendFile(path.join(__dirname, '/public/error.html'));
});

// PORT
const PORT = process.env.PORT || 8003;
// Start the server
app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`.yellow.bold);
});
