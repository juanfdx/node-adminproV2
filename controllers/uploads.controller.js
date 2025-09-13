const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');
const { updateImage } = require('../helpers/update-image');


/*===========================================================
  UPLOAD IMAGE
============================================================*/
const fileUpload = (req, res) => {

  const type = req.params.type
  const id   = req.params.id

  //tipos validos
  const validTypes = ['users', 'hospitals', 'medics'];

  //verificar el tipo
  if (!validTypes.includes(type)) {
      return res.status(400).json({
        msg : 'No es un médico, usuario u hospital.!'
      })
  }

  //verificamos que viene un archivo de tipo file
  if (!req.files || Object.keys(req.files).length === 0) {
    return res.status(400).json({
      msg : 'Ningun archivo fue subido!'
    });
  }

/* PROCESAR LA IMAGEN: 
 * - accedemos a files gracias al middleware expressFileUpload()
 *
*/

  const file = req.files.image;

  //separamos el nombre del archivo por el punto, devuelve un array
  const splitName = file.name.split('.'); 

  //optenemos la extension del archivo, es la ultima posición del array
  const extension = splitName[ splitName.length -1 ];

  //extensiones validas
  const validExtension = ['png', 'jpg', 'jpeg', 'gif'];

  //verificamos extensión
  if (!validExtension.includes(extension)) {
    return res.status(400).json({
      msg : 'Extensión de archivo inválido!'
    });
  }

  //generar el nombre del archivo - para que sean diferentes (uuidv4)
  const fileName = `${uuidv4()}.${extension}`;

  //generar el path donde se guardará la imagen
  const path = `./uploads/${ type }/${ fileName }`;

  //mover la imagen al path
  file.mv(path, (err) => {
    if (err) {
      console.log(err);
      return res.status(500).json({
        msg : 'Error. No se subió la imagen!'
      });
    }

    //Actualizar base de datos - helper - se borrará la imagen antigua si existe
    updateImage( type, id, fileName);


    res.status(200).json({
      msg : 'Imagen actualizada con exito!',
      fileName
    });

  });      
}

/*===========================================================
  GET IMAGE - type puede ser: users, medics, hospitals
============================================================*/
const getImage = (req, res) => {

  const type = req.params.type;
  const image = req.params.image;

  //creamos el path de la imagen a buscar
  const pathImage = path.join( __dirname, `../uploads/${type}/${image}` );

  //si existe la imagen, la enviamos
  if (fs.existsSync(pathImage)) {
    //lo enviamos como un archivo con sendFile()
    res.sendFile( pathImage );

    //si no existe enviamos una imagen por defecto
  } else {
    const pathImage = path.join( __dirname, `../uploads/no-image.jpg` );
    res.sendFile( pathImage );
  }

}





module.exports = {
  fileUpload,
  getImage
}