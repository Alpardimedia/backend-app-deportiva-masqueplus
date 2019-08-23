var express = require('express');

var app = express();

var Categoria = require('../models/categoria');
var Usuario = require('../models/usuario');

// ==============================================================
// Búsqueda por colección
// ==============================================================
app.get('/coleccion/:tabla/:busqueda', (req, res) => {
    var busqueda = req.params.busqueda;
    var tabla = req.params.tabla;
    var regurar = new RegExp(busqueda, 'i');

    var promesa;

    switch(tabla) {
        case 'usuarios':
            promesa = buscarUsuarios(busqueda, regurar);
        break;

        case 'categorias':
            promesa = buscarCategorias(busqueda, regurar);
        break;
        
        default:
            return res.status(400).json({
                ok: false,
                mensaje: 'No se ha podido realizar la búsqueda',
                error: {message: 'No se ha podido realizar la búsqueda'}
            });
    }

    promesa.then(data => {
        res.status(200).json({
            ok: true,
            [tabla]: data
        });
    });
});

// ==============================================================
// Búsqueda general
// ==============================================================
app.get('/todo/:busqueda', (req, res, next) => {

    var busqueda = req.params.busqueda;
    var regurar = new RegExp(busqueda, 'i');

    Promise.all([buscarCategorias(busqueda, regurar), buscarUsuarios(busqueda, regurar)])
        .then(respuestas => {
            res.status(200).json({
                ok: true,
                categorias: respuestas[0],
                usuarios: respuestas[1]
            });
        }
    );
});

function buscarCategorias(busqueda, regurar) {

    return new Promise((resolve, reject) => {
        Categoria.find({nombre: regurar}, (err, categorias) => {
            if(err) {
                reject('Error al cargar categorias', err);
            } else {
                resolve(categorias);
            }
        });
    });
}

function buscarUsuarios(busqueda, regurar) {

    return new Promise((resolve, reject) => {
        Usuario.find()
                .or([{'nombre': regurar}, {'email': regurar}])
                .exec((err, usuarios) => {
                    if(err) {
                        reject('Error al cargar usuarios', err);
                    }else {
                        resolve(usuarios);
                    }
                });
    });
}

module.exports = app;