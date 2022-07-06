module.exports = (validatedAmount, fractionSeparator) => {
  return validatedAmount.replace(fractionSeparator, '')
}
