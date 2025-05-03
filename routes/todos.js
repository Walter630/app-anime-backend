const express = require('express');
const router = express.Router();
const db = require('../db');

  router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { title, descrition, image, categoria } = req.body;

    try {
      const [result] = await db.query(
        'UPDATE todos SET title = ?, descrition = ?, image = ?, categoria=? WHERE id = ?',
        [title, descrition, image, categoria, id]
      );

      res.json({ id, title, descrition, image, categoria });
    } catch (err) {
      console.error('Erro ao atualizar anime:', err);
      res.status(500).json({ message: 'Erro ao atualizar o anime' });
    }
  });

  router.post('/', async (req, res) => {
    const { title, descrition, image, categoria, usuario_id } = req.body;

    try {
      const [result] = await db.query(
        'INSERT INTO todos (title, descrition, image, categoria, usuario_id) VALUES (?, ?, ?, ?, ?)',
        [title, descrition, image, categoria, usuario_id]
      );

      res.status(201).json({
        id: result.insertId,
        title,
        descrition,
        image,
        categoria,
        usuario_id

      });
    } catch (err) {
      console.error('Erro ao adicionar anime:', err);
      res.status(500).json({ message: 'Erro ao adicionar anime' });
    }
  });

  router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    try {
      const [result] = await db.query('DELETE FROM todos WHERE id = ?', [id]);
  
      if (result.affectedRows === 0) {
        return res.status(404).json({ message: 'Anime não encontrado' });
      }
  
      res.status(200).json({ message: 'Anime deletado com sucesso' });
    } catch (err) {
      res.status(500).json({ message: 'Erro interno do servidor' });
    }
  });

  router.get('/', async (req, res) => {
    const { usuario_id } = req.query;

    try {
      let query = 'SELECT * FROM todos';
      const params = [];

      if (usuario_id) {
        query += ' WHERE usuario_id = ?';
        params.push(usuario_id);
      }
  
      const [todos] = await db.query(query, params);
      res.json(todos);
    } catch (err) {
      console.error('Erro ao buscar animes:', err);
      res.status(500).json({ message: 'Erro ao buscar animes' });
    }
  });  

  router.get('/', async (req, res) => {
    try {
      const [todos] = await db.query('SELECT * FROM todos');
      res.json(todos); // Retorna todos os animes
    } catch (err) {
      console.error('Erro ao buscar animes:', err);
      res.status(500).json({ message: 'Erro ao buscar animes' });
    }
  });

  router.put('/assistido/:id', async (req, res) => {
    const { id } = req.params;
  
    try {
      const [result] = await db.query(
        'UPDATE todos SET assistido = NOT assistido WHERE id = ?',
        [id]
      );
  
      if (result.affectedRows === 0) {
        return res.status(404).json({ message: 'Anime não encontrado' });
      }
  
      const [updatedAnime] = await db.query('SELECT * FROM todos WHERE id = ?', [id]);
      res.json(updatedAnime[0]);  // Retorna o anime atualizado
    } catch (err) {
      console.error('Erro ao atualizar status do anime:', err);
      res.status(500).json({ message: 'Erro ao atualizar o anime' });
    }
  });
  

module.exports = router;








  