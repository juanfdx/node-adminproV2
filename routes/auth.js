const { Router } = require('express');
const { check } = require('express-validator')
const { validarCampos } = require('../middlewares/validar-campos')
const { validarJWT } = require('../middlewares/validar-jwt')

const authRouter = Router();

const { login, renewToken } = require('../controllers/auth.controller')



//RUTA: /api/login
authRouter.route('/api/login')
            .post(
              [
                check('email', 'Email is required').isEmail(),
                check('password', 'Password is required').notEmpty(),
                validarCampos
              ], login)


//RUTA: /api/login/renew
authRouter.route('/api/login/renew')
            .get( validarJWT, renewToken )




module.exports = authRouter