module.exports = (page, debug) => async (eventName, callback) => {
  return new Promise((resolve, reject) => {
    async function handler(event) {
      try {
        const result = await callback(event)

        if (result && typeof result.reject === 'function') {
          const resultError = result.reject()
          throw new Error(resultError)
        }

        if (result && typeof result.resolve === 'function') {
          const resultValue = result.resolve()

          if (debug) console.log(`-> ${eventName} eventListener result: ${resultValue}`)

          removeEventListener()
          resolve(resultValue)
        }
      } catch (error) {
        if (debug) console.log(`-> ${eventName} eventListener error: ${error.message}`)

        removeEventListener()
        reject(error.message)
      }
    }

    function removeEventListener() {
      if (debug) console.log(`-> ${eventName} eventListeners count: ${page.listenerCount(eventName)}`)

      page.off(eventName, handler)

      if (debug) console.log(`-> ${eventName} eventListeners count: ${page.listenerCount(eventName)}`)
    }

    page.on(eventName, handler)
  })
}
