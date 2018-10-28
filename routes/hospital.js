// Requires importacion de librerias
var express = require('express');

var mdAutenticacion = require('../middlewares/autenticacion');
// Inicializar variables
var app=express();
// traemos la referencia al schema
var Hospital = require('../models/hospital');


// Rutas     request, response, next
// función get
//=====================================
//   Obtener todos los hospitales
//=====================================
app.get('/', (req, res, next) => {

//     Usuario.find({}, (err, usuarios) => { asi era originalmente ahi pide todos los campos
//     pero si queremos solo algunos campos se cambia como sigue.  

    var desde = req.query.desde || 0;
    desde = Number(desde);

    Hospital.find({})
        .skip(desde)
        .limit(5)
        .populate('usuario', 'nombre email')
        .exec(
            (err, hospitles) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    mensaje: 'Error cargando Hospital',
                    errors: err
                });
            }

        Hospital.countDocuments({}, (err, conteo)=>{
            res.status(200).json({
                ok: true,
                Hospitales: hospitles,
                total: conteo
            });    
        });
        
    })



});



// función post
//=====================================
//   Crear un nuevo hospital
//=====================================

app.post('/', mdAutenticacion.verificaToken ,(req, res) =>{
    // siempre que este inslado el body parser
   var body = req.body; 

   var hospital = new Hospital({
       nombre: body.nombre,
       usuario: req.usuario._id
   });

   hospital.save( ( err, hospitalGuardado ) =>{

        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Error al crear el hospital',
                errors: err
            });
        }

        res.status(201).json({
            ok: true,
            hospital: hospitalGuardado
        });

    });

});


//=====================================
//   Modificar hospital
//=====================================
app.put('/:id', mdAutenticacion.verificaToken , (req, res) =>{

    var id = req.params.id;
    var body = req.body; 

    Hospital.findById( id, (err, hospital) =>{

        if (err) { // Error al recuperar el hospital
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar el hospital',
                errors: err
            });
        }

        if (!hospital) {   // El hospital no existe
            return res.status(400).json({
                ok: false,
                mensaje: 'El hospital con el id ' + id + ' no existe',
                errors: { message: 'No existe un hospital con ese ID'}
            });
        }

        hospital.nombre = body.nombre;
        hospital.usuario = req.usuario._id;

        hospital.save( ( err, hospitalGuardado ) =>{ //Error al guardar

            if (err) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Error al actualizar el hospital',
                    errors: err
                });
            }

            res.status(200).json({
                ok: true,
                hospital: hospitalGuardado
            });   
        });
    });
});


//=====================================
//   Borrar hospital
//=====================================
app.delete('/:id', mdAutenticacion.verificaToken, (req, res) =>{
    var id = req.params.id;

    Hospital.findByIdAndRemove(id, (err, hospitalBorrado) =>{

        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al borrar hospital',
                errors: err
            });
        }
    
            
        if (!hospitalBorrado) {   // El hospital no existe
            return res.status(400).json({
                ok: false,
                mensaje: 'El hospital con el id ' + id + ' no existe',
                errors: { message: 'No existe un hospital con ese ID'}
            });
        }

        res.status(200).json({
            ok: true,
            hospital: hospitalBorrado
        });
        
    });

});


module.exports = app;
