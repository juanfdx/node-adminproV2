const { Schema, model } = require('mongoose');


const MedicSchema = Schema({
  
  name: {
    type: String,
    required: true
  },
  lastName: {
    type: String,
    required: true
  },
  image: {
    type: String,

  },
  //referencia al usuario que creó el médico
  user: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  //referencia al hospital al que pertenece el médico
  hospital: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'Hospital'
  }

});

//quitamos algunos parametros de la respuesta (es solo visual)
MedicSchema.method('toJSON', function () {
  const { __v, ...object } = this.toObject();
  return object;
})


module.exports = model( 'Medic', MedicSchema);