const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

module.exports = {
  generateHash: async function (password, saltRounds) {
    const hash = await bcrypt.hash(password, saltRounds)
    return hash
  },

  checkPassword: async function (password, hash) {
    return await bcrypt.compare(password, hash)
  },

  generateToken: async function (email) {
    try {
      if (email) {
        return await jwt.sign(
          {
            exp: Math.floor(Date.now() / 1000) + 60 * 60,
            data: email,
          },
          'secret',
        )
      }
    } catch (err) {
      return { message: err }
    }
  },
}
