const User = require('../models/user.model')
const bcrypt = require('bcryptjs')
const { generateJWT } = require('../helpers/jwt')
const { getMenuFrontEnd } = require('../helpers/menu-frontend')


/*===========================================================
  LOGIN
============================================================*/
const login = async (req, res) => {

  const { email, password } = req.body

  try {
    //verificar email
    const userDB = await User.findOne({ email })

    if (!userDB) {
        return res.status(404).json({
          msg : 'Usuario no encontrado!'
        })
    }

    //verificar password
    const validPassword = bcrypt.compareSync( password, userDB.password )

    if (!validPassword) {
        return res.status(401).json({
          msg : 'Contraseña invalida!'
        })
    }

    //verificar status
    if (userDB.status !== 'active') {
        return res.status(401).json({
          msg : 'Su cuenta ha sido deshabilitada!'
        })
    }

    //generar token - jwt
    const token = await generateJWT( userDB.id )

    res.status(200).json({
      token,
      menu: getMenuFrontEnd( userDB.role ) //mandamos el menu y el role
    })
    
  
  } catch (error) {
      
      console.log(error)
      res.status(500).json({
        msg : 'Error inesperado!'
      })
  }  
}

/*===========================================================
  RENEW TOKEN - renovar el token
============================================================*/
const renewToken = async ( req , res ) => {
  
  //id del user que realizó la petición, from validar-jws.js 21
  const userId = req.id;

  //Generar el TOKEN - JWT y obtener el usuario por su id
  const [ token, user ] = await Promise.all([
    generateJWT( userId ), 
    User.findById( userId )
  ])

  //mandamos el menu y el role del user
  res.status(200).json({
    token,
    user,
    menu: getMenuFrontEnd( user.role )
  })


}


module.exports = {
  login,
  renewToken
}