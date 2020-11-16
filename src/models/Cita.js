const mongoose = require('mongoose');
const { Schema } = mongoose;


const CitaSchema = new Schema({
    codigoCurso:{ type:String, required:true},
    nameCurso: { type:String, required:true},
    docenteCurso: { type:String, required:true},
    costoCurso: { type:Number, required:true},
    descripcionCurso: { type:String, required:true},
    date: { type:Date, default: Date.now }
    
});

module.exports = mongoose.model('Cita', CitaSchema);
