// Requires importacion de librerias
var express = require('express');


// Inicializar variables
var app=express();


// Rutas     request, response, next

app.get('/', (req, res, next) => {
    // 200 o 404 mensaje http
res.status(200).json({
    ok: true,
    mensaje: 'Petición get realizada correctamente desde routas/app.js',
    status: "prueba inicial de conexión con bd"
})

});

module.exports = app;
