const { Schema, model } = require('mongoose');


const HospitalSchema = Schema({
  
  name: {
    type: String,
    required: true
  },
  image: {
    type: String,

  },
  //referencia al usuario que creó el hospital
  user: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  }

});

//quitamos algunos parametros de la respuesta (es solo visual)
HospitalSchema.method('toJSON', function () {
  const { __v, ...object } = this.toObject();
  return object;
})


module.exports = model( 'Hospital', HospitalSchema);