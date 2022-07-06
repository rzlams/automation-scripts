const clearInput = require('./clearInput')
const showLogs = require('./showLogs')
const typeAndConfirm = require('./typeAndConfirm')

const getElementHandleProperty = require('./getElementHandleProperty')

module.exports = {
  typeAndConfirm: typeAndConfirm(getElementHandleProperty),

  getAttribute: getElementHandleProperty,

  getPageUtils: (page, debug) => {
    showLogs(page, debug)

    return {
      clearInput: clearInput(page),
    }
  },
}
