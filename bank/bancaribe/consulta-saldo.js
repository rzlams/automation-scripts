const login = require('./login')
const { getAttribute } = require('../../utils/puppeteer')
const { default: fullPageScreenshot } = require('puppeteer-full-page-screenshot')
const { getPageUtils } = require('../../utils/puppeteer')

module.exports = async (bankConfig, debug) => {
  const page = await login(bankConfig, debug)

  if (!page) return

  const { waitForEvent } = getPageUtils(page, debug)

  await waitForEvent('response', accountBalanceResponseHandler)

  const balanceDetailLink = await page.waitForSelector('div.btn.btn-default.instrbank')
  await balanceDetailLink.click()

  const balanceElement = await page.waitForSelector('#saldo_disponible')
  const balance = await getAttribute(balanceElement, 'innerText')

  console.log(`
  -> SALDO ACTUAL: ${balance}
  `)

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

async function accountBalanceResponseHandler(response) {
  const request = response.request()

  if (request.url().includes('https://www5.bancaribe.com.ve/bcm/action/app/v1/business/consultaglobal/saldo')) {
    return true
  }
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
