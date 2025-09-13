const { Router } = require('express');
const { check } = require('express-validator')
const { validarCampos } = require('../middlewares/validar-campos')
const { validarJWT, SAME_HOSPITAL_CREATOR_OR_ADMIN_Validator } = require('../middlewares/validar-jwt')

const { getHospitals, createHospital, updateHospital, deleteHospital } = require('../controllers/hospitals.controller')

const hospitalRouter = Router();


//RUTA: /api/hospitals
hospitalRouter.route('/api/hospitals')
                .get( getHospitals )
                .post( 
                  [
                    validarJWT,
                    check('name', 'Hospital name is required.').notEmpty(),
                    validarCampos
                  ], createHospital )


//RUTA: /api/hospitals/:id
hospitalRouter.route('/api/hospitals/:id')
                .delete(  validarJWT, 
                          SAME_HOSPITAL_CREATOR_OR_ADMIN_Validator, 
                          deleteHospital )
                .put( 
                  [
                    validarJWT,
                    SAME_HOSPITAL_CREATOR_OR_ADMIN_Validator,
                    check('name', 'Hospital name is required.').notEmpty(),
                    validarCampos
                  ], updateHospital)




module.exports = hospitalRouter