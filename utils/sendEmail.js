const nodemailer = require('nodemailer');
require('dotenv').config();

const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: process.env.EMAIL_USER,      // Your Gmail address
    pass: process.env.EMAIL_PASS       // App-specific password
  }
});

// General-purpose email sender
const sendEmail = async ({ to, subject, html }) => {
  try {
    const mailOptions = {
      from: `"YourAppName" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent:', info.response);
  } catch (err) {
    console.error('Error sending email:', err.message);
    throw err;
  }
};

// Specific: Send OTP email
const sendOTPEmail = async (email, otp) => {
  const html = `<p>Your OTP code is <b>${otp}</b>. It will expire in 10 minutes.</p>`;
  await sendEmail({ to: email, subject: 'OTP Verification', html });
};


module.exports = {
  sendEmail,
  sendOTPEmail,
};
