const express = require('express')
const router = express.Router()
const UserModel = require('../models/User')
const { generateHash, checkPassword, generateToken } = require('../services/user')
const {
  validateEmail,
  validatePassword,
  validateConfirmPassword,
} = require('../services/validator')
const { check } = require('express-validator')
const { body, validationResult } = require('express-validator')

//Get all users
router.get('/', async (req, res) => {
  console.log('test')
  try {
    const users = await UserModel.find()
    res.json(users)
  } catch (err) {
    res.json({ message: err })
  }
})

// Get user by email
router.get('/:id', async (req, res) => {
  try {
    const user = await UserModel.findById(req.params.id)
    res.json(user)
  } catch (err) {
    res.json({ message: err })
  }
})

//Set user
router.post(
  '/',
  [validateEmail],
  [validatePassword],
  [validateConfirmPassword],
  async (req, res) => {
    // Express-validator results
    const errors = validationResult(req)

    // TODO - remove values from error list - security issue
    if (!errors.isEmpty()) {
      console.log(errors)
      return res.status(400).json({ errors: errors.array() })
    }

    // Generating salt/hash
    const hash = await generateHash(req.body.registerPassword, 10)
    const passwordValid = await checkPassword(req.body.registerPassword, hash)
    if (passwordValid) {
      // Creating new User
      const newUser = new UserModel({
        name: req.body.name | '',
        surname: req.body.surname | '',
        email: req.body.registerEmail,
        PasswordHash: hash,
      })

      // Saving new User
      const savedUser = await newUser.save()
      res.json(savedUser)
    } else {
      return res.status(500).json({
        errors: [
          {
            msg: 'Internal server error',
            param: 'registerPassword',
          },
        ],
      })
    }
  },
)

router.post(
  '/login',
  check('loginEmail').isEmail().withMessage('Invalid email format'),
  async (req, res) => {
    try {
      const user = await UserModel.findOne({ email: req.body.loginEmail })

      const passwordValid = await checkPassword(
        req.body.loginPassword,
        user.PasswordHash,
      )

      if (passwordValid) {
        token = await generateToken(user.email)
        if (token.message) {
          return res.status(500).json({
            errors: [
            {
              msg: 'Internal server error',
              param: 'loginPassword',
            },
          ],
          })
        }
        return res.status(200).json({
          email: req.body.loginEmail,
          token: token
        })
      } else {
        return res.status(400).json({
          errors: [
            {
              msg: 'Invalid email or password',
              param: 'loginPassword',
            },
          ],
        })
      }
    } catch (err) {
      res.json({ message: err })
    }
  },
)

//Delete user by id
router.delete('/:userID', async (req, res) => {
  try {
    const removedUser = await UserModel.deleteOne({ _id: req.params.userID })
    res.json(removedUser)
  } catch (err) {
    res.json({ message: err })
  }
})

//Delete user by email
router.delete('/:email', async (req, res) => {
  try {
    const removedUser = await UserModel.deleteOne({ email: req.params.email })
    res.json(removedUser)
  } catch (err) {
    res.json({ message: err })
  }
})

// TODO - create interface to set/get name etc.
// router.patch('/:', async (req, res) => {
//   try {
//     const updatedUser = await UserModel.updateOne(
//       { email: req.params.email },
//       {
//         $set: {
//           name: req.body.name,
//           surname: req.body.surname,
//           email: req.body.email,
//           PasswordHash: req.body.PasswordHash,
//           PasswordSalt: req.body.PasswordSalt,
//         },
//       },
//     )
//     res.json(updatedUser)
//   } catch (err) {
//     res.json({ message: err })
//   }
// })

module.exports = router
