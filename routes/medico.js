// Requires importacion de librerias
var express = require('express');
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');

var mdAutenticacion = require('../middlewares/autenticacion');
// Inicializar variables
var app=express();
// traemos la referencia al schema
var Medico = require('../models/medico');


// Rutas     request, response, next
// función get
//=====================================
//   Obtener todos los medicos
//=====================================
app.get('/', (req, res, next) => {

//     Usuario.find({}, (err, usuarios) => { asi era originalmente ahi pide todos los campos
//     pero si queremos solo algunos campos se cambia como sigue.   
    var desde = req.query.desde || 0;
    desde = Number(desde);

    Medico.find({})
        .skip(desde)
        .limit(5)
        .populate('usuario', 'nombre email')
        .populate('hospital')
        .exec( (err, medicos) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error cargando Medicos',
                errors: err
            });
        }

        Medico.countDocuments({}, (err,  conteo)=>{
            res.status(200).json({
                ok: true,
                medicos: medicos,
                total: conteo
            });
        });
    
    })



});



// función post
//=====================================
//   Crear un nuevo médico
//=====================================

app.post('/', mdAutenticacion.verificaToken ,(req, res) =>{
    // siempre que este inslado el body parser
   var body = req.body; 

   var medico = new Medico({
       nombre: body.nombre,
       usuario: req.usuario._id,
       hospital: body.hospital
   });

   medico.save( ( err, medicoGuardado ) =>{

        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Error al crear el médico',
                errors: err
            });
        }

        res.status(201).json({
            ok: true,
            medico: medicoGuardado,
            usuariotoken: req.medico
        });

    });

});


//=====================================
//   Modificar médico
//=====================================
app.put('/:id', mdAutenticacion.verificaToken , (req, res) =>{

    var id = req.params.id;
    var body = req.body; 

    Medico.findById( id, (err, medico) =>{

        if (err) { // Error al recuperar el medico
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar el médico',
                errors: err
            });
        }

        if (!medico) {   // El médico no existe
            return res.status(400).json({
                ok: false,
                mensaje: 'El médico con el id ' + id + ' no existe',
                errors: { message: 'No existe un médico con ese ID'}
            });
        }

        medico.nombre = body.nombre;
        medico.usuario = req.usuario._id;
        medico.hospital = body.hospital;

        medico.save( ( err, medicoGuardado ) =>{ //Error al guardar

            if (err) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Error al actualizar el médico',
                    errors: err
                });
            }

            res.status(200).json({
                ok: true,
                medico: medicoGuardado
            });   
        });
    });
});


//=====================================
//   Borrar médico
//=====================================
app.delete('/:id', mdAutenticacion.verificaToken, (req, res) =>{
    var id = req.params.id;

    Medico.findByIdAndRemove(id, (err, medicoBorrado) =>{

        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al borrar medico',
                errors: err
            });
        }
    
            
        if (!medicoBorrado) {   // El medico no existe
            return res.status(400).json({
                ok: false,
                mensaje: 'El médico con el id ' + id + ' no existe',
                errors: { message: 'No existe un médico con ese ID'}
            });
        }

        res.status(200).json({
            ok: true,
            medico: medicoBorrado
        });
        
    });

});


module.exports = app;
