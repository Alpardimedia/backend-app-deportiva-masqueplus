var express = require('express');

var mdAutenticacion = require('../middlewares/autenticacion');

var app = express();

var Categoria = require('../models/categoria');

// ==============================================================
// Obtener todos los categorias
// ==============================================================

app.get('/', (req, res, next) => {

    var desde = req.query.desde || 0;
    desde = Number(desde);

    Categoria.find({})
    .populate('usuario', 'nombre email')
    .skip(desde)
    .limit(5)
    .exec(
        (err, categorias) => {
        
            if(err) {
                return res.status(500).json({
                    ok: false,
                    mensaje: 'Error al cargar las categorias',
                    errors: err
                });
            }
    
            Categoria.count({}, (err, contador) => {
                res.status(200).json({
                    ok: true,
                    total: contador,
                    categorias: categorias
                });
            });
    
        }
    );
});

// ==============================================================
// Crear una nueva categoria
// ==============================================================
app.post('/', mdAutenticacion.verificaToken, (req, res) => {
    var body = req.body;

    var categoria = new Categoria({
        nombre: body.nombre,
        slug: body.slug,
        descripcion: body.descripcion,
        usuario: req.usuario._id
    });
    
    categoria.save((err, categoriaGuardada) => {
        if(err) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Error al crear categoria',
                errors: err
            });
        }

        res.status(201).json({
            ok: true,
            categoria: categoriaGuardada
        });
    });
});

// ==============================================================
// Actualizar categoria
// ==============================================================
app.put('/:id', mdAutenticacion.verificaToken, (req, res) => {
    var id = req.params.id;
    var body = req.body;

    Categoria.findById(id, (err, categoria) => {
        if(err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar categoria',
                errors: err
            });
        }

        if(!categoria) {
            return res.status(400).json({
                ok: false,
                mensaje: 'La categoria con el id ' + id + ' no existe',
                errors: { message: 'No existe la categoria con ese ID' }
            });
        }

        categoria.nombre = body.nombre;
        categoria.slug = body.slug;
        categoria.descripcion = body.descripcion;
        categoria.usuario = req.usuario._id;

        categoria.save((err, categoriaGuardada) => {
            if(err) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Error al actualizar categoria',
                    body: body
                });
            }

            res.status(200).json({
                ok: true,
                categoria: categoriaGuardada
            });
        });
    });
});

// ==============================================================
// Borrar una categoria por el id
// ==============================================================
app.delete('/:id', mdAutenticacion.verificaToken, (req, res) => {
    var id = req.params.id;

    Categoria.findByIdAndRemove(id, (err, categoriaBorrada) => {
        if(err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al borrar la categoria',
                errors: err
            });
        }

        if(!categoriaBorrada) {
            return res.status(400).json({
                ok: false,
                mensaje: 'No existe una categoria con ese ID',
                errors: {message: 'Este error es debido a que no hay, en la base de datos, ninguna categoria con ese ID'}
            });
        }

        res.status(200).json({
            ok: true,
            categoria: categoriaBorrada
        });
    });
});

module.exports = app;