const Hospital = require('../models/hospital.model')


/*===========================================================
  GET ALL HOSPITALS
============================================================*/
const getHospitals = async (req, res) => {

  //pagination, req.query para parametros opcionales
  const from = Number(req.query.from) || 0; //si no viene que sea 0

  //con populate() obtenemos el usuario que creo el hospital por su id
  const [ hospitals, total ] = await Promise.all([
                                                  Hospital.find()
                                                          .skip( from )
                                                          .limit( 5 )
                                                          .populate('user', 'name lastName image'),

                                                  Hospital.countDocuments()
                                                ]);                              

  res.status(200).json({
    hospitals,
    total
  });

}

/*===========================================================
  CREATE HOSPITAL
============================================================*/
const createHospital = async (req, res) => {

  //id del user que realizó la petición, from validar-jws.js 21
  const userId = req.id 

  //inserto ese user mediante desestruturación junto al req.body
  const hospital = new Hospital({
    user: userId, 
    ...req.body
  })

  try {

    //guardar hospital
    const newHospital = await hospital.save()

    res.status(200).json({
      msg: 'Hospital creado con exito!',
      hospital : newHospital
    })
  
  } catch (error) {

      console.log(error)
      res.status(500).json({
        msg : 'Error inesperado!'
      })
  }
}

/*===========================================================
  UPDATE HOSPITAL
============================================================*/
const updateHospital = async (req, res ) => {

  const hospitalId = req.params.id;
  const userId = req.id; //viene del JWT

  try {

    const hospitalDB = await Hospital.findById( hospitalId );

    if (!hospitalDB) {
      return res.status(404).json({
        msg : 'Hospital no encontrado!'
      });
    }

    //si creamos un objeto podemos agregar el id del usuario que esta actualizando
    const newChangesHospital =  {
      ...req.body,
      user: userId
    }

    const hospitalUpdated = await Hospital.findByIdAndUpdate( hospitalId, newChangesHospital, {new: true});

    res.status(200).json({
      msg: 'Hospital actualizado con exito!',
      hospital : hospitalUpdated
    })
  
    
  } catch (error) {

      console.log(error)
      res.status(500).json({
        msg : 'Error inesperado!'
      })
  }

}

/*===========================================================
  DELETE HOSPITAL
============================================================*/
const deleteHospital = async (req, res ) => {

  const hospitalId = req.params.id;

  try {

    const hospitalDB = await Hospital.findById( hospitalId );

    if (!hospitalDB) {
      return res.status(404).json({
        msg : 'Hospital no encontrado!'
      });
    }

    const hospitalDeleted = await Hospital.findByIdAndDelete( hospitalId );

    res.status(200).json({
      msg : 'Hospital borrado con exito!',
      hospital : hospitalDeleted
    })
  
    
  } catch (error) {

      console.log(error)
      res.status(500).json({
        errors : 'Error inesperado!'
      })
  }
}



module.exports = {
  getHospitals,
  createHospital,
  updateHospital,
  deleteHospital
}