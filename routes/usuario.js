// Requires importacion de librerias
var express = require('express');
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');

var mdAutenticacion = require('../middlewares/autenticacion');
// Inicializar variables
var app=express();
// traemos la referencia al schema
var Usuario = require('../models/usuario');


// Rutas     request, response, next
// función get
//=====================================
//   Obtener todos los usuarios
//=====================================
app.get('/', (req, res, next) => {

//     Usuario.find({}, (err, usuarios) => { asi era originalmente ahi pide todos los campos
//     pero si queremos solo algunos campos se cambia como sigue.    
    var desde = req.query.desde || 0;
    desde = Number(desde);

    Usuario.find({}, 'nombre email img role')
        .skip(desde)
        .limit(5)
        .exec( 
        (err, usuarios) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error cargando usuario',
                errors: err
            });
        }

        Usuario.countDocuments({}, (err, conteo)=>{
            res.status(200).json({
                ok: true,
                usuarios: usuarios,
                desde : desde,
                Total:  conteo,
                Comentario: "Siiiiii ya llegue hasta mongo (con get)!!!!!!"
            });  
        });
    
    })



});



// función post
//=====================================
//   Crear un nuevo usuario
//=====================================

app.post('/', // mdAutenticacion.verificaToken , 
(req, res) =>{
    // siempre que este inslado el body parser
   var body = req.body; 

   var usuario = new Usuario({
       nombre: body.nombre,
       email: body.email,
       password: bcrypt.hashSync(body.password, 10),
       img: body.img,
       role: body.role
   });



    usuario.save( ( err, usuarioGuardado ) =>{

        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Error al crear el usuario',
                errors: err
            });
        }

        res.status(201).json({
            ok: true,
            usuario: usuarioGuardado,
            usuariotoken: req.usuario
        });

    });

});


//=====================================
//   Modificar usuario
//=====================================
app.put('/:id', mdAutenticacion.verificaToken , (req, res) =>{

    var id = req.params.id;
    var body = req.body; 

    Usuario.findById( id, (err, usuario) =>{

        if (err) { // Error al recuperar el usuario
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar el usuario',
                errors: err
            });
        }

        if (!usuario) {   // El usuario no existe
            return res.status(400).json({
                ok: false,
                mensaje: 'El usuario con el id ' + id + ' no existe',
                errors: { message: 'No existe un usuario con ese ID'}
            });
        }

        usuario.nombre = body.nombre;
        usuario.email = body.email;
        usuario.role = body.role;

        usuario.save( ( err, usuarioGuardado ) =>{ //Error al guardar

            if (err) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Error al actualizar el usuario',
                    errors: err
                });
            }


            usuarioGuardado.password ='=)';

            res.status(200).json({
                ok: true,
                usuario: usuarioGuardado
            });   
        });
    });
});


//=====================================
//   Borrar usuario
//=====================================
app.delete('/:id', mdAutenticacion.verificaToken, (req, res) =>{
    var id = req.params.id;

    Usuario.findByIdAndRemove(id, (err, usuarioBorrado) =>{

        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al borrar usuario',
                errors: err
            });
        }
    
            
        if (!usuarioBorrado) {   // El usuario no existe
            return res.status(400).json({
                ok: false,
                mensaje: 'El usuario con el id ' + id + ' no existe',
                errors: { message: 'No existe un usuario con ese ID'}
            });
        }

        res.status(200).json({
            ok: true,
            usuario: usuarioBorrado
        });
        
    });

});


module.exports = app;
