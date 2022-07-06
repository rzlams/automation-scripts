module.exports = (formattedAmount, fractionSeparator, decimalsLength) => {
  if (!formattedAmount) throw new Error(`Invalid amount - No falsy values allowed`)
  if (formattedAmount.indexOf('.') >= 0) throw new Error(`Invalid amount - No dot allowed`)
  if (formattedAmount.indexOf(fractionSeparator) < 0) throw new Error(`Invalid amount - Decimals required`)

  const decimals = formattedAmount.split(fractionSeparator)[1]
  if (decimals.length !== decimalsLength) throw new Error(`Invalid amount - Two decimals required`)

  return formattedAmount
}
