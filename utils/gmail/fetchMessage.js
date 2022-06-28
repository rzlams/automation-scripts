const delay = require('../delay')

module.exports = async (gmail, bankConfig) => {
  const { emailFrom, emailSubject, fetchAttemptsLimit, secondsBetweenFetchAttempts } = bankConfig

  return getConfirmationCodeAndTrashMessage()

  async function getConfirmationCodeAndTrashMessage(fetchAttemptCounter = 1) {
    if (fetchAttemptCounter > fetchAttemptsLimit) return console.log(`-> ATTEMPTS LIMIT REACHED - No code message found`)

    console.log(`-> Waiting to fetch code message...`)

    await delay(secondsBetweenFetchAttempts * 1000)

    console.log(`-> Fetch attempt: ${fetchAttemptCounter}`)

    const list = await gmail.users.messages.list({
      userId: 'me',
      q: `in:inbox from:(${emailFrom}) subject:(${emailSubject}) is:unread`,
    })

    if (list.data.resultSizeEstimate === 0) {
      console.log(`-> No messages found`)
      const newFetchAttemptCounter = fetchAttemptCounter + 1
      return getConfirmationCodeAndTrashMessage(newFetchAttemptCounter)
    }

    console.log(`-> Messages listed: ${JSON.stringify(list.data.messages, null, 2)}`)

    const messageId = list.data.messages[0].id

    const message = await gmail.users.messages.get({
      userId: 'me',
      id: messageId,
      format: 'full',
    })

    return message
  }
}
