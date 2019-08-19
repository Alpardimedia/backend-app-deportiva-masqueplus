var mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');

var Schema = mongoose.Schema;

var rolesValidos = {
    values: ['Administrador', 'Usuario'],
    message: '{VALUE} no es un rol permitido'
};

var usuarioSchema = new Schema({
    nombre: { type: String, required: [true, 'El nombre es necesario'] },
    codigo_postal: { type: Number, required: [true, 'El código postal es necesario'] },
    movil: { type: Number, required: [true, 'El móvil es necesario'] },
    fecha_nacimiento: { type: String, required: [true, 'La fecha de nacimiento es necesaria'] },
    genero: { type: String, required: [true, 'El genero es requerido'] },
    email: { type: String, unique: true, required: [true, 'El correo es necesario'] },
    password: { type: String, required: [true, 'La contraseña es obligatoria'] },
    img: { type: String, required: false },
    role: { type: String, required: true, default: 'Usuario', enum: rolesValidos },
    created_at: { type: Date, default: Date.now() }
});

usuarioSchema.plugin(uniqueValidator, 
    { message: '{PATH} debe de ser único' }
);

module.exports = mongoose.model('Usuario', usuarioSchema);