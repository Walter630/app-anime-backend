const express = require('express');
const router = express.Router();
const db = require('../db');

  router.put('/:id', async (req, res) => {
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

  router.post('/', async (req, res) => {
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

  router.delete('/:id', async (req, res) => {
    const { id } = req.params;
  
    try {
      const [result] = await db.query('DELETE FROM todos WHERE id = ?', [id]);
  
      if (result.affectedRows === 0) {
        return res.status(404).json({ message: 'Anime não encontrado' });
      }
  
      res.status(200).json({ message: 'Anime deletado com sucesso' });
    } catch (err) {
      console.error('Erro ao deletar anime:', err);
      res.status(500).json({ message: 'Erro interno do servidor' });
    }
  });

  

  router.get('/', async (req, res) => {
    try {
      const [todos] = await db.query('SELECT * FROM todos');
      res.json(todos);
    } catch (err) {
      console.error('Erro ao buscar animes:', err);
      res.status(500).json({ message: 'Erro ao buscar animes' });
    }
  });

module.exports = router;








  