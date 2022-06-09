const showLogs = require('./showLogs')
const clearInput = require('./clearInput')
const delay = require('./delay')

module.exports = {
  delay,

  getPageUtils: (page, debug) => {
    showLogs(page, debug)

    return {
      clearInput: clearInput(page),
    }
  },
}
