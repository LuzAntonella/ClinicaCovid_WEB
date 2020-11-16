const mongoose = require('mongoose');
const { Schema } = mongoose;
const FormMedicoSchema = new Schema({
    documentoI: { type:String, required:true},
    genero: { type:String, required:true },
    fechaNacimiento : { type:Date, required:true },
    civil : { type:String, required:true },
    pais : { type:String, required:true },
    tipoSangre : { type:String, required:true },
    seguroM : { type:String, required: false },
    enfermedadPrevia : { type:String, required:true},
    alergias : { type:String, required:true},
    date : { type:Date, default: Date.now },
    user : { type: String}
});
//agrego el user para relacionarlo-y se modifica en la cita-Post
module.exports = mongoose.model('FormMedico', FormMedicoSchema);