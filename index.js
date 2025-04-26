// backend/index.js
const express = require('express')
const app = express()
const cors = require('cors')
const http = require('http')
const bodyParser = require('body-parser')
const mysql = require('mysql2')
const multer = require('multer')

app.use(cors("*"))
app.use(express.json())
app.use(bodyParser.json())

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname))
  }
})

const upload = multer({storage: storage})


const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'animedb',
  port: 3306,
})

db.connect((err) => {
  if (err) {
    console.error('Erro na conexão:', err);
    return;
  }
  console.log('Conectado ao MySQL');
});


const bcrypt = require('bcryptjs');
const path = require('path')

app.post('/usuarios', async (req, res) => {
  const { name, email, senha } = req.body;

  if (!name || !email || !senha) {
    return res.status(400).json({ message: 'Dados inválidos' });
  }

  // Salva no banco de dados
  db.query(
    'INSERT INTO usuarios (name, email, senha) VALUES (?, ?, ?)',
    [name, email, senha],
    (err, result) => {
      if (err) {
        console.error('Erro ao inserir no banco:', err);
        return res.status(500).json({ message: 'Erro interno do servidor' });
      }
      res.status(201).json({ id: result.insertId, name, email });
    }
  );  
})


app.post('/login', (req, res) => {
  const { email, senha } = req.body;

  db.query('SELECT * FROM usuarios WHERE email = ?', [email], (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: 'Erro no servidor' });
    }

    if (results.length === 0) {
      return res.status(400).json({ message: 'Email não encontrado' });
    }

    const usuario = results[0];

    bcrypt.compare(senha, usuario.senha, (err, isMatch) => {
      if (isMatch) {
        res.json({ message: 'Login bem-sucedido', usuario });
      } else {
        res.status(400).json({ message: 'Senha incorreta' });
      }
    });
  });
});

app.get('/usuarios', (req, res) => {
  db.query('SELECT * FROM usuarios', (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: 'Erro ao buscar usuários' });
    }
    res.json(results);
  });
});

app.put('/todos/:id', (req, res) => {
  const { id } = req.params;
  const { title, descrition, image } = req.body;

  db.query(
    'UPDATE todos SET title = ?, descrition = ?, image = ? WHERE id = ?',
    [title, descrition, image, id],
    (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ message: 'Erro ao atualizar o anime' });
      }
      res.json({ id, title, descrition, image });
    }
  );
});

app.post('/todos', (req, res) => {
  const { title, descrition, image } = req.body;

  db.query(
    'INSERT INTO todos (title, descrition, image) VALUES (?, ?, ?)',
    [title, descrition, image],
    (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ message: 'Erro ao adicionar anime' });
      }

      res.status(201).json({
        id: result.insertId,
        title,
        descrition,
        image
      });
    }
  );
});

app.post('/upload', (req, res) => {
  const imagePath = `/uploads/${req.file.filename}`
  const query = 'INSERT INTO images (images_path) VALUES (?)'

  // Inserir caminho da imagem no banco de dados
  db.query(query, [imagePath], (err, results) => {
    if (err) {
      console.error('Erro ao inserir caminho da imagem:', err);
      return res.status(500).send('Erro ao salvar a imagem');
    }
    res.send('Imagem salva com sucesso!');
  });
});

app.get('/todos', (req, res) => {
  db.query('SELECT * FROM todos', (err, results) => {
    if (err) return res.status(500).json({ message: 'Erro ao buscar animes' });

    res.json(results);
  });
});

// 3) Fallback para SPA — só depois das APIs e arquivos estáticos
// app.get('/*', (req, res) => {
//   res.sendFile(path.join(__dirname, 'dist'))
// })

http.createServer(app).listen(4000, () => {
  console.log('🚀 Backend rodando em http://localhost:400000')
})