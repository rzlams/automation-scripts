// pregunto con cual banco (de los mios) quiero hacer la operacion
// cargo configuracion del banco

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

// OTRO PROYECTO RELACIONADO
// No tener las cuentas en el html puro en el escritorio, en cambio tenerlo en un archivo comprimido con contraseña
// Agregar un alias en el bashrc que me permita descomprimirlo (me pida clave), abrirlo y borarlo con un solo comando
// Con un comando similar hacer que trabaje el codigo de aca que lee los datos del archivo de cuentas

;(async () => {
  const fs = require('fs').promises
  const { parse } = require('node-html-parser')

  const data = await fs.readFile('data.json')
  const { config, banks } = JSON.parse(data)
  console.log(config)
  console.log(Object.keys(banks))
  const bankList = Object.keys(banks)
  const html = await fs.readFile('../../../cuentas.html', 'utf8')
  const document = parse(html)
  const username = document.querySelector('#username-banesco').innerText
  const password = document.querySelector('#password-banesco').innerText
  console.log(username, password)
})()
