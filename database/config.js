const mongoose = require('mongoose');

const dbConnection = async () => {

  try {
    
    await mongoose.connect(process.env.DB_CONNECTION);
    
    console.log('DB Online');

  } catch (error) {
    console.warn(error);
    throw new Error('Error al iniciar la base de datos');
  }

}


module.exports = { dbConnection }