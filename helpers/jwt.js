const jwt = require('jsonwebtoken')


const generateJWT = (userId) => {
  //lo hago que sea promesa
  return new Promise( (resolve, reject) => {

    const payload = {
      userId
    };

    jwt.sign( payload, process.env.JWT_SECRET, {

      expiresIn: '12h'

    }, (error, token) => {

      if (error) {
        console.log(error);
        reject('Error! no se pudo generar el JWT');

      } else {
        resolve(token);
      }

    });

  })
}



module.exports = {
  generateJWT
}