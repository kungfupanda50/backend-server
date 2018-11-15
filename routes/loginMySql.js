// Requires importacion de librerias
var express = require('express');
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');

var SEED = require('../config/config.ts').SEED;
// Inicializar variables
var app=express();
// traemos la referencia al schema
// var Usuario = require('../models/usuario');

app.post('/', (req, res) =>{
    // siempre que este inslado el body parser
    var body = req.body; 
    var correo = body.email;

    req.getConnection((err, conn) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Error al conectarse a base de datos',
                errors: err
            });
        };

        var textquery = "Select * FROM usuarios WHERE email = '" + correo + "'";

        conn.query(textquery, (err, rows)=>{

            if (err) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Credenciales incorrectas',   //Este error podria ser por cualquier cosa
                    errors: err
                });
            }
          
            if( rows == '' ) {

                return res.status(400).json({
                    ok: false,
                    mensaje: 'Credenciales incorrectas'    // No se encontro el email 
                });
            }
            

            if( !bcrypt.compareSync(  body.password, rows[0].password ) ){
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Credenciales incorrectas'  //falla el password
                });
            }    
           

            // Crear un token !!!
            rows[0].password = '=)';
            token = jwt.sign({ usuario: rows[0] }, SEED, {expiresIn: 14400});  // 4 horas

            res.status(200).json({
                ok: true,
                usuario: rows[0],
                token: token,
                id: rows._id,
            });   
        });
    });
});


module.exports = app;
