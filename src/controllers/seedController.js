const data = require('../data');
const { User } = require('../models/userModel');

const seedUser = async (req, res, next) => {
  try {
    //delete all existing all users
    await User.deleteMany({});

    // new user inseting
    const users = await User.insertMany(data.users);

    //successfull response
    return res.status(201).json(users);
  } catch (error) {
    next(error);
  }
};

module.exports = { seedUser };
