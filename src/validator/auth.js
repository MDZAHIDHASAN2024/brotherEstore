const { body } = require('express-validator');

//registration validation
const validateUserRagistration = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Name is require')
    .isLength({ min: 3, max: 31 })
    .withMessage('name should be at least 3-31 character'),
  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Invalid Email '),
  body('password')
    .trim()
    .notEmpty()
    .withMessage('Password is required')
    .isLength({ min: 6 })
    .withMessage('Password should be at least 6 character long ')
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/
    )
    .withMessage(
      'Password should contain at least one uppercase, one lowercase latter, one number, and one special character'
    ),
  body('phone').trim().notEmpty().withMessage('Phone is required'),
  body('address')
    .trim()
    .notEmpty()
    .withMessage('Address is required')
    .isLength({ min: 3 })
    .withMessage('Address should be at least 3 character '),
  body('image').optional().isString().withMessage('User image is optional '),
];

module.exports = { validateUserRagistration };
