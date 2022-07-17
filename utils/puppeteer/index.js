const clearInput = require('./clearInput')
const showDebugLogs = require('./showDebugLogs')
const typeAndConfirm = require('./typeAndConfirm')

const getElementHandleProperty = require('./getElementHandleProperty')

module.exports = {
  typeAndConfirm: typeAndConfirm(getElementHandleProperty),

  getAttribute: getElementHandleProperty,

  getPageUtils: (page, debug) => {
    showDebugLogs(page, debug)

    return {
      clearInput: clearInput(page),
    }
  },
}
