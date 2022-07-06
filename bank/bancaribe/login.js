const puppeteer = require('puppeteer')
const { getPageUtils, typeAndConfirm } = require('../../utils/puppeteer')

module.exports = async (bankConfig, debug) => {
  const browser = await puppeteer.launch({
    headless: !debug,
    ignoreHTTPSErrors: true,
    args: [`--window-size=${bankConfig.windowWidth},${bankConfig.windowHeight}`],
  })
  const page = await browser.newPage()
  const { clearInput } = getPageUtils(page, debug)

  if (bankConfig.pageIsMobile) {
    const iPhone = puppeteer.devices['iPhone 6']
    await page.emulate(iPhone)
  } else {
    await page.setViewport({ width: bankConfig.windowWidth, height: bankConfig.windowHeight, deviceScaleFactor: 1 })
  }

  console.log(`-> New page created`)

  await page.goto(bankConfig.loginUrl, { waitUntil: 'networkidle2' })
  console.log(`-> Page loaded: ${bankConfig.loginUrl}`)

  const usernameInput = await clearInput('input#userlogin')
  await typeAndConfirm(usernameInput, bankConfig.username)
  console.log(`-> Username input value set: ${bankConfig.username}`)

  const passwordInput = await clearInput('input#passwd')
  await typeAndConfirm(passwordInput, bankConfig.password)
  console.log(`-> Password input value set: ${bankConfig.password}`)

  // https://stackoverflow.com/questions/47407791/how-to-click-on-element-with-text-in-puppeteer
  const [loginButton] = await page.$x("//button[contains(., 'Ingresar')]")
  await loginButton.click()
  console.log(`-> Login form submitted`)

  return page
}
