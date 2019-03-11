// Requires importacion de librerias
var express = require('express');
var bcrypt = require('bcryptjs');

var mdAutenticacion = require('../middlewares/autenticacion');
// Inicializar variables
var app=express();
// traemos la referencia al schema
////////////var Usuario = require('../models/usuario');

// Rutas     request, response, next
// función get
//=====================================
//   Obtener todos los usuarios
//=====================================
app.get('/', (req, res, next) => {

//     Usuario.find({}, (err, usuarios) => { asi era originalmente ahi pide todos los campos
//     pero si queremos solo algunos campos se cambia como sigue.    

    req.getConnection((err, conn) => {  //conectandose a mysql
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error cargando usuario',
                errors: err
            });
        }

        conn.query('SELECT _id, email, role, nombre, img, "=)" as password FROM usuarios', (err, usuarios)=>{
            if(err){
                res.json(err);  //error en sql
            }
           // console.log(usuarios);
           usuarios.password = '= )';
            res.status(200).json({
                ok: true,
                usuariosx: usuarios,
                Comentario: "Siiiiii ya llegue hasta MySql !!!!!!"
            });  
        });
    });

});


// función post
//=====================================
//   Crear un nuevo usuario
//=====================================

app.post('/', //mdAutenticacion.verificaToken, 
(req, res) => {
    // siempre que este inslado el body parser
   var body = req.body; 

   var usuario = {
       nombre: body.nombre,
       email: body.email,
       password: bcrypt.hashSync(body.password, 10),
       img: body.img,
       role: body.role
   };

    req.getConnection((err, conn) => {  //conectandose a mysql
        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Error al conectarse a base de datos',
                errors: err
            });
        };
    
        conn.query('INSERT INTO usuarios SET ?', [usuario], (err, usuarioGuardado)=>{
            if (err) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Error al crear el usuario',
                    errors: err
                });
            };
          
            res.status(201).json({
                ok: true,
                DatosDeGuardado: usuarioGuardado,
                usuariotoken: req.usuario
            });

        });
    });
});


//=====================================
//   Modificar usuario
//=====================================

app.put('/:id', mdAutenticacion.verificaToken, (req, res) =>{
    var id = req.params.id;
    var body = req.body; 

    req.getConnection((err, conn) => {
             
        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Error al conectarse a base de datos',
                errors: err
            });
        };
      
        conn.query('Select nombre as Reg, password FROM usuarios WHERE _id = ?', id, (err, rows)=>{

            if (err) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Error buscando el usuario',
                    errors: { message: 'Error: En el usuario con el id ' + id }
                });
            }

            if( rows == '' ) {

                return res.status(200).json({
                    ok: false,
                    mensaje: 'No existe un usuario con ese ID',
                    errors: { message: 'El usuario con el id ' + id + ' no existe '}
                    });

            }
            
            if ( body.password="=)" ) {
                body.password=rows[0].password;
            };
            
            conn.query('UPDATE usuarios set ? WHERE _id = ?', [body, id], (err, rows) => {

                if (err) { // Error al actualizar el usuario
                    return res.status(500).json({
                        ok: false,
                        mensaje: 'Error al actualizar el usuario',
                        errors: err
                    });
                }

                //rows.password ='=)';

                res.status(200).json({
                    ok: true,
                    usuario: rows
                });
            });
            
        });
    }); 
});


//=====================================
//   Borrar usuario
//=====================================
app.delete('/:id', mdAutenticacion.verificaToken, (req, res) =>{
    var id = req.params.id;
    
    req.getConnection((err, conn) => {  //conectandose a mysql
        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Error al conectarse a base de datos',
                errors: err
            });
        };
       
        conn.query('Select nombre as Reg FROM usuarios WHERE _id = ?', id, (err, rows)=>{
            if (err) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Error buscando el usuario',
                    errors: { message: 'Error: En el usuario con el id ' + id }
                });
            }

           if( rows == '' ) {

                return res.status(200).json({
                    ok: false,
                    mensaje: 'No existe un usuario con ese ID',
                    errors: { message: 'El usuario con el id ' + id + ' no existe '}
                    });

            }

            conn.query('DELETE FROM usuarios WHERE _id = ?', [id], (err, DatosBorrados)=>{
                if (err) {
                    return res.status(500).json({
                        ok: false,
                        mensaje: 'Error al borrar usuario',
                        errors: err
                    });
                }
      
                res.status(200).json({
                    ok: true,
                    DatosDeBorrado: DatosBorrados
                });
            });
        });
    });
});

module.exports = app;
