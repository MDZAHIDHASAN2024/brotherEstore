const express = require('express');
const {
  getUsers,
  getUserlById,
  deleteUserById,
  userRegister,
  userActivation,
  updateUser,
} = require('../controllers/userController');
const { validateUserRagistration } = require('../validator/auth');
const runValidatiors = require('../validator');
const uploadUserImage = require('../middlewares/uploadFile');
const { isLoggedIn, isLoggedOut } = require('../middlewares/auth');
const userRouter = express.Router();

//GET user api
userRouter.get('/', getUsers);
userRouter.get('/:id', isLoggedIn, getUserlById);
userRouter.delete('/:id', isLoggedIn, deleteUserById);
userRouter.put('/:id', isLoggedIn, uploadUserImage.single('image'), updateUser);
userRouter.post(
  '/register',
  uploadUserImage.single('image'),
  isLoggedOut,
  validateUserRagistration,
  runValidatiors,
  userRegister,
);
userRouter.post('/verify', userActivation);

module.exports = { userRouter };
