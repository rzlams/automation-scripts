// TODO: Hacer CLI que al correr el comando vaya pidiendo los input que necesite
require('dotenv').config({ path: __dirname + '/.env' })
const puppeteer = require('puppeteer')
const { getPageUtils } = require('../utils')

const debug = true // when true shows logs and the actions in the browser
const iPhone = puppeteer.devices['iPhone 6']

function formatNumberWithTwoDecimals(inputNumber) {
  const fractionSeparator = '.'
  const num = Number(inputNumber)

  if (Number.isNaN(num)) throw new Error(`Invalid amount - ${inputNumber}`)

  const roundedNumber = Math.round((num + Number.EPSILON) * 100) / 100
  const roundedNumberAsString = String(roundedNumber)

  if (roundedNumberAsString.indexOf(fractionSeparator) < 0) return roundedNumberAsString.padEnd(3, 0)

  const splittedNumber = roundedNumberAsString.split(fractionSeparator)
  const integers = splittedNumber[0]
  const decimals = splittedNumber[1].padEnd(2, 0)

  return `${integers}${decimals}`
}

;(async () => {
  const username = process.env.USERNAME
  const password = process.env.PASSWORD
  const loginPageUrl = process.env.LOGIN_PAGE_URL
  const phone = process.env.PHONE
  const docType = process.env.DOCUMENT_TYPE
  const docNumber = process.env.DOCUMENT_NUMBER
  const bank = process.env.BANK
  const amount = formatNumberWithTwoDecimals(process.env.AMOUNT)

  // create browser
  const browser = await puppeteer.launch({ headless: !debug, ignoreHTTPSErrors: true })
  const page = await browser.newPage()
  const { clearInput } = getPageUtils(page, debug)
  await page.emulate(iPhone)
  console.log(`New page created`)

  // bancaribe.com.ve
  await page.goto(loginPageUrl, { waitUntil: 'networkidle2' })
  console.log(`Page loaded: ${loginPageUrl}`)

  const usernameInput = await clearInput('input#userlogin')
  await usernameInput.type(username)
  console.log(`Username input value set: ${username}`)

  const passwordInput = await clearInput('input#passwd')
  await passwordInput.type(password)
  console.log(`Password input value set: ${password}`)

  const loginButton = await page.waitForSelector('button[type="submit"]')
  await loginButton.click()
  console.log(`Login form submitted`)

  const pagoMovilButton = await page.waitForSelector('div#dropup_menu_icons_ini div.row div:first-child')
  await pagoMovilButton.click()
  console.log(`Pago Movil button clicked`)

  const phoneInput = await clearInput('input#num_celular_beneficiario')
  await phoneInput.type(phone)
  console.log(`Password input value set: ${phone}`)

  const docTypeInput = await page.waitForSelector('select#cedula_beneficiario1')
  await docTypeInput.type(docType)

  const docNumberInput = await clearInput('input#cedula_beneficiario2')
  await docNumberInput.type(docNumber)
  console.log(`Document number input value set: ${docNumber}`)

  const bankInput = await page.waitForSelector('select#banco_beneficiario')
  await bankInput.type(bank)

  const amountInput = await clearInput('input#monto')
  await amountInput.type(amount)
  console.log(`Amount input value set: ${amount}`)

  const nextStepButton = await page.waitForSelector('button#status_submit1_btn')
  await nextStepButton.click()
  console.log(`Next Step button clicked`)

  // if (!debug) await browser.close()
})()
