const { Router } = require('express');
const { validarJWT, UPLOAD_FILE_Validator } = require('../middlewares/validar-jwt')
const expressFileUpload = require('express-fileupload')

const { fileUpload, getImage } = require('../controllers/uploads.controller')

const uploadRouter = Router();

uploadRouter.use( expressFileUpload() )


//RUTA: /api/upload/:type/:id
uploadRouter.route('/api/upload/:type/:id')
              .put( validarJWT, UPLOAD_FILE_Validator, fileUpload )

//RUTA: /api/upload/:type/:id
uploadRouter.route('/api/upload/:type/:image')
              .get( getImage )



module.exports = uploadRouter
