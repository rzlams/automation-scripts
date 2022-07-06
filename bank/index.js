const fs = require('fs').promises
const { parse } = require('node-html-parser')
const readline = require('../utils/readlineAsync')

const debug = false
const banksActions = {
  bancaribe: require('./bancaribe'),
  // banesco: require('./banesco')
}

const readDataFile = async (path) => {
  const data = await fs.readFile(path)
  return JSON.parse(data)
}

const getBankLists = (banks) => {
  const bankList = Object.keys(banks)

  const questionBankLists = bankList.reduce(
    (result, key, index) => {
      const number = String(index + 1)
      const text = `${number}.- ${key}`

      return {
        numbers: [...result.numbers, number],
        texts: [...result.texts, text],
      }
    },
    { numbers: [], texts: [] }
  )

  return { bankList, questionBankLists }
}

const getSelectedBankLists = (selectedBankDocTypeOrBankList) => {
  const questionSelectedBankLists = selectedBankDocTypeOrBankList.reduce(
    (result, item, index) => {
      const number = String(index + 1)
      const text = `${number}.- ${item.label}`

      return {
        numbers: [...result.numbers, number],
        texts: [...result.texts, text],
      }
    },
    { numbers: [], texts: [] }
  )

  return questionSelectedBankLists
}

const readCuentasFile = async (path) => {
  const html = await fs.readFile(path, 'utf8')
  return parse(html)
}

;(async () => {
  try {
    const dataFilePath = __dirname + '/data.json'
    const { config, banks } = await readDataFile(dataFilePath)

    const { bankList, questionBankLists } = getBankLists(banks)

    const rl = readline.open()
    const bankQuestions = [
      { text: () => `${questionBankLists.texts.join('\n')}\n-> Ingrese el numero del banco a usar: `, validAnswers: questionBankLists.numbers },
      {
        text: (answers) => `\nUsted selecciono: "${bankList[answers[0] - 1]}"\n\n-> Por favor, ingrese "1" para confirmar su seleccion: `,
        validAnswers: ['1'],
      },
    ]
    const [selectedBankNumber] = await rl.questionGroup(bankQuestions)

    const selectedBank = bankList[selectedBankNumber - 1]
    const selectedBankConfig = banks[selectedBank].config

    const cuentasFilePath = process.env.PWD + '/cuentas.html'
    const document = await readCuentasFile(cuentasFilePath)
    const username = document.querySelector(selectedBankConfig.usernameId).innerText
    const password = document.querySelector(selectedBankConfig.passwordId).innerText

    // pregunto que quiere: Consultar Saldo o Pago Movil
    const actions = { 1: 'Consultar saldo', 2: 'Pago movil', 3: 'Transferencia' }
    const selectedAction = await rl.question(
      `\n1.- ${actions['1']}\n2.- ${actions['2']}\n-> Ingrese el numero de la accion que desea: `,
      Object.keys(actions)
    )
    const selectedActionValue = actions[selectedAction]
    const selectedBankActions = banksActions[selectedBank]

    // Consultar Saldo
    if (selectedActionValue === actions['1']) {
      const getAccountBalance = selectedBankActions[selectedActionValue]

      const takeScreenshotOptions = { 1: 'SI', 2: 'NO' }
      const selectedTakeScreenshot = await rl.question(
        `\n1.- ${takeScreenshot['1']}\n2.- ${takeScreenshot['2']}\n-> Ingrese si desea tomar un screenshot: `,
        Object.keys(takeScreenshot)
      )

      // hago la consulta de saldo
      const bankConfig = {
        ...config,
        ...selectedBankConfig,
        takeScreenshot: takeScreenshotOptions[selectedTakeScreenshot] === takeScreenshot['1'],
        windowWidth: 1280,
        windowHeight: 720,
        pageIsMobile: false,
      }

      await getAccountBalance(bankConfig, debug)
    }

    // Pago Movil
    if (selectedActionValue === actions['2']) {
      const selectedBankDocTypeList = banks[selectedBank].docTypeList
      const selectedBankBankList = banks[selectedBank].bankList

      // pregunto si quiere hacer un pago movil frecuente o no
      const frequentPagoMovil = { 1: 'SI', 2: 'NO' }
      const selectedFrequentPagoMovil = await rl.question(
        `\n1.- ${frequentPagoMovil['1']}\n2.- ${frequentPagoMovil['2']}\n-> Ingrese si desea hacer un pago movil frecuente: `,
        Object.keys(frequentPagoMovil)
      )

      // Pago Movil Frecuente
      if (frequentPagoMovil[selectedFrequentPagoMovil] === frequentPagoMovil['1']) {
        // 1.- muestro la lista:
        // - Automatizar Pago Movil de Banesco a Bancaribe de carlos
        // - Automatizar Pago Movil de Banesco a Provincial de beatriz
        // - Automatizar Pago Movil de Bancaribe a Provincial de beatriz
      }

      // Nuevo Pago Movil
      if (frequentPagoMovil[selectedFrequentPagoMovil] === frequentPagoMovil['2']) {
        // 2.- pido que ingrese uno a uno los datos para el pago movil
        // banco receptor, phone, docType, docNumber, amount
        const questionDocTypeLists = getSelectedBankLists(selectedBankDocTypeList)
        const questionBankLists = getSelectedBankLists(selectedBankBankList)

        const pagoMovilQuestions = [
          {
            text: () => `${questionBankLists.texts.join('\n')}\n-> Ingrese el numero del banco a usar: `,
            validAnswers: questionBankLists.numbers,
          },
          {
            text: () => `\n-> Ingrese el numero telefonico: `,
          },
          {
            text: () => `${questionDocTypeLists.texts.join('\n')}\n-> Ingrese el numero del tipo de documento: `,
            validAnswers: questionDocTypeLists.numbers,
          },
          {
            text: () => `\n-> Ingrese el numero del documento: `,
          },
          {
            text: () => `\n-> Ingrese el monto del pago: `,
          },
          {
            // aca me falta mostrar el label de cada dato en la consola
            // con el mismo objeto que voy a enviar como pagoMovilConfig puedo formatear esto
            text: (answers) =>
              `\nUsted ingreso estos datos:\n"${answers.map((v) => `- ${v}`).join('\n')}"\n\n-> Por favor, ingrese "1" para confirmar: `,
            validAnswers: ['1'],
          },
        ]
        const pagoMovilAnswers = await rl.questionGroup(pagoMovilQuestions)
        // const pagoMovilConfig = pagoMovilAnswers
      }

      // pregunto si quiere screenshot del recibo o no
      const takeScreenshot = { 1: 'SI', 2: 'NO' }
      const selectedTakeScreenshot = await rl.question(
        `\n1.- ${takeScreenshot['1']}\n2.- ${takeScreenshot['2']}\n-> Ingrese si desea tomar un screenshot del recibo: `,
        Object.keys(takeScreenshot)
      )
      // FIN
    }

    rl.close()
  } catch (error) {
    console.log('======================================================')
    console.log('ERROR: ', error.message || error)
    console.log('STACK: ', error.stack)
    console.log('======================================================')
  }
})()
