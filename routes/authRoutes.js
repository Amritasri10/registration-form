const express = require('express');
const path = require('path');
const passport = require('../config/passport');
const router = express.Router();
const authController = require('../controllers/authController');
const googleAuthController = require('../controllers/googleAuthController');
const isAuthenticated = require('../middleware/isAuthenticated');

router.get('/profile', isAuthenticated, (req, res) => {
  res.json({ msg: 'Welcome to your profile!', user: req.user });
});


// Google OAuth routes
router.get('/google', passport.authenticate('google', { scope: ['email', 'profile'] }));

router.get('/google/callback', 
  passport.authenticate('google', { failureRedirect: '/auth/error' }),
  googleAuthController.googleCallback
);


// Authentication routes
router.post('/register', authController.register);
router.post('/verify-otp', authController.verifyOtp);
router.post('/login', authController.login);

// OAuth flow feedback
router.get('/register', (req, res) => {
  res.sendFile(path.join(__dirname, '/../public/index.html'));
});

router.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, '/../public/login.html'));
});

router.get('/success', (req, res) => {
  if (!req.session.userId) return res.redirect('/auth/login');
  res.sendFile(path.join(__dirname, '/../public/success.html'));
});

router.get('/error', (req, res) => {res.sendFile(path.join(__dirname, '/../public/error.html'));
});

router.get('/verify-otp', (req, res) => {
  if (!req.session.email) {
    return res.send('<h2>Session expired. Please register again.</h2>');
  }
  res.sendFile(path.join(__dirname, './../public/verify-otp.html'));
});

module.exports = router;
