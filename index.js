// backend/index.js
const express = require('express');
const app = express();
const cors = require('cors');
const http = require('http');
const bodyParser = require('body-parser');
const mysql = require('mysql2/promise');
const multer = require('multer');
const path = require('path');
const bcrypt = require('bcryptjs');

app.use(cors("*"));
app.use(express.json());
app.use(bodyParser.json());

// Configuração do multer para uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // corrigido: pasta 'uploads'
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname)); // corrige para salvar nome + extensão
  }
});

const upload = multer({ storage: storage });

async function main() {
  const db = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'animedb',
    port: 3306,
  });

  console.log('Conectado ao MySQL');

  // Rotas:

  app.post('/usuarios', async (req, res) => {
    const { name, email, senha } = req.body;
  
    if (!name || !email || !senha) {
      return res.status(400).json({ message: 'Dados inválidos' });
    }
  
    try {
      // Verifica se o email já existe no banco
      const [usuarioExistente] = await db.query('SELECT * FROM usuarios WHERE email = ?', [email]);
  
      if (usuarioExistente.length > 0) {
        return res.status(409).json({ message: 'Email já cadastrado' });
      }
  
      // Insere o novo usuário no banco
      const [result] = await db.query(
        'INSERT INTO usuarios (name, email, senha) VALUES (?, ?, ?)',
        [name, email, senha]
      );
  
      res.status(201).json({ id: result.insertId, name, email });
    } catch (err) {
      console.error('Erro no cadastro:', err);
      res.status(500).json({ message: 'Erro interno do servidor' });
    }
  });
  

  app.post('/login', async (req, res) => {
    const { email, senha } = req.body;

    try {
      const [usuarios] = await db.query('SELECT * FROM usuarios WHERE email = ?', [email]);

      if (usuarios.length === 0) {
        return res.status(400).json({ message: 'Email não encontrado' });
      }

      const usuario = usuarios[0];

      bcrypt.compare(senha, usuario.senha, (err, isMatch) => {
        if (err) {
          console.error(err);
          return res.status(500).json({ message: 'Erro ao verificar senha' });
        }

        if (isMatch) {
          res.json({ message: 'Login bem-sucedido', usuario });
        } else {
          res.status(400).json({ message: 'Senha incorreta' });
        }
      });
    } catch (err) {
      console.error('Erro no login:', err);
      res.status(500).json({ message: 'Erro interno do servidor' });
    }
  });

  app.get('/usuarios', async (req, res) => {
    try {
      const [usuarios] = await db.query('SELECT * FROM usuarios');
      res.json(usuarios);
    } catch (err) {
      console.error('Erro ao buscar usuários:', err);
      res.status(500).json({ message: 'Erro ao buscar usuários' });
    }
  });

  app.put('/todos/:id', async (req, res) => {
    const { id } = req.params;
    const { title, descrition, image } = req.body;

    try {
      const [result] = await db.query(
        'UPDATE todos SET title = ?, descrition = ?, image = ? WHERE id = ?',
        [title, descrition, image, id]
      );

      res.json({ id, title, descrition, image });
    } catch (err) {
      console.error('Erro ao atualizar anime:', err);
      res.status(500).json({ message: 'Erro ao atualizar o anime' });
    }
  });

  app.post('/todos', async (req, res) => {
    const { title, descrition, image } = req.body;

    try {
      const [result] = await db.query(
        'INSERT INTO todos (title, descrition, image) VALUES (?, ?, ?)',
        [title, descrition, image]
      );

      res.status(201).json({
        id: result.insertId,
        title,
        descrition,
        image
      });
    } catch (err) {
      console.error('Erro ao adicionar anime:', err);
      res.status(500).json({ message: 'Erro ao adicionar anime' });
    }
  });

  app.post('/upload', upload.single('file'), async (req, res) => {
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

  app.get('/todos', async (req, res) => {
    try {
      const [todos] = await db.query('SELECT * FROM todos');
      res.json(todos);
    } catch (err) {
      console.error('Erro ao buscar animes:', err);
      res.status(500).json({ message: 'Erro ao buscar animes' });
    }
  });

  http.createServer(app).listen(4000, () => {
    console.log('🚀 Backend rodando em http://localhost:4000');
  });
}

main().catch(err => {
  console.error('Erro ao iniciar o backend:', err);
});
