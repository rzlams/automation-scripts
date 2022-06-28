const clearInput = require('./clearInput')
const showLogs = require('./showLogs')

module.exports = {
  getPageUtils: (page, debug) => {
    showLogs(page, debug)

    return {
      clearInput: clearInput(page),

      typeAndConfirm: require('./typeAndConfirm'),
    }
  },
}
