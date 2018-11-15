// Requires importacion de librerias
var express = require('express');
var fileUpload = require('express-fileupload');
var fs = require('fs');

// Inicializar variables
var app=express();

// default options
app.use(fileUpload());

// Rutas     request, response, next

app.put('/:tipo/:id', (req, res, next) => {   // donde tipo=tipo de imagen y id = idusuario
 
 var tipo = req.params.tipo;   //usuario, hospital o médico
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

    // Extensiones que aceptaremos (las que nosotros queramos)
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

  archivo.mv( path, err => {
        if( err ){
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al mover archivo',
                errors: err
            });
        }

        subirPorTipo( tipo, id, nombreArchivo, req, res )
  })


})

function subirPorTipo( tipo, id, nombreArchivo, req, res ){
   if( tipo === 'usuarios'){ 

        req.getConnection((err, conn) => {
                
            if (err) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Error al conectarse a base de datos',
                    errors: err
                });
            };
        
            var sqltext='Select img as Reg FROM usuarios WHERE _id = ' +  id;
            conn.query(sqltext, (err, rows)=>{

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


                var pathViejo = './uploads/usuarios/' + rows[0].Reg;

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

                conn.query('UPDATE usuarios set img = ? WHERE _id = ?', [nombreArchivo, id], (err, rows) => {

                    if (err) { // Error al actualizar el usuario
                        return res.status(500).json({
                            ok: false,
                            mensaje: 'Error al actualizar la imagen en el usuario',
                            errors: err
                        });
                    }

                    return res.status(200).json({
                        ok: true,
                        mensaje: 'Imagen de usuario actualizada',
                        usuario: rows
                    });
                });
                
            });
        }); 
    }


        ////////////

    /*
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
    } */

}

module.exports = app;
