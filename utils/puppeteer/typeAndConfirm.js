module.exports = async (element, value) => {
  await element.type(value)

  if (usernameInput.value !== username) throw new Error(`Value ${value} has not been set`)
}
