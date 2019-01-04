var mongoose = require('mongoose');

var uniqueValidator =  require('mongoose-unique-validator');

var Schema = mongoose.Schema;

var rolesValidos ={
    values:['ADMIN_ROLE' , 'USER_ROLE'],
    message: '{VALUE} não é um ROLE permetido'
}

var usuarioSchema = new Schema({
    // {type: String, required: [false, 'O nome é necessário.'] },
    nome: {type: String, required: [false, 'O nome é necessário.'] },
    email: {type: String, unique: true, required: [true, 'O email é necessário.'] },
    password: {type: String, required: [true, 'A senha é necessária.'] },
    img: {type: String, required: false },
    role: {type: String, required: true, default: 'USER_ROLE' , enum: rolesValidos },
    google: {type: Boolean, default: false },

});

    usuarioSchema.plugin( uniqueValidator, {message: '{PATH} já cadasatrado'});

    module.exports = mongoose.model('Usuario' , usuarioSchema );