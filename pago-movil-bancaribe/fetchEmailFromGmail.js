// npm install googleapis

// Debi crear un ID de cliente de OAuth2 aca:
// https://console.cloud.google.com/apis/api/gmail.googleapis.com/credentials

// Luego descargue el json de las credenciales que cree en el paso anterior y nombre el archivo credentials.json

// Al correr el script te muestra en consola un link para que te autentiques en el navegador
// Luego de seguir todos los pasos para autenticarse, al final del proceso
// Te redirige a una url que trae el parametro "code". El valor de ese parametro es el que pide en la consola

// al final estan las funciones que hacen las consultas a la api, luego de autenticarse

// TODO: pasar las credentials.json al .env
// TODO: mover toda la autenticacion/autorizacion a una funcion aparte

module.exports = async () => {
  const fs = require('fs')
  const readline = require('readline')
  const { google } = require('googleapis')

  // If modifying these scopes, delete token.json.
  const SCOPES = ['https://www.googleapis.com/auth/gmail.readonly', 'https://www.googleapis.com/auth/gmail.modify']
  // The file token.json stores the user's access and refresh tokens, and is
  // created automatically when the authorization flow completes for the first
  // time.
  const TOKEN_PATH = 'token.json'

  // Load client secrets from a local file.
  fs.readFile('credentials.json', (err, content) => {
    if (err) return console.log('Error loading client secret file:', err)
    // Authorize a client with credentials, then call the Gmail API.
    authorize(JSON.parse(content), getConfirmationCodeAndTrashMessage)
  })

  /**
   * Create an OAuth2 client with the given credentials, and then execute the
   * given callback function.
   * @param {Object} credentials The authorization client credentials.
   * @param {function} callback The callback to call with the authorized client.
   */
  function authorize(credentials, callback) {
    const { client_secret, client_id, redirect_uris } = credentials.web
    const oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0])

    // Check if we have previously stored a token.
    fs.readFile(TOKEN_PATH, (err, token) => {
      if (err) return getNewToken(oAuth2Client, callback)
      oAuth2Client.setCredentials(JSON.parse(token))
      callback(oAuth2Client)
    })
  }

  /**
   * Get and store new token after prompting for user authorization, and then
   * execute the given callback with the authorized OAuth2 client.
   * @param {google.auth.OAuth2} oAuth2Client The OAuth2 client to get token for.
   * @param {getEventsCallback} callback The callback for the authorized client.
   */
  function getNewToken(oAuth2Client, callback) {
    const authUrl = oAuth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: SCOPES,
    })
    console.log('Authorize this app by visiting this url:', authUrl)
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    })
    rl.question('Enter the code from that page here: ', (code) => {
      rl.close()
      oAuth2Client.getToken(code, (err, token) => {
        if (err) return console.error('Error retrieving access token', err)
        oAuth2Client.setCredentials(token)
        // Store the token to disk for later program executions
        fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
          if (err) return console.error(err)
          console.log('Token stored to', TOKEN_PATH)
        })
        callback(oAuth2Client)
      })
    })
  }

  async function getConfirmationCodeAndTrashMessage(auth) {
    const gmail = google.gmail({ version: 'v1', auth })
    const emailFrom = 'conexion.bancaribe@bancaribe.com.ve'
    const emailSubject = 'Clave de Operaciones Especiales'

    try {
      const list = await gmail.users.messages.list({
        userId: 'me',
        q: `in:inbox from:(${emailFrom}) subject:(${emailSubject}) is:unread`,
      })

      // if (list.data.resultSizeEstimate === 0) wait 10 seconds and retry

      console.log(`-> Messages listed: ${JSON.stringify(list.data.messages, null, 2)}`)

      const messageId = list.data.messages[0].id

      const message = await gmail.users.messages.get({
        userId: 'me',
        id: messageId,
        format: 'full',
      })

      console.log(`-> Message got: ${message.data.snippet}`)

      const regExpToMatchNumber = /\d+/gi
      const confirmationCode = message.data.snippet.match(regExpToMatchNumber)[0]

      console.log(`-> Code got: ${confirmationCode}`)

      await gmail.users.messages.trash({
        userId: 'me',
        id: messageId,
      })

      console.log(`-> Message trashed`)
    } catch (error) {
      console.log('The API returned an error: ' + error)
    }
  }
}
