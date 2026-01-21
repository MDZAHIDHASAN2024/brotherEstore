const jwt = require('jsonwebtoken');
const createError = require('http-errors');
const { jsonAccessKey } = require('../secret');

const isLoggedIn = async (req, res, next) => {
  try {
    const accessToken = req.cookies.accessToken;

    // যদি token না থাকে
    if (!accessToken) {
      throw createError(401, 'Access token not found. Please login first');
    }

    // token verify করুন
    const decoded = jwt.verify(accessToken, jsonAccessKey);
    if (!decoded) {
      throw createError(401, 'Invalid access token. pls login again');
    }

    // decoded data req object এ store করুন যাতে পরবর্তী middleware/controller এ ব্যবহার করতে পারেন
    req.user = decoded;

    next();
  } catch (error) {
    // JWT error handling
    if (error.name === 'TokenExpiredError') {
      return next(createError(401, 'Token expired. Please login again'));
    }
    if (error.name === 'JsonWebTokenError') {
      return next(createError(401, 'Invalid token. Please login again'));
    }
    return next(error);
  }
};
const isLoggedOut = async (req, res, next) => {
  try {
    const accessToken = req.cookies.accessToken;
    // যদি token না থাকে
    if (accessToken) {
      try {
        const decoded = jwt.verify(accessToken, jsonAccessKey);
        if (decoded) {
          throw createError(400, 'User already login. ');
        }
      } catch (error) {
        throw error;
      }
    }
    next();
  } catch (error) {
    // JWT error handling
    if (error.name === 'TokenExpiredError') {
      return next(createError(401, 'Token expired. Please login again'));
    }
    if (error.name === 'JsonWebTokenError') {
      return next(createError(401, 'Invalid token. Please login again'));
    }
    return next(error);
  }
};

module.exports = { isLoggedIn, isLoggedOut };
