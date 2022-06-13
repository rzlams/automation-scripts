module.exports = (message, bankName) => {
  const extractionFunctions = {
    bancaribe: exctractFromSnippet,
    banesco: exctractFromSnippet,
  }

  const extractFunction = extractionFunctions[bankName]

  if (typeof extractFunction === 'function') throw new Error('Invalid bankName')

  const confirmationCode = extractFunction(message)

  console.log(`-> Code got: ${confirmationCode}`)

  return confirmationCode
}

function exctractFromSnippet(message) {
  console.log(`-> Message got: ${message.data.snippet}`)

  const regExpToMatchNumber = /\d+/gi
  return message.data.snippet.match(regExpToMatchNumber)[0]
}
