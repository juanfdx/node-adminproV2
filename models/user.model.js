const { Schema, model } = require('mongoose');


const UserSchema = Schema({

  name: {
    type: String,
    required: true
  },
  lastName: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
  },
  image: {
    type: String,

  },
  role: {
    type: String,
    required: true,
    default: 'USER_ROLE'
  },
  status: {
    type: String,
    required: true,
    default: 'active'
  }
})

//quitamos algunos parametros de la respuesta (es solo visual)
UserSchema.method('toJSON', function () {
  const { __v, password, ...object } = this.toObject();
  return object;
})

const User = model('User', UserSchema)

module.exports = User
