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

  // https://stackoverflow.com/questions/47070433/how-to-intercept-request-in-puppeteer-before-current-page-is-left
  page.on('framenavigated', (frame) => {
    const url = frame.url()
    console.log('-> Navigate to: ', url)
  })

  console.log(`-> New page created`)
  await page.goto(bankConfig.loginUrl, { waitUntil: 'networkidle2' })

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

  const hasError = await waitForEvent(page, 'response', loginResponseHasErrorHandler)

  if (hasError) {
    const loginError = await page.evaluate(getLoginErrorText)

    console.log(`-> Login error: ${loginError}`)

    if (!debug) await browser.close()
  } else {
    return page
  }
}

function getLoginErrorText() {
  const element = document.querySelector('#form_error_error')
  return element && element.innerText
}

async function loginResponseHasErrorHandler(response) {
  const request = response.request()

  if (request.url().includes('https://www5.bancaribe.com.ve/bcm/action/web/security/login')) {
    const text = await response.text()

    const hasError = text && text.includes('form_error')

    return { resolve: () => hasError }
  }
}
// PASAR ESTO A LOS PAGE UTILS
async function waitForEvent(page, eventName, callback) {
  return new Promise((resolve, reject) => {
    async function handler(response) {
      try {
        const result = await callback(response)

        if (result && typeof result.reject === 'function') {
          const resultError = result.reject()
          throw new Error(resultError)
        }

        if (result && typeof result.resolve === 'function') {
          const resultValue = result.resolve()
          console.log(`-> ${eventName} listener result: ${resultValue}`)
          removeListener()
          resolve(resultValue)
        }
      } catch (error) {
        console.log(`-> ${eventName} listener error: ${error.message}`)
        removeListener()
        reject(error.message)
      }
    }

    function removeListener() {
      console.log(`-> ${eventName} listeners count: ${page.listenerCount(eventName)}`)
      page.off(eventName, handler)
      console.log(`-> ${eventName} listeners count: ${page.listenerCount(eventName)}`)
    }

    page.on('response', handler)
  })
}
