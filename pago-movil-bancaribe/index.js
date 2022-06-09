require('dotenv').config({ path: __dirname + '/.env' })
const puppeteer = require('puppeteer')
const { showLogs } = require('../common/showLogs')

const debug = false // when true shows logs and the actions in the browser
const windowWidth = 1280
const windowHeight = 720

;(async () => {
  const username = process.env.USERNAME
  const password = process.env.PASSWORD
  const loginPageUrl = process.env.LOGIN_PAGE_URL

  // create browser
  const browser = await puppeteer.launch({ headless: !debug, ignoreHTTPSErrors: true, args: [`--window-size=${windowWidth},${windowHeight}`] })
  const page = await browser.newPage()
  await page.setViewport({ width: windowWidth, height: windowHeight, deviceScaleFactor: 1 })
  console.log(`New page created`)

  showLogs(page, debug)

  // paris.cl
  await page.goto(parisUrl, { waitUntil: 'networkidle2' })
  console.log(`Page loaded: ${parisUrl}`)

  const emailInput = await page.waitForSelector('.App-login input[name="email"]')
  await emailInput.type(parisEmail)
  console.log(`Email input value set: ${parisEmail}`)

  const passwordInput = await page.waitForSelector('.App-login input[name="password"]')
  await passwordInput.type(parisPassword)
  console.log(`Password input value set: ${parisPassword}`)

  const loginButton = await page.waitForSelector('.App-login button[type="submit"]')
  await loginButton.click()
  console.log(`Login form submitted`)

  await page.waitForSelector('button#Stock')
  const pageStoragesArray = await page.cookies()
  const { value: jwt } = pageStoragesArray.find((item) => item.name === 'jwt')
  console.log(`JWT copied from localStorage:
  ${jwt}
  `)

  // if (!debug) await browser.close()
})()
