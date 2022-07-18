const login = require('./login')
const { getPageUtils } = require('../../utils/puppeteer')
const { getClient, fetchMessage, trashMessage } = require('../../utils/gmail')

const debug = false // when true shows logs and the actions in the browser

const pagoMovil = async (bankConfig, debug) => {
  const page = await login(bankConfig, debug)

  if (!page) return

  const { clearInput, typeAndConfirm } = getPageUtils(page, debug)

  // Input Pago Movil data
  const pagoMovilButton = await page.waitForSelector('div#dropup_menu_icons_ini div.row div:first-child')
  await pagoMovilButton.click()
  console.log(`-> Pago Movil button clicked`)

  const phoneInput = await clearInput('input#num_celular_beneficiario')
  // await phoneInput.type(phone)
  await typeAndConfirm(phoneInput, bankConfig.phone)
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

  if (amount > amountLimit) return console.log(`-> ACTION REQUIRED - The amount exceeds the automation limit`)

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
  // if (!debug) await browser.close()
}

// const getClient = require('./getClient')
// const fetchMessage = require('./fetchMessage')

// ;(async () => {
//   const gmail = await getClient()
//   const bankConfig = {
//     emailFrom: 'conexion.bancaribe@bancaribe.com.ve',
//     emailSubject: 'Clave de Operaciones Especiales',
//     fetchAttemptsLimit: '9',
//     secondsBetweenFetchAttempts: '10',
//   }

//   const message = await fetchMessage(gmail, bankConfig)
//   console.log(message)
// })()

// ;(async () => {
//   const config = {
//     amountLimit: 25,
//   }

//   const bankConfig = {
//     ...config,
//     amountFractionSeparator: ',',
//     amountDecimalLength: 2,
//     loginUrl: 'https://www5.bancaribe.com.ve/bcm/',
//     usernameId: '#username-bancaribe',
//     passwordId: '#password-bancaribe',
//     emailFrom: 'conexion.bancaribe@bancaribe.com.ve',
//     emailSubject: 'Clave de Operaciones Especiales',
//     fetchAttemptsLimit: '9',
//     secondsBetweenFetchAttempts: '10',
//     username: 'cams99',
//     password: 'BAN$13sar',
//     windowWidth: 1280,
//     windowHeight: 720,
//     pageIsMobile: false,
//     takeScreenshot: true,
//   }

//   const debug = true

//   pagoMovil(bankConfig, debug)
// })()

module.exports = pagoMovil
