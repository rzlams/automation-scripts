// const main = require('./fetchEmailFromGmail')
// main().catch((e) => {
//   console.error(e)
//   throw e
// })

// TODO: agregar README.md con installation, gmail setup and usage
function validateAmount(formattedAmount, fractionSeparator, decimalsLength) {
  if (!formattedAmount) throw new Error(`Invalid amount - No falsy values allowed`)
  if (formattedAmount.indexOf('.') >= 0) throw new Error(`Invalid amount - No dot allowed`)
  if (formattedAmount.indexOf(fractionSeparator) < 0) throw new Error(`Invalid amount - Decimals required`)

  const decimals = formattedAmount.split(fractionSeparator)[1]
  if (decimals.length !== decimalsLength) throw new Error(`Invalid amount - Two decimals required`)

  return formattedAmount
}

function unformatAmount(validatedAmount, fractionSeparator) {
  return validatedAmount.replace(fractionSeparator, '')
}

require('dotenv').config({ path: __dirname + '/.env' })
const puppeteer = require('puppeteer')
const { getPageUtils } = require('../utils')

const debug = false // when true shows logs and the actions in the browser
const iPhone = puppeteer.devices['iPhone 6']

;(async () => {
  // Pago movil config
  const fractionSeparator = process.env.AMOUNT_FRACTION_SEPARATOR
  const decimalsLength = Number(process.env.AMOUNT_DECIMALS_LENGTH)
  const amountLimit = process.env.AMOUNT_LIMIT
  const loginPageUrl = process.env.LOGIN_PAGE_URL
  const username = process.env.USERNAME
  const password = process.env.PASSWORD
  // Pago movil data
  const phone = process.env.PHONE
  const docType = process.env.DOCUMENT_TYPE
  const docNumber = process.env.DOCUMENT_NUMBER
  const bank = process.env.BANK
  const formattedAmount = process.env.AMOUNT
  const validatedAmount = validateAmount(formattedAmount, fractionSeparator, decimalsLength)
  const amount = unformatAmount(validatedAmount, fractionSeparator)

  // create browser
  const browser = await puppeteer.launch({ headless: amount <= amountLimit && !debug, ignoreHTTPSErrors: true })
  const page = await browser.newPage()
  const { clearInput } = getPageUtils(page, debug)
  await page.emulate(iPhone)
  console.log(`-> New page created`)

  // bancaribe.com.ve
  await page.goto(loginPageUrl, { waitUntil: 'networkidle2' })
  console.log(`-> Page loaded: ${loginPageUrl}`)

  // login
  const usernameInput = await clearInput('input#userlogin')
  await usernameInput.type(username)
  console.log(`-> Username input value set: ${username}`)

  const passwordInput = await clearInput('input#passwd')
  await passwordInput.type(password)
  console.log(`-> Password input value set: ${password}`)

  const loginButton = await page.waitForSelector('button[type="submit"]')
  await loginButton.click()
  console.log(`-> Login form submitted`)

  // Input Pago Movil data
  const pagoMovilButton = await page.waitForSelector('div#dropup_menu_icons_ini div.row div:first-child')
  await pagoMovilButton.click()
  console.log(`-> Pago Movil button clicked`)

  const phoneInput = await clearInput('input#num_celular_beneficiario')
  await phoneInput.type(phone)
  console.log(`-> Password input value set: ${phone}`)

  const docTypeInput = await page.waitForSelector('select#cedula_beneficiario1')
  await docTypeInput.type(docType)

  const docNumberInput = await clearInput('input#cedula_beneficiario2')
  await docNumberInput.type(docNumber)
  console.log(`-> Document number input value set: ${docNumber}`)

  const bankInput = await page.waitForSelector('select#banco_beneficiario')
  await bankInput.type(bank)

  const amountInput = await clearInput('input#monto')
  await amountInput.type(amount)
  console.log(`-> Amount input value set: ${amount}`)

  const nextStepButton = await page.waitForSelector('button#status_submit1_btn')
  await nextStepButton.click()
  console.log(`-> Next step button clicked`)

  if (amount > amountLimit) {
    return console.log(`-> ACTION REQUIRED - The amount exceeds the automation limit`)
  }

  // Verify Pago Movil data
  // Verificar los datos que muestra la web para confirmar la transaccion con los que recibo del .env
  // Verificar si muestra el mensaje de que el monto es superior al saldo en la cuenta
  // Si alguno no coincide paro la ejecucion del script y muestro un log

  // Confirm Pago Movil
  // Click button de siguiente/confirmar

  // Si hizo el pago movil entonces guardo un screenshot del comprobante,  cierro sesion y el browser
  // ELSE

  // seleccionar mi correo para enviar el codigo de confirmacion

  // click en boton de siguiente

  // obtener codigo del correo

  // escribir codigo de confirmacion

  // dar click al boton de siguiente

  // Si hizo el pago movil entonces guardo un screenshot del comprobante,  cierro sesion y el browser
  // ELSE

  // paro la ejecucion sin cerrar el browser para ver que paso
  if (!debug) await browser.close()
})()
