module.exports = (page, debug) => {
  if (!debug) return

  page.on('console', async (msg) => {
    const args = await msg.args()
    args.forEach(async (arg) => {
      const val = await arg.jsonValue()
      // value is serializable
      if (JSON.stringify(val) !== JSON.stringify({})) console.log(val)
      // value is unserializable (or an empty oject)
      else {
        const { type, subtype, description } = arg._remoteObject
        console.log(`type: ${type}, subtype: ${subtype}, description:\n ${description}`)
      }
    })
  })

  page.on('framenavigated', (frame) => {
    const url = frame.url()
    console.log('-> Navigate to: ', url)
  })
}
