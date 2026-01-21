const { User } = require('../models/userModel');
const createError = require('http-errors');
const { successResponse } = require('./responseController');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { createJSONWebToken } = require('../helper/jsoWebToken');
const { jsonAccessKey } = require('../secret');

// handle log in
const handleLogin = async (req, res, next) => {
  try {
    //email paswored req body
    const { email, password } = req.body;
    //isExist
    const user = await User.findOne({ email });
    if (!user) {
      throw createError(
        404,
        'user does not exist with this email. Please register first',
      );
    }
    //compare the password
    const isPasswordMatch = await bcrypt.compare(password, user.password);

    if (!isPasswordMatch) {
      throw createError(401, 'user email/password did not match');
    }
    //isBanned
    if (user.isBanned) {
      throw createError(403, 'your are banned. pls contract authority');
    }
    //token, cookie
    const accessToken = createJSONWebToken({ email }, jsonAccessKey, '10m');
    res.cookie('accessToken', accessToken, {
      maxAge: 15 * 60 * 1000, // 15 minute
      httpOnly: true,
      secure: true,
      sameSite: 'none',
    });
    //success respose
    return successResponse(res, {
      statusCode: 201,
      message: 'User logged in  successfully ',
      payload: {},
    });
  } catch (error) {
    next(error);
  }
};

//handle log out
const handleLogout = async (req, res, next) => {
  try {
    res.clearCookie('accessToken');
    //success respose
    return successResponse(res, {
      statusCode: 201,
      message: 'User logged out  successfully ',
      payload: {},
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { handleLogin, handleLogout };
