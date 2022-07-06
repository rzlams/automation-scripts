module.exports = (getElementHandleProperty) => async (element, value) => {
  await element.type(value)
  const elementValue = await getElementHandleProperty(element, 'value')

  if (elementValue !== value) throw new Error(`Value ${value} has not been set`)
}
