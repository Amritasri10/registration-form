// middleware/isAuthenticated.js
module.exports = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next(); // User is authenticated, allow access
  }
  res.status(401).json({ msg: 'Unauthorized. Please log in.' });
};
