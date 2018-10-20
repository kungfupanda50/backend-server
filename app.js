// Requires importacion de librerias
var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');

// importar rutas 
var appRoutes = require('./routes/app');
var usuarioRoutes = require('./routes/usuario');
var loginRoutes = require('./routes/login');

// Inicializar variables
    var app=express();
    // Bodyparser middleware
    // parse application/x-www-form-urlencoded
    app.use(bodyParser.urlencoded({ extended: false }));
    // parse application/json
    app.use(bodyParser.json());

// Conexion a la base de datos mongo
/*
mongoose.connection.openUri('mongodb://localhost:27017/hospitalDB', ( err, res )=>{

    if( err ) throw err;

    console.log('Base de datos mongo online');

});
*/

mongoose.connect('mongodb://localhost:27017/hospitalDB', { useNewUrlParser: true }, (err, res) =>{

    if (err) throw err;
    
    console.log('Base de Datos mongo ONLINE');

});


// Rutas     request, response, next
// esto se traslado dentro de ruutes/app.js para segmentarlo
// Esto solo se ejecuta si se consume el localhost:3000/ sin /usuario
/* app.get('/', (req, res, next) => {
        // 200 o 404 mensaje http
    res.status(200).json({
        ok: true,
        mensaje: 'Petición realizada correctamente',
        status: "Al fin"
    });

});   */ 

// Rutas para usar el otro archivo de rutas se referencia asi 
app.use('/usuario', usuarioRoutes);
app.use('/login', loginRoutes);
app.use('/', appRoutes);

// escuchar peticion
app.listen(3000, () =>{
    console.log('Express server puerto 3000 online');
});

// para probar el servidor se hace en consola node app 
// en el directorio del servidor
