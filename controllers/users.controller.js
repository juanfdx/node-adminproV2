const User = require('../models/user.model')
const bcrypt = require('bcryptjs')
const { generateJWT } = require('../helpers/jwt')


/*===========================================================
  GET ALL USERS
============================================================*/
const getUsers = async ( req, res) => {

  const from = Number(req.query.from) || 0
 
 //si tenemos 2 o mas await seguidos es mejor y mas eficiente juntarlos en un array de Promesas
  const [ users, total ] = await Promise.all([
                                              User.find({}, 'name lastName email role status image')
                                                  .skip( from ) //desde
                                                  .limit( 5 ),  //hasta
                                                  
                                              User.countDocuments()
                                            ]);

  res.status(200).json({
    users,
    total,
  })
}

/*===========================================================
  CREATE USER
============================================================*/
const createUser = async ( req, res) => {

  const { email, password } = req.body

  try {
    //si ya existe un user con ese email
    const emailExists = await User.findOne({ email })

    if (emailExists) {
        return res.status(400).json({
          msg : 'El correo ya existe!'
        })
    }

    const user = new User( req.body )

    //encriptar password
    const salt = bcrypt.genSaltSync();
    user.password = bcrypt.hashSync( password, salt )

    //guardar user
    await user.save()

    //generar token
    const token = await generateJWT( user.id )

    res.status(201).json({
      user,
      token 
    })
  
  } catch (error) {

      console.log(error)
      res.status(500).json({
        msg : 'Error inesperado!'
      })
  } 
}

/*===========================================================
  UPDATE USER
============================================================*/
const updateUser = async (req, res) => {

  const id = req.params.id

  try {
    const userDB = await User.findById(id);

    if (!userDB) {
      return res.status(404).json({
        msg: 'Usuario no encontrado!',
      });
    }

    //protección a la cuenta principal juanfdx@email.com
    if (userDB.email === 'juanfdx@email.com') {
      return res.status(403).json({
        msg: 'Denegado! esta cuenta esta protegida.',
      });
    }

    //creamos fields, sin password, y sin email
    const { password, email, ...fields } = req.body;

    //si son diferentes significa que esta actualizando su email
    if (userDB.email !== email) {
      //protección de cuentas, no se puede cambiar el email
      if (
        userDB.email === 'johndoe@email.com' ||
        userDB.email === 'liu@email.com'
      ) {
        return res.status(403).json({
          msg: 'Denegado! esta cuenta esta protegida.',
        });
      }

      const emailExists = await User.findOne({ email });

      if (emailExists) {
        return res.status(400).json({
          msg: 'El correo ya existe!',
        });
      }
    }

    //devolvemos email a fields
    fields.email = email;

    const updatedUser = await User.findByIdAndUpdate(id, fields, { new: true });

    res.status(200).json({
      msg: 'Usuario actualizado con exito!',
      user: updatedUser,
    });
  } catch (error) {

      console.log(error)
      res.status(500).json({
        msg : 'Error inesperado!'
      })
  }
}

/*===========================================================
  DELETE USER
============================================================*/
const deleteUser = async (req, res) => {

  const id = req.params.id

  try {
    const userDB = await User.findById(id);

    if (!userDB) {
      return res.status(404).json({
        msg: 'Usuario no encontrado!',
      });
    }

    //protección a la cuenta principal juanfdx@email.com
    if (userDB.email === 'juanfdx@email.com') {
      return res.status(403).json({
        msg: 'No se puede borrar este administrador!',
      });
    }

    //protección de cuentas
    if (
      userDB.email === 'johndoe@email.com' ||
      userDB.email === 'liu@email.com'
    ) {
      return res.status(403).json({
        msg: 'Denegado! esta cuenta esta protegida.',
      });
    }

    const userDeleted = await User.findByIdAndDelete(id);

    res.status(200).json({
      msg: 'Usuario borrado con exito!',
      user: userDeleted,
    });
  } catch (error) {
      
      console.log(error)
      res.status(500).json({
        msg : 'Error inesperado!'
      })
  }
}



module.exports = {
  getUsers,
  createUser,
  updateUser,
  deleteUser
}