const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const session = require('express-session');
const passport = require('passport');
const cors = require('cors');
const morgan = require('morgan');
const colors = require('colors');
require('dotenv').config();

const authRoutes = require('./routes/authRoutes');
require('./config/passport');

const app = express();

// Middleware
app.use(cors()); // Enable CORS for all routes
app.use(morgan('dev')); // HTTP request logger middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Session setup (important for passport)
app.use(session({
  secret: 'secretkey',  // change this!
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false }  // true if HTTPS
}));

// Initialize passport middleware
app.use(passport.initialize());
app.use(passport.session());


app.use(passport.initialize());
app.use(passport.session());

// Static files
app.use(express.static('public'));

// Routes
app.use('/auth', authRoutes);

// Root route
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});

// Connect MongoDB and start server
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    const port = process.env.PORT || 5000;
    app.listen(port, () => {
      console.log(colors.green(`Server started on port ${port}`));
      console.log(colors.yellow('MongoDB connected successfully'));
    });
  })
  .catch(err => console.error(colors.red('MongoDB connection error:', err)));
