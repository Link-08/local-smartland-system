const jwt = require('jsonwebtoken');
const { User } = require('../models');
require('dotenv').config();

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET || JWT_SECRET;

const auth = async (req, res, next) => {
  try {
    console.log('=== Starting auth middleware ===');
    console.log('Request path:', req.path);
    console.log('Request method:', req.method);
    
    const authHeader = req.header('Authorization');
    console.log('Auth header present:', !!authHeader);
    
    if (!authHeader) {
      console.log('No Authorization header found');
      return res.status(401).json({ error: 'No Authorization header' });
    }

    if (!authHeader.startsWith('Bearer ')) {
      console.log('Invalid Authorization header format:', authHeader);
      return res.status(401).json({ error: 'Invalid Authorization header format' });
    }

    const token = authHeader.replace('Bearer ', '');
    console.log('Token extracted:', !!token);
    
    if (!token) {
      console.log('No token found in Authorization header');
      return res.status(401).json({ error: 'No token found' });
    }

    try {
      console.log('Verifying token...');
      const decoded = jwt.verify(token, JWT_SECRET);
      console.log('Token decoded successfully:', {
        id: decoded.id,
        role: decoded.role
      });

      console.log('Looking up user in database...');
      const user = await User.findByPk(decoded.id);
      
      if (!user) {
        console.log('User not found in database:', decoded.id);
        return res.status(401).json({ error: 'User not found' });
      }

      console.log('User found:', {
        id: user.id,
        email: user.email,
        role: user.role,
        isActive: user.isActive
      });

      if (!user.isActive) {
        console.log('User account is deactivated:', user.id);
        return res.status(401).json({ error: 'User account is deactivated' });
      }

      req.user = {
        id: user.id,
        email: user.email,
        role: user.role
      };
      
      console.log('=== Auth middleware completed successfully ===');
      next();
    } catch (error) {
      console.error('=== Token verification error ===');
      console.error('Error name:', error.name);
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);
      
      if (error.name === 'TokenExpiredError') {
        return res.status(401).json({ error: 'Token has expired' });
      }
      return res.status(401).json({ error: 'Invalid token' });
    }
  } catch (error) {
    console.error('=== Auth middleware error ===');
    console.error('Error name:', error.name);
    console.error('Error message:', error.message);
    console.error('Error stack:', error.stack);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const refreshTokenAuth = async (req, res, next) => {
  try {
    console.log('=== Starting refreshTokenAuth middleware ===');
    const authHeader = req.header('Authorization');
    console.log('Auth header present:', !!authHeader);
    
    if (!authHeader) {
      console.log('No Authorization header found');
      return res.status(401).json({ error: 'No Authorization header' });
    }

    if (!authHeader.startsWith('Bearer ')) {
      console.log('Invalid Authorization header format:', authHeader);
      return res.status(401).json({ error: 'Invalid Authorization header format' });
    }

    const token = authHeader.replace('Bearer ', '');
    console.log('Token extracted:', !!token);
    
    if (!token) {
      console.log('No token found in Authorization header');
      return res.status(401).json({ error: 'No token found' });
    }

    try {
      console.log('Verifying refresh token...');
      console.log('Using REFRESH_TOKEN_SECRET:', !!REFRESH_TOKEN_SECRET);
      
      const decoded = jwt.verify(token, REFRESH_TOKEN_SECRET);
      console.log('Token decoded successfully:', {
        id: decoded.id,
        exp: decoded.exp,
        iat: decoded.iat
      });
      
      if (!decoded || !decoded.id) {
        console.log('Invalid token format - missing id:', decoded);
        return res.status(401).json({ error: 'Invalid token format' });
      }

      req.decodedToken = decoded;
      console.log('=== Refresh token auth completed successfully ===');
      next();
    } catch (error) {
      console.error('=== Token verification error ===');
      console.error('Error name:', error.name);
      console.error('Error message:', error.message);
      
      if (error.name === 'TokenExpiredError') {
        return res.status(401).json({ error: 'Refresh token expired' });
      }
      if (error.name === 'JsonWebTokenError') {
        return res.status(401).json({ error: 'Invalid refresh token' });
      }
      return res.status(401).json({ error: 'Token verification failed' });
    }
  } catch (error) {
    console.error('=== Refresh token auth middleware error ===');
    console.error('Error name:', error.name);
    console.error('Error message:', error.message);
    console.error('Error stack:', error.stack);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const checkRole = (roles) => {
  return (req, res, next) => {
    console.log('Checking role:', req.user.role, 'against allowed roles:', roles);
    if (!roles.includes(req.user.role)) {
      console.log('Access denied - role not allowed');
      return res.status(403).json({ error: 'Access denied.' });
    }
    next();
  };
};

module.exports = { auth, refreshTokenAuth, checkRole, JWT_SECRET }; 