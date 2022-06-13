module.exports = async (gmail, message) => {
  console.log('==============================')
  console.log(message)
  console.log('==============================')
  const messageId = message.id

  await gmail.users.messages.trash({
    userId: 'me',
    id: messageId,
  })

  console.log(`-> Message trashed`)
}
