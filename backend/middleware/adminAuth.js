const jwt = require('jsonwebtoken');
const { User } = require('../models');

const adminAuth = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findByPk(decoded.id);

    if (!user || user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized as admin' });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error('Admin auth error:', error);
    res.status(401).json({ message: 'Invalid token' });
  }
};

module.exports = adminAuth; 