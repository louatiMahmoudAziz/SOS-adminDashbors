const User = require("../models/Users/user");
require("dotenv").config();
const jwt = require("jsonwebtoken");

// verify token if it's ok it sends back the user
module.exports.userVerification = (req, res) => {
  const token = req.headers.authorization?.split(' ')[1]; // Getting token from headers
  if (!token) {
    return res.status(401).json({ status: false, message: "No token provided" });
  }
  jwt.verify(token, process.env.JWT_SECRET, async (err, data) => {
    if (err) {
      console.error('Token verification error:', err); // Add this line for logging
      return res.status(401).json({ status: false, message: "Token verification failed" });
    } else {
      try {
        const user = await User.findById(data.sub);
        if (user) {
          return res.json({ status: true, user: user });
        } else {
          return res.status(404).json({ status: false, message: "User not found" });
        }
      } catch (error) {
        return res.status(500).json({ status: false, message: "Server error", error: error.message });
      }
    }
  });
};
