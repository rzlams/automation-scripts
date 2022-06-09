/*
DOCUMENTACION
https://pocketadmin.tech/en/puppeteer-generate-pdf/#range
*/
// TODO: Parsear la carpeta input y setear automatcamente las caracteristicas
// de cada archivo en las options para que el output sea igual al input en html
const puppeteer = require('puppeteer')

;(async () => {
  try {
    const browser = await puppeteer.launch()
    const page = await browser.newPage()
    const inputPath = 'home/lam/Desktop/www/static_pages/curriculum_vitae/developer_cv/'
    const filename = 'en_developer_cv.html'
    const curriculumPDFOptions = {
      format: 'Letter',
    }
/*
    const inputPath = 'home/lam/Desktop/www/upwork/cotizacion/'
    const filename = 'index.html'
    const cotizacionPDFOptions = {
      width: '39cm',
      height: '22cm',
      scale: 1,
      preferCSSPageSize: false,
    }
*/
    await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 2 })

    await page.goto(`file:///${inputPath}${filename}`, {
      waitUntil: 'networkidle2',
    })

    await page.pdf({
      ...curriculumPDFOptions,
      //...cotizacionPDFOptions,
      path: `./output/${filename}.pdf`,
      printBackground: true,
      // pageRanges: '1-3', // cantidad de paginas que se quiere en el output
    })
    await browser.close()
  } catch (error) {
    console.log(error)
    await browser.close()
  }
})()
