const User = require('../models/user.model')
const Medic = require('../models/medic.model');
const Hospital = require('../models/hospital.model');


/*===========================================================
  GET ALL RECORDS
============================================================*/
const getAll = async (req, res) => {

  const term = req.params.term

  //para que la busqueda sea key insensitive
  const regex = new RegExp( term, 'i' );

  const [users, medics, hospitals ] =  await Promise.all(
    [
      User.find({ name: regex }).limit( 10 ),
      Medic.find({ name: regex }).limit( 10 ),
      Hospital.find({ name: regex }).limit( 10 )
    ]
  ); 

  res.status(200).json({
    users,
    hospitals,
    medics
  })
}

/*===========================================================
  GET ALL RECORDS BY TYPE - nota: no se usara la paginacion
============================================================*/
const getCollection = async (req, res) => {

  //pagination, req.query para parametros opcionales
  const from = Number(req.query.from) || 0; //si no viene que sea 0

  //obtener parametros de la url
  const type = req.params.type;
  const term = req.params.term;

  //para que la busqueda sea key insensitive
  const regex = new RegExp( term, 'i' );

  let data;
  let total;

  switch ( type ) {
    case 'users':
      [ data, total ] = await Promise.all([
                                            User.find({ name: regex }).skip( from ).limit( 10 ),
                                            User.find({ name: regex }).count()
                                          ]);

      break;

    case 'medics':
      [ data, total ] = await Promise.all([
                                            Medic.find({ name: regex }).skip( from ).limit( 10 )
                                                 .populate('user', 'name lastName image')
                                                 .populate('hospital', 'name image'),

                                            Medic.find({ name: regex }).count()       
                                          ])

      break;

    case 'hospitals':
      [ data, total ] = await Promise.all([
                                            Hospital.find({ name: regex }).skip( from ).limit( 10 )
                                                    .populate('user', 'name lastName image'),

                                            Hospital.find({ name: regex }).count()
                                          ]);
      break;
  
    default:
      return res.status(400).json({
        msg : 'The collection must be from: users, medics or hospitals!'
      });
      
  }


  res.status(200).json({
    data,
    total
  });

}




module.exports = {
  getAll,
  getCollection
}
