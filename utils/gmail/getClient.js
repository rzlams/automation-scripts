const fs = require('fs').promises
const { google } = require('googleapis')
const readline = require('../readlineAsync')

module.exports = async (debug) => {
  // If modifying these scopes, delete token.json.
  const SCOPES = ['https://www.googleapis.com/auth/gmail.readonly', 'https://www.googleapis.com/auth/gmail.modify']
  // The file token.json stores the user's access and refresh tokens, and is
  // created automatically when the authorization flow completes for the first
  // time.
  const TOKEN_PATH = 'sessionData/token.json'
  const CREDENTIALS_PATH = 'sessionData/credentials.json'

  // Load client secrets from a local file.
  const credentials = await readCredentials(CREDENTIALS_PATH)
  if (debug) console.log(`-> Credentials successfully read: ${JSON.stringify(credentials, null, 2)}`)

  const { client_secret, client_id, redirect_uris } = credentials.web
  const oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0])

  const currentSessionToken = await getCurrentSessionToken(TOKEN_PATH)
  if (!currentSessionToken && debug) console.log(`-> No current session token found`)

  const sessionToken = await getNewSessionToken(currentSessionToken, oAuth2Client, SCOPES, TOKEN_PATH)
  if (debug) console.log(`-> Session Token got`)

  oAuth2Client.setCredentials(sessionToken)
  if (debug) console.log(`-> oAuth2 credentials set`)

  const gmail = google.gmail({ version: 'v1', auth: oAuth2Client })
  console.log(`-> gmail instance created`)

  return gmail
}

async function readCredentials(path) {
  try {
    const credentials = await fs.readFile(path)

    if (!credentials) throw new Error(`No ${path} file found`)

    return JSON.parse(credentials)
  } catch (error) {
    throw new Error(`Error loading gmail credentials file: ${JSON.stringify(error, null, 2)}`)
  }
}

async function getCurrentSessionToken(path) {
  try {
    // Check if we have previously stored a token.
    const token = await fs.readFile(path)

    return JSON.parse(token)
  } catch (error) {
    return
  }
}

async function getNewSessionToken(currentSessionToken, oAuth2Client, scopes, tokenPath) {
  if (currentSessionToken) return currentSessionToken

  console.log('-> Getting new session token')

  try {
    const authUrl = oAuth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: scopes,
    })

    console.log('-> Authorize this app by visiting this url:', authUrl)

    const rl = readline.open()

    const rawCode = await rl.question('-> Enter the code from that page here: ')
    // Use this only que you copy paste the code from the URL in the browser. Because the code param needs to be decoded
    const code = decodeURIComponent(rawCode)

    const token = await new Promise((resolve, reject) => oAuth2Client.getToken(code, (error, token) => (error ? reject(error) : resolve(token))))

    // Store the token to disk for later program executions
    await fs.writeFile(tokenPath, JSON.stringify(token))

    console.log('-> Token stored to', tokenPath)

    rl.close()

    return token
  } catch (error) {
    throw new Error(`Error retrieving gmail access token from oAuth: ${JSON.stringify(error, null, 2)}`)
  }
}
