const express = require('express');
const router = express.Router();
const User = require('../models/User');
const passport = require('passport');
const cloudinary = require('cloudinary');
const { isAuthenticated } = require('../helpers/auth');
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});
const fs = require('fs-extra');
//login
router.get('/users/signin',(req, res) => {
    res.render('users/signin');
});

router.post('/users/signin', passport.authenticate('local', {  
    successRedirect: '/panel',
    failureRedirect: '/users/signin',
    failureFlash: true
}));


router.get('/users/signup',(req, res) => {
    res.render('users/signup');
});

//recibir datos de registro
router.post('/users/signup', async (req, res) =>{
    const {dni,name,apellido,genero,telefono,email,fechaNacimiento, password, confirm_password} = req.body;
    const errors = [];
    console.log(req.file);
    const result = await cloudinary.v2.uploader.upload(req.file.path);
    console.log(result);
    if(name.length <=0 ){
        errors.push({text: 'Por favor inserte su nombre'});
    }
    if(!apellido){
        errors.push({text: 'Por favor inserte su apellido'});
    }
    if(!telefono){
        errors.push({text: 'Por favor inserte su teléfono'});
    }
    if(password != confirm_password){
        errors.push({text: 'Contraseñas diferentes'});
    }
    if (password.length < 4){
        errors.push({text: 'Contraseña debe ser mayor a 4 dígitos'});
    }
    if (errors.length > 0){
        res.render('users/signup', {errors,dni,name,apellido,genero,telefono,email,fechaNacimiento, password, confirm_password});
    }else{
        const emailUser = await User.findOne({email: email});
        if(emailUser){
            req.flash('error_msg','The Email is already in use');
            res.redirect('/users/signup');
        }

        const newUser = new User({
            dni,
            name,
            apellido,
            genero,
            telefono,
            email,
            fechaNacimiento,
            password,
            confirm_password,
            imageURL : result.url,
            public_id : result.public_id
        });
        newUser.password = await newUser.encryptPassword(password);
        await newUser.save();
        await fs.unlink(req.file.path);
        req.flash('success_msg','You are registered');
        res.redirect('/users/signin');
    }
   
});

//REDIRIGIR SEGÚN EL ROL
router.get('/panel', isAuthenticated,async (req, res) => {
    console.log(req.user.role);

    if (req.user.role === 'admin') {
        res.redirect('/moduloU');
      } else {
        res.redirect('/panelUsu');
    }
});

/*router.get('/panelUsu', isAuthenticated,async (req, res) => {
    console.log(req.name);
    await User.find({user: req.body._id})
    
      .then(documentos => {
        const contexto = {
            User: documentos.map(documento => {
            return {
                name: documento.name,
                image: documento.imageURL,
                id: documento._id,
                
            }
          })
        }
        res.render('panelUsuario/elegirCurso', {User: contexto.User}); 
      });
  });*/

//cerrar sesion
router.get('/users/logout' , (req, res) => {
    req.logout();
    res.redirect('/');
});
module.exports = router;