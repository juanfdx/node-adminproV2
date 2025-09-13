const { Router } = require('express');
const { check } = require('express-validator')
const { validarCampos } = require('../middlewares/validar-campos')
const { validarJWT, SAME_MEDIC_CREATOR_OR_ADMIN_Validator } = require('../middlewares/validar-jwt')

const { getMedics, getMedic, createMedic, updateMedic, deleteMedic } = require('../controllers/medics.controller')

const medicRouter = Router();


//RUTA: /api/medics
medicRouter.route('/api/medics')
                .get( validarJWT, getMedics )
                .post( 
                  [
                    validarJWT,
                    check('name', 'Name is required').notEmpty(),
                    check('lastName', 'LastName is required').notEmpty(),
                    check('hospital', 'El id del hospital debe ser valido.').isMongoId(),
                    validarCampos
                  ], createMedic )


//RUTA: /api/medics/:id
medicRouter.route('/api/medics/:id')
                .get( validarJWT, getMedic )
                .delete( validarJWT, 
                         SAME_MEDIC_CREATOR_OR_ADMIN_Validator, 
                         deleteMedic )
                .put( 
                  [
                    validarJWT,
                    SAME_MEDIC_CREATOR_OR_ADMIN_Validator,
                    check('name', 'Name is required').notEmpty(),
                    check('lastName', 'LastName is required').notEmpty(),
                    check('hospital', 'El id del hospital debe ser valido.').isMongoId(),
                  ], updateMedic)




module.exports = medicRouter