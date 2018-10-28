// Requires importacion de librerias
var express = require('express');
const path = require('path');
const fs = require('fs');

// Inicializar variables
var app=express();


// Rutas     request, response, next

app.get('/:tipo/:img', (req, res, next) => {

    var tipo = req.params.tipo;
    var img = req.params.img;

//  __dirname = ruta actual

    var pathImagen = path.resolve( __dirname, `../uploads/${ tipo }/${ img }` );

    if( fs.existsSync( pathImagen ) ){
        res.sendFile( pathImagen );
    }else{
        var pathNoImagen = path.resolve( __dirname, '../assets/no-img.jpg' );
        res.sendfile(pathNoImagen);
    }


    // 200 o 404 mensaje http
/*     res.status(200).json({
        ok: true,
        mensaje: 'Petición get realizada correctamente desde routas/app.js',
        status: "prueba inicial de conexión con bd" + pathImagen
    }) */

});

module.exports = app;
