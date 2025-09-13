require('dotenv').config()
const path = require('path')
const express = require('express')
const cors    = require('cors')
const { dbConnection } = require('./database/config')

// ✅ Routes
const authRouter     = require('./routes/auth')
const searchRouter   = require('./routes/searches')
const uploadRouter   = require('./routes/uploads')
const userRouter     = require('./routes/users')
const hospitalRouter = require('./routes/hospitals')
const medicRouter    = require('./routes/medics')


const app = express()

// ✅ CORS CONFIG (add this before other middleware)
app.use(cors())

// ✅ Body parsers
app.use( express.json() )
app.use( express.urlencoded({ extended : false }) )

// ✅ DB connection
dbConnection();

// ✅ Serve static angular frontend dist folder
app.use(express.static(path.resolve('./public')));

// ✅ API routes
app.use(authRouter)
app.use(searchRouter)
app.use(uploadRouter)
app.use(userRouter)
app.use(hospitalRouter)
app.use(medicRouter)

// ✅ Fallback route for Angular SPA index.html
//Para que no pierda la ruta con el backend ya desplegado - part 2
app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, './public/index.html'))
})

// ✅ Start server
const PORT = process.env.PORT || 3000

app.listen( PORT, () => {
  console.log('app listening on port ' + PORT);
});