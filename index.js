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


//SERVIDOR EXPRESS - app tiene todo express con sus metodos
const app = express()

//CONFIG SERVIDOR - nota: helmet da problemas por su seguridad alta
// app.use( helmet({
//   //para que no bloquee las imagenes
//   crossOriginResourcePolicy: false,
// }) )

// MIDDLEWARE- This helps confirm if your frontend is sending the right origin.
app.use((req, res, next) => {
  console.log('Origin:', req.headers.origin);
  next();
});


app.use(
  cors({
    origin: 'https://api-node-adminpro-ef5039e6e1c1.herokuapp.com', // your frontend domain
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
  })
);

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