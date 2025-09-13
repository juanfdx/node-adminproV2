const Medic = require('../models/medic.model')


/*===========================================================
  GET ALL MEDICS
============================================================*/
const getMedics = async (req, res) => {

  //pagination, req.query para parametros opcionales
  const from = Number(req.query.from) || 0; //si no viene que sea 0

  //con populate() obtenemos el usuario que creo el hospital por su id
  const [ medics, total ] = await Promise.all([
                                                Medic.find().skip( from )
                                                            .limit( 5 )
                                                            .populate('user', 'name lastName image')
                                                            .populate('hospital', 'name image'),

                                                Medic.countDocuments()
                                              ]);

  res.status(200).json({
    medics,
    total
  })

}

/*===========================================================
  GET ONE MEDIC
============================================================*/
const getMedic = async (req, res) => {

  const medicId = req.params.id;

  try {

    //verificamos si existe el medico en la BD
    const medicDB = await Medic.findById( medicId )
                               .populate('user', 'name lastName image')
                               .populate('hospital', 'name image');
    
    if ( !medicDB ) {
      return res.status(404).json({
        msg : 'Médico no encontrado!'
      });
    }

    res.status(200).json({
      medic : medicDB    
    })


  } catch (error) {

      console.log(error)
      res.status(500).json({
        msg : 'Error inesperado!'
      })
  }
  
}

/*===========================================================
  CREATE MEDIC
============================================================*/
const createMedic = async (req, res) => {

  //id del user que realizó la petición, from validar-jws.js 21
  const userId = req.id 

  //inserto ese user_id mediante desestruturación junto al req.body
  const medic = new Medic({
    user: userId, 
    ...req.body
  })

  try {

    //guardar medic
    const medicDB = await medic.save()
     
    res.status(200).json({
      msg: 'Médico creado con exito!',
      medic : medicDB
    })

  } catch (error) {

      console.log(error)
      res.status(500).json({
        msg : 'Error inesperado!'
      })
  }
}

/*===========================================================
  UPDATE MEDIC
============================================================*/
const updateMedic = async (req, res) => {

  const medicId = req.params.id;
  const userId = req.id; //usuario que esta actualizando

  try {

    //verificamos si existe el medico en la BD
    const medicDB = await Medic.findById( medicId );
    
    if ( !medicDB ) {
      return res.status(404).json({
        msg : 'Médico no encontrado!'
      });
    }

    //creamos un objeto con los datos para actualizar
    const newChangesMedic =  {
      ...req.body,
      user: userId
    }

    const medicUpdated = await Medic.findByIdAndUpdate( medicId, newChangesMedic,  {new: true});

    res.json({
      msg: 'Médico actualizado con exito!',
      medic: medicUpdated
    })


  } catch (error) {

      console.log(error)
      res.status(500).json({
        msg : 'Error inesperado!'
      })
  }

}

/*===========================================================
  DELETE MEDIC
============================================================*/
const deleteMedic = async (req, res) => {

  const medicId = req.params.id;

  try {

    //verificamos si existe el medico en la BD
    const medicDB = await Medic.findById( medicId );
    
    if ( !medicDB ) {
      return res.status(404).json({
        msg : 'Médico no encontrado!'
      });
    }

    //si existe lo borramos
    const medicDeleted = await Medic.findByIdAndDelete( medicId );

    res.json({
      msg : 'Médico borrado con exito!',
      medic : medicDeleted, //si quisieramos mostrar datos del medico borrado
    })


  } catch (error) {

      console.log(error)
      res.status(500).json({
        msg : 'Error inesperado!'
      })
  }

}


module.exports = {
  getMedics,
  getMedic,
  createMedic,
  updateMedic,
  deleteMedic
}