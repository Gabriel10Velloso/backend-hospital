var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var medicoSchema = new Schema({
    nome: { type: String, required: [true, 'O nome é necessário.'] },
    img: { type: String, required: false },
    usuario: { type: Schema.Types.ObjectId, ref: 'Usuario', required: true },
    hospital: {
        type: Schema.Types.ObjectId,
        ref: 'Hospital',
        required: [true, 'O id do Hospital é um compo necessário ']
    }
});


module.exports = mongoose.model('Medico', medicoSchema);