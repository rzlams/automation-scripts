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

// Que las credenciales actuales solo se usen para GMAIL. Si se quiere usar otro servicio se generan nuevas credenciales
// Asi se evita tener un client id que pueda tocar muchos servicios (con muchos scopes)
