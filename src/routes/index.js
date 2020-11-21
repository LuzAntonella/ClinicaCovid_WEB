const express = require('express');
const router = express.Router();
const Personal = require('../models/PerMedico');
router.get('/',async (req, res) => {
    await Personal.find({Personal: req.body._id})
    .then(documentos => {
        const contexto = {
            Personal: documentos.map(documento => {
            return {
                name: documento.name,
                apellido: documento.apellido,
                profesion: documento.profesion,
                image: documento.imageURL,
                id: documento._id,
                
            }
          })
        }
        res.render('index', {Personal: contexto.Personal}); 
      });
});

router.get('/about',(req, res) => {
    res.render('about');
});

module.exports = router;