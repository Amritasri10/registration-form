// controllers/authController.js
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
const crypto = require('crypto');
const { sendEmail} = require('../utils/sendEmail');


// Create a transporter for nodemailer
const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: process.env.EMAIL_USER,         // your email
    pass: process.env.EMAIL_PASS          // your email password or app password
  }
});

// Send OTP to user email
const sendOTP = async (email, otp) => {
  await transporter.sendMail({
    from: `"YourAppName" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "OTP Verification",
    html: `<p>Your OTP code is <b>${otp}</b>. It will expire in 10 minutes.</p>`
  });
};

// ----------------------- REGISTER -----------------------

exports.register = async (req, res) => {
  const { username, email, password } = req.body;

  try {
    const userExists = await User.findOne({ email });
    if (userExists) return res.send(`<script>alert("Email already exists"); window.history.back();</script>`);

    const hashedPassword = await bcrypt.hash(password, 10);
    const otp = Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit OTP
    const otpExpires = new Date(Date.now() + 30 * 60 * 1000); // 10 minutes from now

    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      otp,
      otpExpires
    });

    await newUser.save();
    await sendOTP(email, otp);

    // Save email in session
    req.session.email = email;

    // ✅ Redirect to OTP page
    return res.redirect('/auth/verify-otp');

  } catch (err) {
    console.error(err);
    return res.send(`<script>alert("Server error during registration"); window.history.back();</script>`);

  }
};

// ----------------------- VERIFY OTP -----------------------
exports.verifyOtp = async (req, res) => {
  const { otp } = req.body;
  const email = req.session.email;

  try {
    if (!email) return res.status(400).json({ msg: 'Session expired or email not found' });

    const user = await User.findOne({ email });

    if (!user) return res.status(404).json({ msg: 'User not found' });

    if (user.otp !== otp || user.otpExpires < new Date()) {
      return res.status(400).json({ msg: 'Invalid or expired OTP' });
    }

    user.isVerified = true;
    user.otp = undefined;
    user.otpExpires = undefined;
    await user.save();

    // Clear session email
    req.session.email = null;

    // Redirect to login page
    return res.redirect('/auth/login');


  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error during OTP verification' });
  }
};

// ----------------------- LOGIN -----------------------
exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) return res.status(404).json({ msg: 'User not found' });
    if (!user.isVerified) return res.status(401).json({ msg: 'Email not verified' });

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) return res.status(401).json({ msg: 'Invalid credentials' });

    // Set session or JWT token here for login
    req.session.userId = user._id;

    // Send welcome mail
    const subject = 'Welcome to Our App!';
    const html = `<h1>Welcome, ${user.username}!</h1><p>You have successfully logged in.</p>`;

    await sendEmail({ to: user.email, subject, html });

    // Redirect to success page
    res.redirect('/auth/success');

  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error during login' });
  }
};
