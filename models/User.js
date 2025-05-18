// models/User.js
const mongoose = require('mongoose');

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
    required: function () {
      return !this.googleId; // Password is required only if not using Google OAuth
    },
  },
  googleId: {
    type: String,
    unique: true,
    sparse: true,
  },
  profilePhoto: String,
  isVerified: {
    type: Boolean,
    default: false,
  },
  otp: String,
  otpExpires: Date
}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);
