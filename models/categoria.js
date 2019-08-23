var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var categoriaSchema = new Schema({
    nombre: { type: String },
    slug: { type: String },
    descripcion: { type: String },
    usuario: { type: Schema.Types.ObjectId, ref: 'Usuario' }
});

module.exports = mongoose.model('Categoria', categoriaSchema);