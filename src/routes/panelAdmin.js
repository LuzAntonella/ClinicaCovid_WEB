const express = require('express');
const router = express.Router();
const User = require('../models/User');
const PerMedico = require('../models/PerMedico');
const Cita= require('../models/Cita');
const passport = require('passport');
const { isAuthenticated } = require('../helpers/auth');
const cloudinary = require('cloudinary');
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});
const fs = require('fs-extra');

router.get('/moduloU', isAuthenticated, async (req, res) => {
    User.count({}, function(err, count) {
    console.log( "Total: ", count);
    });
    await User.find({user: req.body._id})
    
      .then(documentos => {
        const contexto = {
            User: documentos.map(documento => {
            return {
                dni: documento.dni,
                name: documento.name,
                apellido: documento.apellido,
                telefono: documento.telefono,
                email: documento.email,
                image: documento.imageURL,
                id: documento._id,
            }
          })
        }
        res.render('panelAdmin/tableroAdmin', {User: contexto.User}); 
      });
});
router.get('/usuariosAdmin', isAuthenticated, async (req, res) => {
    await User.find({user: req.body._id})
    
      .then(documentos => {
        const contexto = {
            User: documentos.map(documento => {
            return {
                dni: documento.dni,
                name: documento.name,
                apellido: documento.apellido,
                telefono: documento.telefono,
                email: documento.email,
                image: documento.imageURL,
                role: documento.role,
                id: documento._id,
                
            }
          })
        }
        res.render('panelAdmin/usuariosAdmin', {User: contexto.User}); 
      });
});
//eliminar un usuario
router.delete('/usuario/delete/:id',isAuthenticated, async (req,res) => {
    await User.findByIdAndDelete(req.params.id);
    req.flash('success_msg','Usuario Deleted Successfully');
    res.redirect('/usuariosAdmin');
});

//mostrar Personal Médico
router.get('/personalMAdmin',isAuthenticated,async (req, res) => {
    await PerMedico.find({PerMedico: req.body._id})
    
      .then(documentos => {
        const contexto = {
            Personal: documentos.map(documento => {
            return {
                dni: documento.dni,
                name: documento.name,
                apellido: documento.apellido,
                telefono: documento.telefono,
                email: documento.email,
                profesion: documento.profesion,
                image: documento.imageURL,
                id: documento._id,
                
            }
          })
        }
        res.render('panelAdmin/personalAdmin', {Personal: contexto.Personal}); 
      });
});

//recibir datos de registro PERSONAL MEDICO
router.post('/personalMAdmin', async (req, res) =>{
    const {dni,name,apellido,genero,telefono,email,profesion,fechaNacimiento} = req.body;
    const errors = [];
    //console.log(req.file);
    const result = await cloudinary.v2.uploader.upload(req.file.path);
    //console.log(result);
    if(!name){
        errors.push({text: 'Por favor inserte su nombre'});
    }
    if(!apellido){
        errors.push({text: 'Por favor inserte su apellido'});
    }
    if(!telefono){
        errors.push({text: 'Por favor inserte su teléfono'});
    }
    if (errors.length > 0){
        res.render('panelAdmin/personalAdmin', {errors,dni,name,apellido,genero,telefono,email,profesion,fechaNacimiento});
    }else{
        const emailUser = await User.findOne({email: email});
        if(emailUser){
            req.flash('error_msg','The Email is already in use');
            res.redirect('/personalMAdmin');
        }

        const newPersonalM = new PerMedico({
            dni,
            name,
            apellido,
            genero,
            telefono,
            email,
            profesion,
            fechaNacimiento,
            imageURL : result.url,
            public_id : result.public_id
        });
        await newPersonalM.save();
        await fs.unlink(req.file.path);
        req.flash('success_msg','You are registered');
        res.redirect('/personalMAdmin');
    }
   
});

//eliminar un médico
router.delete('/personal/delete/:id',isAuthenticated, async (req,res) => {
    await PerMedico.findByIdAndDelete(req.params.id);
    req.flash('success_msg','Persona Deleted Successfully');
    res.redirect('/personalMAdmin');
});

/*mostrar lista de personal
router.get('/citasAdmin',isAuthenticated,async (req, res) => {
    await PerMedico.find({PerMedico: req.body.docenteCurso})
      .then(documentos => {
        const contexto = {
            Personal: documentos.map(documento => {
            return {
                name: documento.name,
                apellido : documento.apellido,
                image: documento.imageURL,
                id: documento._id,
            }
          })
        }
        res.render('panelAdmin/citasAdmin', {Personal: contexto.Personal}); 
      });
});*/

//mostrar Citas
router.get('/citasAdmin',isAuthenticated,async (req, res) => {
    await Cita.find({cita: req.body.codigoCita})
    .then(documentos => {
    const contexto = {
        Cita: documentos.map(documento => {
        return {
            codigoCita: documento.codigoCita,
            personalCita: documento.personalCita,
            costoCita: documento.costoCita,
            horaCita: documento.horaCita,
            fechaCita: documento.fechaCita,
            descripcionCita: documento.descripcionCita,
            id: documento._id,
        }
        })
    }
    res.render('panelAdmin/citasAdmin', {Cita: contexto.Cita}); 
    });
});

//recibir datos de registro CITAS
router.post('/citasAdmin', async (req, res) =>{
    const {codigoCita,personalCita,costoCita,horaCita,fechaCita,descripcionCita} = req.body;
    const errors = [];
    
    if(!codigoCita){
        errors.push({text: 'Por favor inserte el codigo de la cita'});
    }
    if(!personalCita){
        errors.push({text: 'Por favor inserte un médico'});
    }
    if(!horaCita){
        errors.push({text: 'Por favor inserte una hora de cita'});
    }
    if(!fechaCita){
        errors.push({text: 'Por favor inserte una fecha de cita'});
    }
    if (errors.length > 0){
        res.render('panelAdmin/citasAdmin', {errors,codigoCita,personalCita,costoCita,horaCita,fechaCita,descripcionCita});
    }else{
        const newCita = new Cita({
            codigoCita,
            personalCita,
            costoCita,
            horaCita,
            fechaCita,
            descripcionCita,
        });
        await newCita.save();
        req.flash('success_msg','You are registered');
        res.redirect('/citasAdmin');
    }
   
});

//eliminar una cita
router.delete('/cita/delete/:id',isAuthenticated, async (req,res) => {
    await Cita.findByIdAndDelete(req.params.id);
    req.flash('success_msg','Persona Deleted Successfully');
    res.redirect('/citasAdmin');
});

//mostrar perfil
router.get('/perfilU', isAuthenticated, async (req, res) => {
        res.render('panelAdmin/perfilA'); 
});
module.exports = router;