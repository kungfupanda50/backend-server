// Requires importacion de librerias
var express = require('express');
var Hospital = require('../models/hospital');
var Medicos = require('../models/medico');
var Usuario = require('../models/usuario');

// Inicializar variables
var app=express();

// =========================
//  Busqueda por colección
// =========================

app.get('/coleccion/:tabla/:busqueda', (req, res, next) => {
    var tabla = req.params.tabla;
    var busqueda = req.params.busqueda;
    var regex = new RegExp( busqueda, 'i' );

/*     if(tabla = 'usuario'){
        buscarUsuarios( busqueda, regex );
    }else{
        if(tabla = 'hospital'){
            buscarHospitales( busqueda, regex);
        }else{
            if(tabla = 'medico'){
                buscarMedicos( busqueda, regex);
            }else{
                return res.status(400).json({
                    ok: false,
                    mensaje: 'No existe la tabla solicitada solamente: usuario, medico y hospital',
                    error: { message: 'Tipo de tabla/colección no válido' }
                });
            }
        }
    } */

    switch (tabla) {
        case 'usuario':
            promesa = buscarUsuarios( busqueda, regex );
        break;

        case 'medico':
            promesa = buscarMedicos( busqueda, regex );
        break;  

        case 'hospital':
            promesa = buscarHospitales( busqueda, regex );
        break;  
        default:
        return res.status(400).json({
            ok: false,
            mensaje: 'No existe la tabla solicitada solamente: usuario, medico y hospital',
            error: { message: 'Tipo de tabla/colección no válido' }
        });
    }

    promesa.then(data =>{
        res.status(200).json({
            ok: true,
            [tabla]: data
        });
    });
});


// =========================
//  Busqueda General
// =========================
app.get('/todo/:busqueda', (req, res, next) => {

        var busqueda = req.params.busqueda;
        var regex = new RegExp( busqueda, 'i' );  // Expresion regular en lugar de poner
        //    /norte/i que significa busque todo lo que sea norte de forma insensible
        Promise.all([
            buscarHospitales( busqueda, regex ),
            buscarMedicos( busqueda, regex ),
            buscarUsuarios( busqueda, regex ) 
        ])
        .then( respuestas =>{

                res.status(200).json({
                    ok: true,
                    hospitales: respuestas[0],
                    medicos: respuestas[1],
                    usuarios: respuestas[2]
                });
        });

       // Hospital.find({ nombre: regex }, (err, hospitales) => {
       // });

});

function buscarHospitales( busqueda, regex ){
    return new Promise( ( resolve, reject ) => {
        Hospital.find({ nombre: regex })
              .populate('usuario', 'nombre email')
              .exec((err, hospitales) => {
            if(err){
               reject('Error al cargar hospitales', err); 
            }else{
                resolve(hospitales)
            }
        })
    });
}

function buscarMedicos( busqueda, regex ){
    return new Promise( ( resolve, reject ) => {
        Medicos.find({ nombre: regex }, (err, medicos) => {
            if(err){
               reject('Error al cargar medicos', err); 
            }else{
                resolve(medicos)
            }
        })
    });
}

function buscarUsuarios( busqueda, regex ){  //busqueda en dos campos
    return new Promise( ( resolve, reject ) => {
        Usuario.find({}, 'nombre email role')     // quitar el password
               .or([ {'nombre': regex}, {'email': regex}])
               .exec( (err, usuarios)=>{
                    if(err){
                        reject('Error al cargar usuario', err); 
                    }else{
                        resolve(usuarios)
                    }
               })
    });
}

module.exports = app;
