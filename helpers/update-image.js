const fs = require('fs');
const User = require('../models/user.model');
const Hospital = require('../models/hospital.model');
const Medic = require('../models/medic.model');


const deleteImage = ( path ) => {
  //si existe la borramos
  if (fs.existsSync( path )) {
    fs.unlinkSync( path );
  }
}

//el id será de un usuario , medico u hospital segun el caso
const updateImage = async (type, id, fileName) => {

  let oldPath;

  switch ( type ) {
    case 'users':
      const user =  await User.findById(id);
      if (!user) {
        console.log('No se encontró usuario por su id');
        return false;
      }

      //buscamos la imagen antigua
      oldPath = `./uploads/users/${user.image}`;
      //la borramos
      deleteImage( oldPath );

      //asignamos la nueva imagen al medico en la BBDD
      user.image = fileName;

      await user.save();
      return true;
    break;

    case 'medics':
      const medic =  await Medic.findById(id);
      if (!medic) {
        console.log('No se encontró médico por su id');
        return false;
      }

      //buscamos la imagen antigua
      oldPath = `./uploads/medics/${medic.image}`;
      //la borramos
      deleteImage( oldPath );

      //asignamos la nueva imagen al medico en la BBDD
      medic.image = fileName;

      await medic.save();
      return true;
    break;

    case 'hospitals':
      const hospital =  await Hospital.findById(id);
      if (!hospital) {
        console.log('No se encontró hospital por su id');
        return false;
      }

      //buscamos la imagen antigua
      oldPath = `./uploads/hospitals/${hospital.image}`;
      //la borramos
      deleteImage( oldPath );

      //asignamos la nueva imagen al medico en la BBDD
      hospital.image = fileName;

      await hospital.save();
      return true;
    break;
  
    default:
      return res.status(400).json({
        msg : 'La colección debe ser de: usuarios, médicos u hospitales!'
      });
      
  }

}





module.exports = {
  updateImage
}