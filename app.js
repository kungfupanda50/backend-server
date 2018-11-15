// Requires importacion de librerias
var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var morgan = require('morgan');
var mysql = require('mysql');
var myConnection = require('express-myconnection');

// importar rutas 
var appRoutes = require('./routes/app');
var usuarioRoutes = require('./routes/usuario');
var loginRoutes = require('./routes/login');
var loginMySqlRoutes = require('./routes/loginMySql');
var hospitalRoutes = require('./routes/hospital');
var medicolRoutes = require('./routes/medico');
var busquedalRoutes = require('./routes/busqueda');
var uploadRoutes = require('./routes/upload');
var uploadMySqlRoutes = require('./routes/uploadMySql');
var imagenesRoutes = require('./routes/imagenes');
var usuarioMySqlRoutes = require('./routes/usuarioMySql');

// Inicializar variables
var app=express();

// middlewares
    // Bodyparser middleware
    // parse application/x-www-form-urlencoded
    app.use(bodyParser.urlencoded({ extended: false }));
    app.use(bodyParser.json());
    
    
    //app.use(express.urlencoded({extended: false}));		
    //urlencoded es un metodo de express que le permite entender todo lo recibido en post						
    //false significa que no va a recibir imágenes ni datos codificados						



    // Morgan middleware parecido a bodyParser
    app.use(morgan('dev'));
    app.use(myConnection(mysql,{
        host: 'localhost',
        user: 'root',
        password: '',
        port: 3306,
        database: 'paciente'
    }, 'single'));


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

/* var serveIndex = require('serve-index');
app.use(express.static(__dirname + '/'))
app.use('/uploads', serveIndex(__dirname + '/uploads')); */

// Rutas para usar el otro archivo de rutas se referencia asi 
app.use('/usuario', usuarioRoutes);
app.use('/login', loginRoutes);
app.use('/loginMySql', loginMySqlRoutes);
app.use('/hospital', hospitalRoutes);
app.use('/medico', medicolRoutes);
app.use('/busqueda', busquedalRoutes);
app.use('/upload', uploadRoutes);
app.use('/uploadMySql', uploadMySqlRoutes);
app.use('/img', imagenesRoutes);
app.use('/usuarioMySql', usuarioMySqlRoutes);
app.use('/', appRoutes);

// escuchar peticion
// Iniciando el servidor
app.set('port', process.env.PORT || 3000);
app.listen(app.get('port'), () =>{
    console.log('Express server puerto ' + app.get('port') + ' online   =)');
});

// para probar el servidor se hace en consola node app 
// en el directorio del servidor
