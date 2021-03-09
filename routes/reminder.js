const express = require('express')
const ReminderModel = require('../models/Reminder')
const router = express.Router()
const { check } = require('express-validator')
const { body, validationResult } = require('express-validator')
const { sortByDateTime } = require('../services/reminder')

//Set reminder
router.post(
  '/',
  check('reminderTitle')
    .isLength({ min: 1 })
    .withMessage('Title should not be empty'),
  check('reminderContent')
    .isLength({ min: 1 })
    .withMessage('Content should not be empty'),
  check('reminderDate').custom(async (reminderTime, { req }) => {
    if (!reminderTime.match(/(\d{4})-(\d{2})-(\d{2})/g)) {
      throw new Error('Incorrect date format')
    }
  }),
  check('reminderTime').custom(async (reminderTime, { req }) => {
    if (!reminderTime.match(/(\d{2}):(\d{2})/g)) {
      throw new Error('Incorrect date format')
    }
  }),
  check('reminderTrigger')
    .isIn(['true', 'false'])
    .withMessage('Trigger cannot be empty'),
  check('userEmail').exists().withMessage('Login to save reminder'),
  async (req, res) => {
    // Express-validator results
    const errors = validationResult(req)

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }

    try {
      const newReminder = new ReminderModel({
        title: req.body.reminderTitle,
        content: req.body.reminderContent,
        date: req.body.reminderDate,
        time: req.body.reminderTime,
        trigger: req.body.reminderTrigger,
        userEmail: req.body.userEmail,
      })

      // Saving new Reminder
      const savedReminder = await newReminder.save()
      res.json(savedReminder)
    } catch (err) {
      throw new Error(err)
    }
  },
)

//Get reminder by user
router.get('/:email', async (req, res) => {
  try {
    const reminders = await ReminderModel.find({
      userEmail: req.params.email,
    })

    if (reminders) {
      return res.status(200).json(sortByDateTime(reminders))
    }
  } catch (err) {
    throw new Error(err)
  }
})

//Get reminder by user and date
router.get('/:email/:date', async (req, res) => {
  try {
    const reminders = await ReminderModel.find({
      userEmail: req.params.email,
      date: req.params.date,
    })

    if (reminders) {
      return res.status(200).json(reminders)
    }
  } catch (err) {
    throw new Error(err)
  }
})

router.delete('/:_id', async (req, res) => {
  try {
    const removedReminder = await ReminderModel.deleteOne({
      _id: req.params._id,
    })
    res.json(removedReminder)
  } catch (err) {
    res.json({ message: err })
  }
})

module.exports = router
