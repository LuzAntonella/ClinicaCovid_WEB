const express = require('express');
const router = express.Router();
const FormMedico = require('../models/FormMedico')
const User = require('../models/User');
const PerMedico = require('../models/PerMedico');
const Cita = require('../models/Cita');
const passport = require('passport');
const cloudinary = require('cloudinary');
const { isAuthenticated } = require('../helpers/auth');

router.get('/panelUsu', isAuthenticated,async (req, res) => {
  await Cita.find({cita: req.body._id})
    .then(documentos => {
      const contexto = {
          Curso: documentos.map(documento => {
          return {
              codigoCurso: documento.codigoCurso,
              nameCurso: documento.nameCurso,
              docenteCurso : documento.docenteCurso,
              costoCurso : documento.costoCurso,
              descripcionCurso: documento.descripcionCurso,
              id: documento._id,
              
          }
        })
      }
      res.render('panelUsuario/elegirCurso', {Curso: contexto.Curso}); 
    });
});

router.get('/misCursos', isAuthenticated,(req, res) => {
  res.render('panelUsuario/misCursos');
});
router.get('/misDatosFisicos', isAuthenticated,async (req, res) => {
  await FormMedico.find({user: req.user.id})
      .then(documentos => {
        const contexto = {
            formM: documentos.map(documento => {
            return {
                documentoI: documento.documentoI,
                genero : documento.genero,
                fechaNacimiento : documento.fechaNacimiento,
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
  res.render('panelUsuario/perfil');
});
router.get('/addDatosFis',isAuthenticated,(req, res) => {
  res.render('panelUsuario/addDatosF');
});

//aqui guardo los datos en la BD(esto es de formulario medico)
router.post('/addFicha', isAuthenticated,async (req,res) => {
  const {documentoI, genero, fechaNacimiento, civil, pais, tipoSangre, seguroM, enfermedadPrevia ,alergias}= req.body;
  const errors =[];
  if(!documentoI){
      errors.push({text:'Por favor inserte su documento de identidad'});
  }
  if(!genero){
      errors.push({text:'Por favor inserte su género'});
  }
  if(!fechaNacimiento){
      errors.push({text:'Por favor inserte su fecha de nacimiento'});
  }
  //falta validar los demas datos
  if(errors.length > 0){
      res.render('panelUsuario/addDatosF',{
          errors,
          documentoI,
          genero,
          fechaNacimiento,
          civil,
          pais,
          tipoSangre,
          seguroM,
          enfermedadPrevia,
          alergias
      });
  } else{
      const newFormMedico = new FormMedico({documentoI, genero, fechaNacimiento, civil, pais, tipoSangre, seguroM, enfermedadPrevia ,alergias});
      //enlazo para cada uno
      newFormMedico.user = req.user.id;
      await newFormMedico.save();
      req.flash('success_msg','Ficha médica agregada exitosamente');
      //luego de que se guarda lo direcciono a selección cita
      res.redirect('/misDatosFisicos');

  }
});
module.exports = router;