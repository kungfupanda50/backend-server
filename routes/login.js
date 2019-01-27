// Requires importacion de librerias
var express = require('express');
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');

var SEED = require('../config/config.ts').SEED;
// Inicializar variables
var app=express();
// traemos la referencia al schema
var Usuario = require('../models/usuario');

app.post('/', (req, res) =>{
    // siempre que este inslado el body parser
    var body = req.body; 

    Usuario.findOne({ email: body.email }, (err, usuarioDB)=>{
/*
        if (err) {
            console.log('prueba');
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar usuario',
                errors: err
            });
        }

*/
        if (!usuarioDB) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Credenciales incorrectas - email',   //no mostrar email en produccion
                errors: err
            });
        }
/*
        if( !bcrypt.compareSync( body.password, usuarioDB.password) ){
            return res.status(400).json({
                ok: false,
                mensaje: 'Credenciales incorrectas - password',   //no mostrar password en produccion
                errors: err
            });
        }

        // Crear un token !!!
        usuarioDB.password = '=)';
        token = jwt.sign({ usuario: usuarioDB }, SEED, {expiresIn: 14400});  // 4 horas

        res.status(200).json({
            ok: true,
            usuario: usuarioDB,
            token: token,
            id: usuarioDB._id
        });
        */
    });
});


module.exports = app;
