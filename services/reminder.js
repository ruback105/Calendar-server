module.exports = {
  sortByDateTime: function (reminders) {
    // Bubble sort 
    for (let i = 0; i < reminders.length - 1; i++) {
      for (let j = 0; j < reminders.length - i - 1; j++) {
        if (reminders[j].date > reminders[j + 1].date) {
          let temp = reminders[j]
          reminders[j] = reminders[j + 1]
          reminders[j + 1] = temp
        }
      }
    }

    return reminders
  },
}
