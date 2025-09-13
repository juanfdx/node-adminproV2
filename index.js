require('dotenv').config()
const path = require('path')
const express = require('express')
const helmet  = require('helmet')
const cors    = require('cors')
const yargs   = require('yargs').argv
const { dbConnection } = require('./database/config')

const authRouter     = require('./routes/auth')
const searchRouter   = require('./routes/searches')
const uploadRouter   = require('./routes/uploads')
const userRouter     = require('./routes/users')
const hospitalRouter = require('./routes/hospitals')
const medicRouter    = require('./routes/medics')

// let { myport } = yargs
//f

//SERVIDOR EXPRESS - app tiene todo express con sus metodos
const app = express()

//CONFIG SERVIDOR - nota: helmet da problemas por su seguridad alta
// app.use( helmet({
//   //para que no bloquee las imagenes
//   crossOriginResourcePolicy: false,
// }) )

app.use( cors() )
app.use( express.json() )
app.use( express.urlencoded({ extended : false }) )

//BASE DE DATOS
dbConnection();

//IMPORTANTE PQ ANGULAR DIST ESTA EN LA CARPETA PUBLIC - part 1
app.use(express.static(path.resolve('./public')));

//RUTAS
app.use(authRouter)
app.use(searchRouter)
app.use(uploadRouter)
app.use(userRouter)
app.use(hospitalRouter)
app.use(medicRouter)


//con yargs
// app.listen( myport || 4000, () => {
//   console.log(`app listening on port ${myport}`)
// })

//Para que no pierda la ruta con el backend ya desplegado - part 2
app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, './public/index.html'))
})

//DESPLIEGUE
const PORT = process.env.PORT || 3000

app.listen( PORT, () => {
  console.log('app listening on port ' + PORT);
});