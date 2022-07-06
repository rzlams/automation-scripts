module.exports = async (element, attribute) => {
  const property = await element.getProperty(attribute)
  return await property.jsonValue()
}
