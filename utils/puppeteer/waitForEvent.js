module.exports = (page, debug) => async (eventName, callback) => {
  return new Promise((resolve, reject) => {
    async function handler(event) {
      try {
        const result = await callback(event)

        if (result === undefined) return

        if (debug) console.log(`-> ${eventName} eventListener result: ${result}`)

        removeEventListener()
        resolve(result)
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
