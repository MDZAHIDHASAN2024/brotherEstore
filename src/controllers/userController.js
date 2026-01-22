const { User } = require('../models/userModel');
const createError = require('http-errors');
const { successResponse } = require('./responseController');
const mongoose = require('mongoose');
const { findWithId } = require('../services/findUser');
const fs = require('fs');
const { deleteImage } = require('../helper/deleteImage');
const { createJSONWebToken } = require('../helper/jsoWebToken');
const { jsonActivationKay, clientSite } = require('../secret');
const emailWithNodeMailer = require('../helper/email');
const jwt = require('jsonwebtoken');
const runValidatiors = require('../validator');

//get all users
const getUsers = async (req, res, next) => {
  try {
    const search = req.query.search || '';
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 5;

    const searchRegExp = new RegExp('.*' + search + '.*', 'i');

    const filter = {
      isAdmin: { $ne: true },
      $or: [
        { name: { $regex: searchRegExp } },
        { email: { $regex: searchRegExp } },
        { phone: { $regex: searchRegExp } },
      ],
    };

    const options = { password: 0 };
    const users = await User.find(filter, options)
      .limit(limit)
      .skip((page - 1) * limit);

    const count = await User.find(filter).countDocuments();
    const totalPages = Math.ceil(count / limit);

    if (users.length === 0) {
      throw createError(404, 'No users found');
    }

    return successResponse(res, {
      statusCode: 200,
      message: 'User ware return ',
      payload: {
        users,
        pagination: {
          totalPages,
          currentPage: page,
          previousPage: page > 1 ? page - 1 : null,
          nextPage: page < totalPages ? page + 1 : null,
          hasNextPage: page < totalPages,
          hasPreviousPage: page > 1,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

//get user by id
const getUserlById = async (req, res, next) => {
  try {
    const id = req.params.id;
    const options = { password: 0 };
    const user = await findWithId(User, id, options);

    return successResponse(res, {
      statusCode: 200,
      message: 'User ware return ',
      payload: {
        user,
      },
    });
  } catch (error) {
    next(error);
  }
};

//delete user by id
const deleteUserById = async (req, res, next) => {
  try {
    const id = req.params.id;
    const options = { password: 0 };
    const user = await findWithId(User, id, options);

    const userImagePath = user.image;

    deleteImage(userImagePath);

    await User.findByIdAndDelete({ _id: id, isAdmin: false });

    return successResponse(res, {
      statusCode: 200,
      message: 'User was delete successfully ',
    });
  } catch (error) {
    next(error);
  }
};
//user register
const userRegister = async (req, res, next) => {
  try {
    const { name, email, password, phone,image, address } = req.body;

    const userExists = await User.exists({ email: email });

    if (userExists) {
      throw createError(409, 'user with this email already exist, pls login ');
    }

    // create json web token
    const token = createJSONWebToken(
      { name, email, password, phone, image, address },
      jsonActivationKay,
      '10m'
    );

    //email prepire
    const emailData = {
      email,
      subject: 'Account Activation Email',
      html: `
        <h1>Hello ${name} !</h1>
        <p>Please click to here <a href="${clientSite}/api/activate//${token}">active your account</a></p>
      `,
    };

    //send email with nodemaillter
    try {
      // await emailWithNodeMailer(emailData);
    } catch (emailError) {
      next(createError(500, 'Fail to send verification email'));
      return;
    }

    return successResponse(res, {
      statusCode: 201,
      message: 'User register  successfully ',
      payload: {
        token,
      },
    });
  } catch (error) {
    next(error);
  }
};
//user verify
const userActivation = async (req, res, next) => {
  try {
    const token = req.body.token;

    if (!token) throw createError(400, 'token not found');

    const decoded = jwt.verify(token, jsonActivationKay);

    await User.create(decoded);

    return successResponse(res, {
      statusCode: 201,
      message: 'User was register  successfully ',
    });
  } catch (error) {
    next(error);
  }
};

//user update user by id
const updateUser = async (req, res, next) => {
  try {
    const userId = req.params.id;
    const options = { password: 0 };

    // User খুঁজে বের করুন
    const user = await findWithId(User, userId, options);

    const updateOptions = { new: true, runValidators: true, context: 'query' };

    let updates = {};

    for (let key in req.body) {
      if (['name', 'password', 'phone', 'address'].includes(key)) {
        updates[key] = req.body[key];
      }
    }

    // যদি নতুন image আপলোড হয়ে থাকে
    if (req.file) {
      updates.image = req.file.path;

      // পুরাতন image delete করুন
      const userImagePath = user.image;
      if (userImagePath) {
        deleteImage(userImagePath);
      }
    }

    // Password আপডেট হলে হ্যাশ করুন
    if (updates.password) {
      const bcrypt = require('bcrypt');
      updates.password = await bcrypt.hash(updates.password, 10);
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      updates,
      updateOptions
    );

    return successResponse(res, {
      statusCode: 200,
      message: 'User was updated successfully',
      payload: { user: updatedUser },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getUsers,
  getUserlById,
  deleteUserById,
  userRegister,
  userActivation,
  updateUser,
};
