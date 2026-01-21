const { Schema, model } = require('mongoose');
const bcrypt = require('bcryptjs');
const { defaultImgaPath } = require('../secret');

const userScehma = new Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      minlength: [3, 'The name user name can be minumum 3 charater'],
      maxlength: [33, 'The name user name can be maximum 33 charater'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      trim: true,
      unique: true,
      lowercase: true,
      validate: {
        validator: (v) => {
          return /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(v);
        },
        message: 'please valid email address',
      },
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [6, 'Password name can be minumum 3 charater'],
      set: (v) => bcrypt.hashSync(v, bcrypt.genSaltSync(10)),
    },
    phone: {
      type: String,
      required: [true, 'Phone is required'],
    },
    image: {
      type: String,
      default: defaultImgaPath,
    },
    address: {
      type: String,
      required: [true, 'address is required'],
      trim: true,
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
    isBanned: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const User = model('Users', userScehma);

module.exports = { User };
