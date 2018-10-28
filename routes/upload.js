// Requires importacion de librerias
var express = require('express');
var fileUpload = require('express-fileupload');
var fs = require('fs');
var Usuario = require('../models/usuario');
var Hospital = require('../models/hospital');
var Medico = require('../models/medico');

// Inicializar variables
var app=express();

// default options
app.use(fileUpload());

// Rutas     request, response, next

app.put('/:tipo/:id', (req, res, next) => {   // donde tipo=tipo de imagen y id = idusuario
 
 var tipo = req.params.tipo;
 var id = req.params.id;
 
    if ( !req.files ){
            return res.status(400).json({
                ok: false,
                mensaje: 'No selecciono nada',
                errors: {message: 'Debe seleccionar una imagen'}
            });

    }

    //  obtener el nombre del archivo
    var archivo = req.files.imagen;
    var nombreCortado = archivo.name.split('.');
    var extensionArchivo = nombreCortado[ nombreCortado.length -1 ];

    // Extensiones que aceptaremos
    var extensionesValidas =['png', 'jpg', 'gif', 'jpeg'];

    if(extensionesValidas.indexOf( extensionArchivo ) < 0 ){
        return res.status(400).json({
            ok: false,
            mensaje: 'Extension no válida',
            errors: { message: 'Las extensiones válidas son ' + extensionesValidas.join(', ') }
        })
    }

        // Nombre de archivo personalizado
        //   ej. iddelusuario-random.png
   var nombreArchivo = `${ id }-${ new Date().getMilliseconds() }.${ extensionArchivo }`;

    // tipos de coleccion
    var tiposValidos= ['hospitales', 'medicos', 'usuarios'];
    if( tiposValidos.indexOf( tipo ) < 0){
            return res.status(400).json({
            ok: false,
            mensaje: 'Tipo de colección no válida',
            errors: { message: 'Las tipos válidas son ' + tiposValidos.join(', ') }
        })

    }

    // Mover el archivo del temporal a un path 
    var path = `./uploads/${ tipo }/${ nombreArchivo }`

  archivo.mv( path, err=> {
        if( err ){
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al mover archivo',
                errors: err
            });
        }

        subirPorTipo( tipo, id, nombreArchivo, res )


  })


})

function subirPorTipo( tipo, id, nombreArchivo, res ){
   if( tipo === 'usuarios'){     
    Usuario.findById(id, (err, usuario) =>{

        var pathViejo = './uploads/usuarios/' + usuario.img;
        // Si existe el archivo, lo elimina.
        if( fs.existsSync(pathViejo) ){
            fs.unlink( pathViejo , (err)=>{
                if(err){
                    return res.status(500).json({
                        ok: false,
                        mensaje: 'Error al eliminar el archivo',
                        errors: { message: 'Error: ', err } 
                    });
                };
            });
        } 

        usuario.img = nombreArchivo;

        // grabando la img en el usuario
        usuario.save((err, usuarioActualizado)=>{
        // falta validar el err
        usuarioActualizado.password ='=)';
            return res.status(200).json({
                ok: true,
                mensaje: 'Imagen de usuario actualizada',
                usuario: usuarioActualizado
            });
        })
    })
   }

   if( tipo === 'hospitales'){     
    Hospital.findById(id, (err, hospital) => {

        var pathViejo = './uploads/hospitales/' + hospital.img;
        // Si existe el archivo, lo elimina.
        if( fs.existsSync(pathViejo) ){
            fs.unlink( pathViejo , (err)=>{
                if(err){
                    return res.status(500).json({
                        ok: false,
                        mensaje: 'Error al eliminar el archivo',
                        errors: { message: 'Error: ', err } 
                    });
                };
            });
        }

        hospital.img = nombreArchivo;

        // grabando la img en el hospital
        hospital.save((err, hospitalActualizado) =>{
        // falta validar el err

            return res.status(200).json({
                ok: true,
                mensaje: 'Imagen de hospital actualizada',
                hospital: hospitalActualizado
            });
        })
    })
   }

    if( tipo === 'medicos'){     
    Medico.findById(id, (err, medico) =>{

        var pathViejo = './uploads/medicos/' + medico.img;
        // Si existe el archivo, lo elimina.
        if( fs.existsSync(pathViejo) ){
            fs.unlink( pathViejo , (err)=>{
                if(err){
                    return res.status(500).json({
                        ok: false,
                        mensaje: 'Error al eliminar el archivo',
                        errors: { message: 'Error: ', err } 
                    });
                };
            });
        }

        medico.img = nombreArchivo;

        // grabando la img en el medico
        medico.save((err, medicoActualizado)=>{
        // falta validar el err

            return res.status(200).json({
                ok: true,
                mensaje: 'Imagen de medico actualizada',
                medico: medicoActualizado
            });
        })
    })
   } 

}

module.exports = app;
