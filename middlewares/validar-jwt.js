const jwt = require('jsonwebtoken')
const { JWT_SECRET } = process.env
const User = require('../models/user.model')
const Hospital = require('../models/hospital.model')
const Medic = require('../models/medic.model')


/*===========================================================
  JWT - VALIDATOR
============================================================*/
const validarJWT = (req, res, next) => {

  //leer token
  const token = req.header('x-token')

  if (!token) {
    return res.status(401).json({
      msg : 'No hay token en la petición!'
    })
  }

  //verificar token
  try {
    const { userId } = jwt.verify( token, JWT_SECRET )

    //agregamos a la req el id (es el id del user que realizó la petición)
    req.id = userId

     next()
  
  } catch (error) {
      console.log(error);
      return res.status(401).json({
        msg : 'Token invalido!'
      })  
  } 
}


/*===========================================================
  ADMIN_ROLE - VALIDATOR
============================================================*/
const ADMIN_ROLE_Validator = async ( req, res, next ) => {

  //ADMIN_ROLE_Validator lo llamamos despues de jwtValidator 
  //por tanto tendremos el req.id del usuario
  const userId = req.id;

  try {

    //verificamos que exista el usuario
    const userDB = await User.findById( userId );

    //si no existe el usuario
    if (!userDB) {
      return res.status(404).json({
        msg : 'Usuario no encontrado!'
      })
    }

    //si existe el usuario y no es Admin
    if (userDB.role !== 'ADMIN_ROLE') {
      return res.status(403).json({
        msg: 'Acceso denegado!'
      })
    }

    //Si es Admin
    next();
    

  } catch (error) {
    console.log(error)
    res.status(500).json({
      msg: 'Error inesperado!'
    })
  }
}

/*===========================================================
  ADMIN_ROLE OR SAME USER - VALIDATOR
============================================================*/
const ADMIN_ROLE_OR_SAME_USER_Validator = async ( req, res, next ) => {

  //si estos dos IDs son iguales es que es el mismo usuario que quiere actualizar su perfil
  const userId = req.id; //id del usuario validado, viene del JWT
  const id = req.params.id //id que viene en ese momento

  try {

    //verificamos que exista el usuario
    const userDB = await User.findById( userId )

    //si no existe el usuario
    if (!userDB) {
      return res.status(404).json({
        msg : 'Usuario no encontrado!'
      })
    }

    //si existe el usuario y es Admin o es el mismo usuario actualizando su perfil
    if (userDB.role === 'ADMIN_ROLE' || userId === id) {
      
      next()

    } else {
      return res.status(403).json({
        msg: 'Acceso denegado!'
      })
    }


  } catch (error) {
    console.log(error)
    res.status(500).json({
      msg: 'Error inesperado!'
    })
  }
}

/*===========================================================
 SAME USER HOSPITAL CREATOR - VALIDATOR
============================================================*/
//solo el propio creador del hospital o el admin puede borrarlo
const SAME_HOSPITAL_CREATOR_OR_ADMIN_Validator = async ( req, res, next ) => {

  const userId = req.id; //id del usuario validado, viene del JWT
  const hospitalId = req.params.id //id del hospital a borrar

  try {

    //verificamos que exista el usuario
    const userDB = await User.findById( userId );

    //si no existe el usuario
    if (!userDB) {
      return res.status(404).json({
        msg : 'Usuario no encontrado!'
      })
    }

    //verificamos que exista el hospital
    const hospitalDB = await Hospital.findById( hospitalId );
    //viene como ObjectId hay que pasarlo a string
    // console.log(hospitalDB.user.toString());

    //si el usuario es Admin o es el mismo usuario que creó el hospital
    if (userDB.role === 'ADMIN_ROLE' || userId === hospitalDB.user.toString()) {
      
      next();

    } else {
      return res.status(403).json({
        msg: 'Este hospital no esta asociado a su cuenta!'
      })
    }

  
  } catch (error) {
    console.log(error);
    res.status(500).json({
      msg: 'Error inesperado!'
    })
  }
}

/*===========================================================
 SAME USER MEDIC CREATOR - VALIDATOR
============================================================*/
//solo creador del medico o el admin puede borrarlo
const SAME_MEDIC_CREATOR_OR_ADMIN_Validator = async ( req, res, next ) => {

  const userId = req.id; //id del usuario validado, viene del JWT
  const medicId = req.params.id //id del medico

  try {
  
    //verificamos que exista el usuario
    const userDB = await User.findById( userId );

    //si no existe el usuario
    if (!userDB) {
      return res.status(404).json({
        msg : 'Usuario no encontrado!'
      })
    } 

    //verificamos si existe el medico en la BD
    const medicDB = await Medic.findById( medicId );
    //viene como ObjectId hay que pasarlo a string
    // console.log(medicDB.user.toString());

    //si el usuario es Admin o es el mismo usuario que creó el medico
    if (userDB.role === 'ADMIN_ROLE' || userId === medicDB.user.toString()) {
      
      next();

    } else {
      return res.status(403).json({
        msg: 'Este médico no esta asociado a su cuenta!'
      })
    }
  

  } catch (error) {
      console.log(error);
      res.status(500).json({
        msg: 'Error inesperado!'
      })
  }
}

/*===========================================================
 ADMIN OR SAME USER MEDIC & HOSPITAL CREATOR - CAN UPLOAD_FILE
============================================================*/
const UPLOAD_FILE_Validator = async ( req, res, next ) => {

  const userId = req.id; //id del usuario validado, viene del JWT

  const type = req.params.type;
  const id = req.params.id //id del medico o del hospital

  try {

    //verificamos que exista el usuario
    const userDB = await User.findById( userId );

    //si no existe el usuario
    if (!userDB) {
      return res.status(404).json({
        msg : 'Usuario no encontrado!'
      })
    } 
    
    let dataType_userId = '';

    switch (type) { 
      case 'users':
        const userDB = await User.findById( id );
        dataType_userId = userDB._id.toString();

        break;
      case 'hospitals':
        const hospitalDB = await Hospital.findById( id );
        dataType_userId = hospitalDB.user.toString();

        break;
      case 'medics':
        const medicDB = await Medic.findById( id );
        dataType_userId = medicDB.user.toString();
        
        break;
      default:
        console.warn('Error!!!, el tipo es invalido!');
    }

    
    //si el usuario es Admin o es el mismo usuario que creó el medico o el hospital
    if (userDB.role === 'ADMIN_ROLE' || userId === dataType_userId) {
      
      next();

    } else {
      return res.status(403).json({
        msg: 'Acceso denegado!'
      })
    }
  

  } catch (error) {
    console.log(error);
    res.status(500).json({
      msg: 'Error inesperado!'
    })
  }
}



module.exports = {
  validarJWT,
  ADMIN_ROLE_Validator,
  ADMIN_ROLE_OR_SAME_USER_Validator,
  SAME_HOSPITAL_CREATOR_OR_ADMIN_Validator,
  SAME_MEDIC_CREATOR_OR_ADMIN_Validator,
  UPLOAD_FILE_Validator
}