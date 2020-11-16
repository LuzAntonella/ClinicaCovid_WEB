const mongoose = require('mongoose');
const { Schema } = mongoose;
const bcrypt = require('bcryptjs');

const UserSchema = new Schema({
    dni:{ type:String, required:true},
    name: { type:String, required:true},
    apellido: { type:String, required:true},
    genero: { type:String, required:true},
    telefono: { type:String, required:true},
    email: { type:String, required:true},
    password: { type:String, required:true},
    fechaNacimiento: { type:String, required:true},
    imageURL: { type:String, required:true},
    public_id:{ type:String, required:true},
    role: { type:String , 
        default:'regular',
        enum: [
            'regular',
            'admin'
        ]
    },
    date: { type:Date, default: Date.now },
    
});

//metodo cifrar
UserSchema.methods.encryptPassword = async (password) => {
    const salt = await bcrypt.genSalt(10);
    const hash = bcrypt.hash(password,salt);
    return hash;
};
  
UserSchema.methods.matchPassword = async function (password) {
      return await bcrypt.compare(password,this.password);
};
module.exports = mongoose.model('User', UserSchema);