const { Router } = require('express');
const { check } = require('express-validator')
const { validarCampos } = require('../middlewares/validar-campos')
const { validarJWT, ADMIN_ROLE_Validator, ADMIN_ROLE_OR_SAME_USER_Validator } = require('../middlewares/validar-jwt')

const { getUsers, createUser, updateUser, deleteUser } = require('../controllers/users.controller')

const userRouter = Router();


//RUTA: /api/users
userRouter.route('/api/users')
            .get( validarJWT, getUsers )
            .post( 
              [
                check('name', 'Name is required').notEmpty(),
                check('lastName', 'LastName is required').notEmpty(),
                check('email', 'Email is required').isEmail(),
                check('password', 'Password is required').notEmpty(),
                validarCampos
              ], createUser )

//RUTA: /api/users/:id
userRouter.route('/api/users/:id')
            .delete( validarJWT, ADMIN_ROLE_Validator, deleteUser )
            .put( 
              [
                validarJWT, 
                ADMIN_ROLE_OR_SAME_USER_Validator, 
                check('name', 'Name is required').notEmpty(),
                check('lastName', 'LastName is required').notEmpty(),
                check('email', 'Email is required').isEmail(),
                check('role', 'Role is required').notEmpty(),
                validarCampos
              ], updateUser)




module.exports = userRouter