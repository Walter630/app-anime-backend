const express = require('express');
const multer = require('multer');
const path = require('path');
const db = require('../db');
const router = express.Router();

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'uploads/'); // corrigido: pasta 'uploads'
    },
    filename: function (req, file, cb) {
      cb(null, Date.now() + path.extname(file.originalname)); // corrige para salvar nome + extensão
    }
  });
  
  const upload = multer({ storage: storage });
  
  router.post('/upload', upload.single('file'), async (req, res) => {
    if (!req.file) {
      return res.status(400).send('Nenhum arquivo enviado.');
    }

    const imagePath = `/uploads/${req.file.filename}`;
    const query = 'INSERT INTO images (images_path) VALUES (?)';

    try {
      await db.query(query, [imagePath]);
      res.send('Imagem salva com sucesso!');
    } catch (err) {
      console.error('Erro ao salvar imagem:', err);
      res.status(500).send('Erro ao salvar a imagem');
    }
  });

  module.exports = router;