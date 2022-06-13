const clearInput = require('./clearInput')
const delay = require('./delay')
const extractBankConfirmationCode = require('./extractBankConfirmationCode')
const showLogs = require('./showLogs')

module.exports = {
  delay,

  extractBankConfirmationCode,

  getPageUtils: (page, debug) => {
    showLogs(page, debug)

    return {
      clearInput: clearInput(page),
    }
  },
}
