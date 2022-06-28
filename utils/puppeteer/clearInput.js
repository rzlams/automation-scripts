module.exports = (page) => async (selector) => {
  const input = await page.waitForSelector(selector)
  await page.focus(selector)
  await page.keyboard.down('Control')
  await page.keyboard.press('A')
  await page.keyboard.up('Control')
  await page.keyboard.press('Backspace')

  return input
}
