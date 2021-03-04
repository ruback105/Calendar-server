const { check } = require('express-validator')
const UserModel = require('../models/User')

module.exports = {
  validatePassword: check('registerPassword')
    // To delete leading and triling space
    .trim()
    // Validate minimum length of password
    .isLength({ min: 8, max: 16 })
    .withMessage('Password must be between 8 to 16 characters'),

  validateConfirmPassword: check('confirmRegisterPassword')
    // To delete leading and triling space
    .trim()
    // Validate minimum length of password
    .isLength({ min: 8, max: 16 })
    .withMessage('Password must be between 8 to 16 characters')
    // Validate confirmRegisterPassword
    .custom(async (confirmRegisterPassword, { req }) => {
      const password = req.body.registerPassword
      // Compare password/confirm password
      if (password !== confirmRegisterPassword) {
        throw new Error('Passwords must be equal')
      }
    }),

  validateEmail: check('registerEmail')
    // To delete leading and triling space
    .trim()
    // Normalizing the email address
    .normalizeEmail()
    // Checking email format
    .isEmail()
    .withMessage('Invalid email')
    // Custom validation
    // Validate email in use or not
    .custom(async (registerEmail) => {
      const existingUser = await UserModel.findOne({ email: registerEmail })
      if (existingUser) {
        throw new Error('Email already in use')
      }
    }),

  comparePasswordAndHash: function (password, hash) {
    bcrypt.compare(password, hash, function (err, result) {
      return result | err
    })
  },
}
