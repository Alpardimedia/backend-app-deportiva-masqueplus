var express = require('express');
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');

var mdAutenticacion = require('../middlewares/autenticacion');

var app = express();

var Usuario = require('../models/usuario');

// ==============================================================
// Obtener todos los usuarios
// ==============================================================

app.get('/', (req, res, next) => {

    Usuario.find({}, 'nombre codigo_postal password movil fecha_nacimiento genero email img role').exec(
        (err, usuarios) => {
        
            if(err) {
                return res.status(500).json({
                    ok: false,
                    mensaje: 'Error al cargar los usuarios',
                    errors: err
                });
            }
    
            res.status(200).json({
                ok: true,
                usuarios: usuarios
            });
    
        }
    );
});

// ==============================================================
// Crear un nuevo usuario
// ==============================================================
app.post('/', mdAutenticacion.verificaToken, (req, res) => {
    var body = req.body;

    // Método para generar una contraseña aleatoria con números y letras
    var caracteres = "abcdefghijkmnpqrtuvwxyzABCDEFGHJKMNPQRTUVWXYZ2346789";
    var clave = "";

    for (i = 0; i < 8; i++) {
        clave += caracteres.charAt(Math.floor(Math.random() * caracteres.length));
    }

    var usuario = new Usuario({
        nombre: body.nombre,
        codigo_postal: body.codigo_postal,
        movil: body.movil,
        fecha_nacimiento: body.fecha_nacimiento,
        genero: body.genero,
        email: body.email,
        // password: clave,
        // password: bcrypt.hashSync(clave),
        password: bcrypt.hashSync(body.password),
        img: body.img,
        role: body.role
    });
    
    usuario.save((err, usuarioGuardado) => {
        if(err) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Error al crear usuario',
                errors: err
            });
        }

        res.status(201).json({
            ok: true,
            usuario: usuarioGuardado,
            usuariotoken: req.usuario
        });
    });
});

// ==============================================================
// Actualizar usuario
// ==============================================================
app.put('/:id', mdAutenticacion.verificaToken, (req, res) => {
    var id = req.params.id;
    var body = req.body;

    Usuario.findById(id, (err, usuario) => {
        if(err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar usuario',
                errors: err
            });
        }

        if(!usuario) {
            return res.status(400).json({
                ok: false,
                mensaje: 'El usuario con el id ' + id + ' no existe',
                errors: { message: 'No existe un usuario con ese ID' }
            });
        }

        usuario.nombre = body.nombre,
        // usuario.codigo_postal = body.codigo_postal,
        usuario.movil = body.movil,
        // usuario.fecha_nacimiento = body.fecha_nacimiento,
        // usuario.genero = body.genero,
        usuario.email = body.email,
        usuario.role = body.role;

        usuario.save((err, usuarioGuardado) => {
            if(err) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Error al actualizar usuario',
                    body: body
                });
            }

            usuarioGuardado.password = ' ';

            res.status(200).json({
                ok: true,
                usuario: usuarioGuardado
            });
        });
    });
});

// ==============================================================
// Borrar un usuario por el id
// ==============================================================
app.delete('/:id', mdAutenticacion.verificaToken, (req, res) => {
    var id = req.params.id;

    Usuario.findByIdAndRemove(id, (err, usuarioBorrado) => {
        if(err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al borra el usuario',
                errors: err
            });
        }

        if(!usuarioBorrado) {
            return res.status(400).json({
                ok: false,
                mensaje: 'No existe un usuario con ese ID',
                errors: {message: 'Este error es debido a que no hay, en la base de datos, ningún usuario con ese ID'}
            });
        }

        res.status(200).json({
            ok: true,
            usuario: usuarioBorrado
        });
    });
});

module.exports = app;