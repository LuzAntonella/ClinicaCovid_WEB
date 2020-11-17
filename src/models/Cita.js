const mongoose = require('mongoose');
const { Schema } = mongoose;


const CitaSchema = new Schema({
    codigoCita:{ type:String, required:true},
    personalCita: { type:String, required:true},
    costoCita: { type:Number, required:true},
    descripcionCita: { type:String, required:true},
    horaCita: { type:String, required:true},
    fechaCita: { type:String, required:true},
    date: { type:Date, default: Date.now }
    
});

module.exports = mongoose.model('Cita', CitaSchema);
