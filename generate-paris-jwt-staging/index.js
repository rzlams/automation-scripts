require('dotenv').config()
const puppeteer = require('puppeteer')

const debug = false // when true shows logs and the actions in the browser
const windowWidth = 1280
const windowHeight = 720

;(async () => {
  const parisUrl = process.env.PARIS_MARKETPLACE_URL
  const parisEmail = process.env.PARIS_LOGIN_EMAIL
  const parisPassword = process.env.PARIS_LOGIN_PASSWORD
  const jwtDebuggerUrl = process.env.JWT_DEBUGGER_URL
  const jwtReplaceValues = { seller_id: process.env.JWT_SELLER_ID, seller_type: process.env.JWT_SELLER_TYPE }
  const jwtSecret = process.env.JWT_SECRET

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
  const pageLocalStorageArray = await page.cookies()
  const { value: jwt } = pageLocalStorageArray.find((item) => item.name === 'jwt')
  console.log(`JWT copied from localStorage: ${jwt}`)

  // jwt.io
  await page.goto(jwtDebuggerUrl, { waitUntil: 'networkidle2' })
  console.log(`Page loaded: ${jwtDebuggerUrl}`)

  const context = await browser.defaultBrowserContext()
  await context.overridePermissions(jwtDebuggerUrl, ['clipboard-read', 'clipboard-write'])

  const jwtSecretInput = await page.waitForSelector('span#hmacsha-text + input[name="secret"]')
  await jwtSecretInput.type(jwtSecret)
  console.log(`JWT secret value set: ${jwtSecret}`)

  const updatedJwt = await page.evaluate(updateJwtHandler, { jwt, jwtReplaceValues })

  console.log('============================== UPDATED TOKEN ====================================')
  console.log('')
  console.log(updatedJwt)
  console.log('')
  console.log('=================================================================================')

  await page.evaluate(copyToClipboard, updatedJwt)

  await browser.close()
})()

function showLogs(page, debug) {
  if (!debug) return

  page.on('console', async (msg) => {
    const args = await msg.args()
    args.forEach(async (arg) => {
      const val = await arg.jsonValue()
      // value is serializable
      if (JSON.stringify(val) !== JSON.stringify({})) console.log(val)
      // value is unserializable (or an empty oject)
      else {
        const { type, subtype, description } = arg._remoteObject
        console.log(`type: ${type}, subtype: ${subtype}, description:\n ${description}`)
      }
    })
  })
}

function updateJwtHandler({ jwt, jwtReplaceValues }) {
  const editorsArray = Array.from(document.querySelectorAll('.CodeMirror'))
  const editorsObject = editorsArray.reduce(
    (result, item) => {
      const payloadHeight = result.payload?.doc?.height || 0

      if (item.CodeMirror.options.mode === 'jwt') return { ...result, jwt: item.CodeMirror }

      if (item.CodeMirror.doc.height >= payloadHeight) return { ...result, payload: item.CodeMirror }

      return { ...result, header: item.CodeMirror }
    },
    { jwt: {}, header: {}, payload: {} }
  )

  editorsObject.jwt.getDoc().setValue(jwt)
  console.log(`JWT debugger value set: ${jwt}`)

  const jwtPayload = JSON.parse(editorsObject.payload.getDoc().getValue())
  const updatedJwtPayload = JSON.stringify({ ...jwtPayload, ...jwtReplaceValues })
  editorsObject.payload.getDoc().setValue(updatedJwtPayload)
  console.log(`JWT payload value updated: ${updatedJwtPayload}`)

  return editorsObject.jwt.getDoc().getValue()
}

// Falla con este error relacionado con Puppeteer -> DOMException: Write permission denied
async function copyToClipboard(text) {
  var input = document.createElement('input')
  input.setAttribute('value', text)

  input.select()
  input.setSelectionRange(0, 99999)

  return navigator.clipboard
    .writeText(input.value)
    .then(() => {
      console.log(`Updated JWT copied to clipboard`)
    })
    .catch((e) => {
      console.log('COPY TO CLIPBOARD ERROR')
      console.log(e)
    })
    .finally(() => input.remove())
}
