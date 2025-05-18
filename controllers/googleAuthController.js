const User = require('../models/User');
const nodemailer = require('nodemailer');
const { sendEmail } = require('../utils/sendEmail');

// Nodemailer transporter (reuse or create)
const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});
exports.googleCallback = async (req, res) => {
  try {
    const user = req.user;

    if (!user) {
      throw new Error('No user found in session');
    }

    // If user is not verified, redirect to OTP verification
    if (!user.isVerified) {
      req.session.email = user.email;
      return res.redirect('/auth/verify-otp');
    }

    // User is verified — create session and send welcome email
    req.session.userId = user._id;

    await sendEmail({
      to: user.email,
      subject: 'Welcome back!',
      html: `<h1>Welcome back, ${user.username}!</h1><p>You have successfully logged in.</p>`,
    });

    return res.redirect('/auth/success');
  } catch (error) {
    console.error('Error in googleCallback:', error);
    return res.redirect('/auth/error');
  }
};
