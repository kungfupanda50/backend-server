// Requires importacion de librerias
var express = require('express');
var mongoose = require('mongoose');

// Inicializar variables
var app=express();

// Conexion a la base de datos mongo
mongoose.connection.openUri('mongodb://localhost:27017/hospitalDB', ( err, res )=>{

    if( err ) throw err;

    console.log('Base de datos mongo online');

})

// Rutas     request, response, next
app.get('/', (req, res, next) => {
        // 200 o 404 mensaje http
    res.status(200).json({
        ok: true,
        mensaje: 'Petición realizada correctamente',
        status: "cualquiera"
    })

});

// escuchar peticion
app.listen(3000, () => {
    console.log('Express server puerto 3000 online');
})

// para prbar el servidor se hace en consola node app 
// en el directorio del servidor
