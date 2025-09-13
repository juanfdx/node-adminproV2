const { Router } = require('express');
const { validarJWT } = require('../middlewares/validar-jwt')

const { getAll, getCollection } = require('../controllers/searches.controller')

const searchRouter = Router();


//RUTA: /api/all/:term
searchRouter.route('/api/all/:term')
              .get( validarJWT, getAll )


//RUTA: /api/all/collection/:type/:term
searchRouter.route('/api/all/collection/:type/:term')
              .get( validarJWT, getCollection )



module.exports = searchRouter