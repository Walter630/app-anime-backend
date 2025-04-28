const express = require('express');
const bcrypt = require('bcryptjs');
const router = express.Router();
const db = require('../db');

router.post('/', async (req, res) => {
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
       // 🔥 AQUI: Criptografa a senha antes de salvar
      const senhaHash = await bcrypt.hash(senha, 8);

      // Insere o novo usuário no banco
      const [result] = await db.query(
        'INSERT INTO usuarios (name, email, senha) VALUES (?, ?, ?)',
        [name, email, senhaHash] // 🔥 Usando senhaHash aqui
      );
  
      // Insere o novo usuário no banco
      res.status(201).json({ id: result.insertId, name, email });
    } catch (err) {
      console.error('Erro no cadastro:', err);
      res.status(500).json({ message: 'Erro interno do servidor' });
    }
});

router.post('/login', async (req, res) => {
  const { email, senha } = req.body;

  try {
    const [usuarios] = await db.query('SELECT * FROM usuarios WHERE email = ?', [email]);

    if (usuarios.length === 0) {
      return res.status(400).json({ message: 'Email não encontrado' });
    }

    const usuario = usuarios[0];

    // Usando async/await com bcrypt.compare
    const isMatch = await bcrypt.compare(senha, usuario.senha);

    if (isMatch) {
      res.json({ message: 'Login bem-sucedido', usuario });
    } else {
      res.status(400).json({ message: 'Senha incorreta' });
    }
  } catch (err) {
    console.error('Erro no login:', err);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
});


router.get('/', async (req, res) => {
  try {
    const [usuarios] = await db.query('SELECT * FROM usuarios');
    res.json(usuarios);
  } catch (err) {
    console.error('Erro ao buscar usuários:', err);
    res.status(500).json({ message: 'Erro ao buscar usuários' });
  }
});
  

module.exports = router;