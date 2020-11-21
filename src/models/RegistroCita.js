const mongoose = require('mongoose');
const { Schema } = mongoose;

const RegistroCitaSchema = new Schema({
    codigoCita:{ type:String, required:true},
    personalCita: { type:String, required:true},
    costoCita: { type:Number, required:true},
    descripcionCita: { type:String, required:true},
    horaCita: { type:String, required:true},
    fechaCita: { type:String, required:true},
    realizoPago: { type:String , 
        default:'deuda',
        enum: [
            'deuda',
            'cancelado'
        ]
    },
    date : { type:Date, default: Date.now },
    user : { type: String}
});
//agrego el user para relacionarlo-y se modifica en la cita-Post
module.exports = mongoose.model('RegistroCita', RegistroCitaSchema);