const mongoose = require('mongoose');
const { Schema } = mongoose;


const personalSchema = new Schema({
    dni:{ type:String, required:true},
    name: { type:String, required:true},
    apellido: { type:String, required:true},
    genero: { type:String, required:true},
    telefono: { type:String, required:true},
    email: { type:String, required:true},
    profesion: { type:String, required:true},
    fechaNacimiento: { type:String, required:true},
    imageURL: { type:String, required:true},
    public_id:{ type:String, required:true},
    date: { type:Date, default: Date.now }
    
});

module.exports = mongoose.model('Personal', personalSchema);