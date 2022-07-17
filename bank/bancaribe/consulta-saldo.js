const login = require('./login')
const { getAttribute } = require('../../utils/puppeteer')
const { default: fullPageScreenshot } = require('puppeteer-full-page-screenshot')

const consulta = async (bankConfig, debug) => {
  const page = await login(bankConfig, debug)
  return
  // esto podria ser una async function - await clickUntilDissapear(callback, selector)
  const balanceDetailLinkSelector = 'div.btn.btn-default.instrbank'
  const balanceDetailLink = await page.waitForSelector(balanceDetailLinkSelector)
  let balanceDetailLinkIsVisible = true
  do {
    balanceDetailLinkIsVisible = await page.evaluate(evaluateLinkVisibility, balanceDetailLinkSelector)

    if (balanceDetailLinkIsVisible) await balanceDetailLink.click()
  } while (balanceDetailLinkIsVisible)

  const balanceElement = await page.waitForSelector('#saldo_disponible')
  const balance = await getAttribute(balanceElement, 'innerText')

  console.log(`
  -> SALDO ACTUAL: ${balance}`)

  if (bankConfig.takeScreenshot) {
    const balanceDetailSelect = await page.waitForSelector('div#tableum_length > label > select')
    await balanceDetailSelect.type('100')

    const headerSelector = '#navbar_header'
    const footerSelector = '#footerID'

    await page.evaluate(hideHeaderAndFooter, { headerSelector, footerSelector })

    await fullPageScreenshot(page, { path: '../screenshots/' + new Date().toISOString() + '.png' })
    console.log(`-> Screenshot taken`)

    await page.evaluate(restoreHeaderAndFooter, { headerSelector, footerSelector })
  }
}

function evaluateLinkVisibility(selector) {
  const element = document.querySelector(selector)
  return !!element
}

function hideHeaderAndFooter({ headerSelector, footerSelector }) {
  const headerElement = document.querySelector(headerSelector)
  const footerElement = document.querySelector(footerSelector)

  headerElement.style.display = 'none'
  footerElement.style.display = 'none'
}

function restoreHeaderAndFooter({ headerSelector, footerSelector }) {
  const headerElement = document.querySelector(headerSelector)
  const footerElement = document.querySelector(footerSelector)

  headerElement.style.display = 'block'
  footerElement.style.display = 'block'
}

;(async () => {
  const config = {
    amountLimit: 25,
  }

  const bankConfig = {
    ...config,
    amountFractionSeparator: ',',
    amountDecimalLength: 2,
    loginUrl: 'https://www5.bancaribe.com.ve/bcm/',
    usernameId: '#username-bancaribe',
    passwordId: '#password-bancaribe',
    emailFrom: 'conexion.bancaribe@bancaribe.com.ve',
    emailSubject: 'Clave de Operaciones Especiales',
    fetchAttemptsLimit: '9',
    secondsBetweenFetchAttempts: '10',
    username: 'cams99',
    password: 'BAN$13sar',
    windowWidth: 1280,
    windowHeight: 720,
    pageIsMobile: false,
    takeScreenshot: true,
  }

  const debug = true

  await consulta(bankConfig, debug)
})()

module.exports = consulta
