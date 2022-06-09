const puppeteer = require('puppeteer')
const { showLogs } = require('../common/showLogs')

const debug = false // when true shows logs and the actions in the browser
const windowWidth = 1440
const windowHeight = 900

;(async () => {
  // create browser
  const browser = await puppeteer.launch({ headless: !debug, args: [`--window-size=${windowWidth},${windowHeight}`] })
  const page = await browser.newPage()
  await page.setViewport({ width: windowWidth, height: windowHeight, deviceScaleFactor: 2 })

  showLogs(page, debug)

  // const { inputPath, filename, options } = getQuotationData()
  const { inputPath, filename, options } = getResumeData()

  // Open file
  await page.goto(`file:///${inputPath}${filename}`, { waitUntil: 'networkidle2' })

  // Generate PDF
  await page.pdf({
    ...options,
    path: `./output/${filename}.pdf`,
  })

  await browser.close()
})()

function getResumeData() {
  const inputPath = __dirname + './../../static_pages/curriculum_vitae/developer_cv/'
  const filename = 'en_developer_cv.html'
  const options = { format: 'Letter', printBackground: true }

  return { inputPath, filename, options }
}

function getQuotationData() {
  const inputPath = __dirname + './../../upwork/cotizacion/'
  const filename = 'index.html'
  const options = {
    width: '39cm',
    height: '22cm',
    scale: 1,
    preferCSSPageSize: false,
    // pageRanges: '1-3', // cantidad de paginas que se quiere en el output
  }

  return { inputPath, filename, options }
}
