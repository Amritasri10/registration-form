const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/User');  // your User model
require('dotenv').config();

passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: process.env.GOOGLE_CALLBACK_URL
},
async (accessToken, refreshToken, profile, done) => {
  try {
    // Find user by googleId
    let user = await User.findOne({ googleId: profile.id });

    if (user) {
      // User found
      return done(null, user);
    }

    // Create new user
    user = new User({
      googleId: profile.id,
      username: profile.displayName || profile.emails[0].value.split('@')[0],
      email: profile.emails[0].value,
      isVerified: true
    });

    await user.save();
    return done(null, user);
  } catch (err) {
    return done(err, null);
  }
}));

// Serialize user: only save user id in session
passport.serializeUser((user, done) => {
  if (!user || !user.id) {
    return done(new Error('User object is missing or invalid in serializeUser'));
  }
  done(null, user.id);
});

// Deserialize user: fetch full user from id in session
passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});

module.exports = passport;
