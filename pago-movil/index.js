const fs = require('fs').promises
const { parse } = require('node-html-parser')
const readline = require('../utils/readlineAsync')

;(async () => {
  try {
    const data = await fs.readFile(__dirname + '/data.json')
    const { config, banks } = JSON.parse(data)

    const bankList = Object.keys(banks)
    const questionBank = bankList.reduce(
      (result, key, index) => {
        const number = String(index + 1)
        const text = `${number}.- ${key}`

        return {
          numbers: [...result.numbers, number],
          list: [...result.list, text],
        }
      },
      { numbers: [], list: [] }
    )

    const rlBank = readline.open()
    const bankQuestions = [
      { text: () => `${questionBank.list.join('\n')}\n-> Ingrese el numero del banco a usar: `, validAnswers: questionBank.numbers },
      {
        text: (answers) => `\nUsted selecciono: "${bankList[answers[0] - 1]}"\n\n-> Por favor, ingrese "1" para confirmar su seleccion: `,
        validAnswers: ['1'],
      },
    ]
    const [answerBankNumber] = await rlBank.questionGroup(bankQuestions)
    rlBank.close()

    const selectedBank = bankList[answerBankNumber - 1]
    const selectedBankConfig = banks[selectedBank].config

    const html = await fs.readFile(process.env.PWD + '/cuentas.html', 'utf8')
    const document = parse(html)
    const username = document.querySelector(selectedBankConfig.usernameId).innerText
    const password = document.querySelector(selectedBankConfig.passwordId).innerText

    // pregunto si quiere 1consultar saldo o 2hacer pago movil

    // 1.- pregunto de que banco quiere consultar saldo
    // pregunto si quiere 1screenshot de los movimientos o 2no

    // hago la consulta
    // FIN

    // 2.- pregunto si quiere hacer un 1pago movil recurrente o 2a alguien diferente

    // 1.- muestro la lista:
    // 1- Automatizar Pago Movil de Banesco a Bancaribe de carlos
    // 2- Automatizar Pago Movil de Banesco a Provincial de beatriz
    // 3- Automatizar Pago Movil de Bancaribe a Provincial de beatriz

    // 2.- pido que ingrese uno a uno los datos para el pago movil
    // banco receptor, phone, docType, docNumber, amount

    // pregunto si quiere 1screenshot del recibo o 2no
    // FIN
  } catch (error) {
    console.log('======================================================')
    console.log('ERROR: ', error.message || error)
    console.log('STACK: ', error.stack)
    console.log('======================================================')
  }
})()
