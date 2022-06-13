module.exports = async (gmail, bankConfig, fetchAttemptCounter = 1) => {
  const { emailFrom, emailSubject, fetchAttemptsLimit, secondsBetweenFetchAttempts } = bankConfig

  try {
    if (fetchAttemptCounter > fetchAttemptsLimit) return console.log(`-> ATTEMPTS LIMIT REACHED - No code message found`)

    console.log(`-> Waiting to fetch code message...`)

    const delay = require('../delay')
    await delay(secondsBetweenFetchAttempts * 1000)

    console.log(`-> Fetch attempt: ${fetchAttemptCounter}`)

    const list = await gmail.users.messages.list({
      userId: 'me',
      q: `in:inbox from:(${emailFrom}) subject:(${emailSubject}) is:unread`,
    })

    if (list.data.resultSizeEstimate === 0) {
      console.log(`-> No messages found`)
      const newFetchAttemptCounter = fetchAttemptCounter + 1
      return getConfirmationCodeAndTrashMessage(gmail, bankConfig, newFetchAttemptCounter)
    }

    console.log(`-> Messages listed: ${JSON.stringify(list.data.messages, null, 2)}`)

    const messageId = list.data.messages[0].id

    const message = await gmail.users.messages.get({
      userId: 'me',
      id: messageId,
      format: 'full',
    })

    return message
  } catch (error) {
    console.log('The API returned an error: ' + error)
  }
}
