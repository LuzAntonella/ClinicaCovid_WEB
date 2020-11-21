const express = require('express');
const router = express.Router();
const FormMedico = require('../models/FormMedico')
const User = require('../models/User');
const PerMedico = require('../models/PerMedico');
const Cita = require('../models/Cita');
const RegistroCita = require('../models/RegistroCita');
const passport = require('passport');
const cloudinary = require('cloudinary');
const { isAuthenticated } = require('../helpers/auth');

router.get('/panelUsu', isAuthenticated,async (req, res) => {
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
    res.render('panelUsuario/elegirCita', {Cita: contexto.Cita}); 
    });
});


router.get('/misDatosFisicos', isAuthenticated,async (req, res) => {
  await FormMedico.find({user: req.user.id})
      .then(documentos => {
        const contexto = {
            formM: documentos.map(documento => {
            return {
                civil: documento.civil,
                pais: documento.pais,
                tipoSangre: documento.tipoSangre,
                seguroM :documento.seguroM,
                enfermedadPrevia :documento.enfermedadPrevia,
                alergias: documento.alergias,
                id: documento._id
            }
          })
        }
        res.render('panelUsuario/datosFisicos', {
        formM: contexto.formM }) 
      })
});

//-------------------------
router.get('/miPerfil', isAuthenticated,(req, res) => {
  res.render('panelUsuario/perfilG');
});
router.get('/addDatosFis',isAuthenticated,(req, res) => {
  res.render('panelUsuario/addDatosF');
});

//aqui guardo los datos en la BD(esto es de formulario medico)
router.post('/addFicha', isAuthenticated,async (req,res) => {
  const {civil, pais, tipoSangre, seguroM, enfermedadPrevia ,alergias}= req.body;
  const errors =[];
  if(!civil){
      errors.push({text:'Por favor inserte su estado civil'});
  }
  if(!tipoSangre){
      errors.push({text:'Por favor inserte su tipo de Sangre'});
  }
  if(!alergias){
      errors.push({text:'Por favor inserte el campo alergias'});
  }
  if(!seguroM){
    errors.push({text:'Por favor inserte el campo seguro'});
  }
  //falta validar los demas datos
  if(errors.length > 0){
      res.render('panelUsuario/addDatosF',{
          errors,
          civil,
          pais,
          tipoSangre,
          seguroM,
          enfermedadPrevia,
          alergias
      });
  } else{
      const newFormMedico = new FormMedico({civil, pais, tipoSangre, seguroM, enfermedadPrevia ,alergias});
      //enlazo para cada uno
      newFormMedico.user = req.user.id;
      await newFormMedico.save();
      req.flash('success_msg','Ficha médica agregada exitosamente');
      //luego de que se guarda lo direcciono a selección cita
      res.redirect('/misDatosFisicos');

  }
});

//-----Actualizar Ficha Medica
router.get('/fichaM/edit/:id',isAuthenticated, async (req, res) => {

  const datosF = await FormMedico.findById(req.params.id)
  .then(data =>{
      return {
          civil:data.civil,
          pais:data.pais,
          tipoSangre:data.tipoSangre,
          seguroM: data.seguroM,
          enfermedadPrevia : data.enfermedadPrevia,
          alergias : data.alergias,
          id:data.id
      }
  })
  res.render('panelUsuario/edit-datosF',{datosF})
 // OBSERVABLES-Eliminamos el elemento en algún momento del programa
  datosF.parentNode.removeChild(datosF);
});

router.put('/fichaM/edit-fichaM/:id', isAuthenticated,async (req, res) =>{
  const {civil,pais,tipoSangre,seguroM,enfermedadPrevia,alergias} = req.body;
  const errors =[];
  if(!civil){
    errors.push({text:'Por favor inserte su estado civil'});
  }
  if(!tipoSangre){
    errors.push({text:'Por favor inserte su tipo de Sangre'});
  }
  if(errors.length > 0){
    res.render('panelUsuario/edit-datosF',{
        errors,
        civil,
        pais,
        tipoSangre,
        seguroM,
        enfermedadPrevia,
        alergias
  });
  }else{
    //actualizar
   await FormMedico.findByIdAndUpdate(req.params.id,{civil,pais,tipoSangre,seguroM,enfermedadPrevia,alergias});
   req.flash('success_msg','Ficha Médica Updated Successfully');
   res.redirect(('/misDatosFisicos'));
  }
  
});

//ELEGIR CITAS
router.post('/addElegirCita/:id', isAuthenticated,async (req,res) => {
  console.log(req.params.id)
  const datosF = await Cita.findById(req.params.id);
  //console.log(datosF.nameCurso);
  const newRegistroCita = new RegistroCita({
      codigoCita: datosF.codigoCita,
      personalCita: datosF.personalCita,
      costoCita: datosF.costoCita,
      descripcionCita: datosF.descripcionCita,
      horaCita: datosF.horaCita,
      fechaCita: datosF.fechaCita,
  });
  newRegistroCita.user = req.user.id;
  await newRegistroCita.save();
  req.flash('success_msg','Se ha registrado en la cita', datosF.codigoCita);
  res.redirect(('/misCitas'));
});

router.get('/misCitas', isAuthenticated,async (req, res) => {
  await RegistroCita.find({user: req.user.id})
      .then(documentos => {
        const contexto = {
            formM: documentos.map(documento => {
            return {
              codigoCita: documento.codigoCita,
              personalCita: documento.personalCita,
              costoCita: documento.costoCita,
              descripcionCita: documento.descripcionCita,
              horaCita: documento.horaCita,
              fechaCita: documento.fechaCita,
              realizoPago: documento.realizoPago,
              id: documento._id
            }
          })
        }
        res.render('panelUsuario/misCitas', {
        registroCita: contexto.formM }) 
      })
});
module.exports = router;