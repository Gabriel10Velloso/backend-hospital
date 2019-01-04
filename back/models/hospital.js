var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var hospitalSchema = new Schema({
    nome: { type: String, required: [true, 'O nome é necessário.'] },
    img: { type: String, required: false },
    usuario: { type: Schema.Types.ObjectId, ref: 'Usuario' }
}, { collection: 'hospital' });



module.exports = mongoose.model('Hospital', hospitalSchema);