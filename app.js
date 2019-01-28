// Requires importacion de librerias
var express = require('express');
// var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var morgan = require('morgan');
var mysql = require('mysql');
var myConnection = require('express-myconnection');
var cors = require('cors');

// importar rutas 
var appRoutes = require('./routes/app');
var loginMySqlRoutes = require('./routes/loginMySql');
var medicoMysqlRoutes = require('./routes/medicoMySql');
//var busquedalRoutes = require('./routes/busqueda'); ejemplo mongo
var uploadMySqlRoutes = require('./routes/uploadMySql');
var imagenesRoutes = require('./routes/imagenes');
var usuarioMySqlRoutes = require('./routes/usuarioMySql');
// Inicializar variables
var app=express();

// middlewares
    // CORS
    app.use(cors());
    // Aqui están abiertas cualquier conexión desde cualquier lado, habria que configurarlo
    // para que por ejemplo solo se pueda conectar desde ciertas ip o dominios

    // Bodyparser middleware
    // parse application/x-www-form-urlencoded
    app.use(bodyParser.urlencoded({ extended: false }));
    app.use(bodyParser.json());
    
    
    //app.use(express.urlencoded({extended: false}));		
    //urlencoded es un metodo de express que le permite entender todo lo recibido en post						
    //false significa que no va a recibir imágenes ni datos codificados						

    // Morgan middleware parecido a bodyParser
    app.use(morgan('dev'));

    // Conexion a la base de datos MySql    
    app.use(myConnection(mysql,{
        host: 'localhost',
        user: 'root',
        password: '',
        port: 3306,
        database: 'paciente'
    }, 'single'));

/*                       // Conexion a la base de datos mongo
mongoose.connect('mongodb://localhost:27017/hospitalDB', { useNewUrlParser: true }, (err, res) =>{
    if (err) throw err;
    console.log('Base de Datos mongo ONLINE');
});   */


/* var serveIndex = require('serve-index');
app.use(express.static(__dirname + '/'))
app.use('/uploads', serveIndex(__dirname + '/uploads')); */

// Rutas para usar el otro archivo de rutas se referencia asi 

app.use('/loginMySql', loginMySqlRoutes);
app.use('/medicoMySql', medicoMysqlRoutes);
// app.use('/busqueda', busquedalRoutes);
app.use('/uploadMySql', uploadMySqlRoutes);
app.use('/img', imagenesRoutes);
app.use('/usuarioMySql', usuarioMySqlRoutes);
app.use('/', appRoutes);

// escuchar peticion
// Iniciando el servidor
app.set('port', process.env.PORT || 3000);
app.listen(app.get('port'), () =>{
    console.log('Servidor backend escuchando en puerto ' + app.get('port') + ' en linea   = )');
});

// para probar el servidor se hace en consola node app 
// en el directorio del servidor
