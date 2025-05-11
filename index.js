const express = require('express');
const http = require('http');
const cors = require('cors');
const bodyParser = require('body-parser');
const { Server } = require('socket.io');
const { join } = require('node:path');
const db = require('./db'); // importa sua conexão MySQL

async function main() {
  const app = express();
  const server = http.createServer(app);
  const io = new Server(server, {
    connectionStateRecovery: {},
    cors: { origin: "*" },
  });

  app.use(cors());
  app.use(express.json());
  app.use(bodyParser.json());

  app.get('/', (req, res) => {
    res.sendFile(join(__dirname, 'index.html'));
  });

  const usuariosRouter = require('./routes/usuarios');
  const todosRouter = require('./routes/todos');
  const uploadRouter = require('./routes/uploads');

  app.use('/usuarios', usuariosRouter);
  app.use('/todos', todosRouter);
  app.use('/uploads', uploadRouter);

  // WebSocket
  io.on('connection', (socket) => {
    socket.on("chat message", async (msg, clientOffset, callback) => {
      try {
        const [result] = await db.execute(
          'INSERT INTO messages (content, client_offset) VALUES (?, ?)',
          [msg, clientOffset]
        );
        io.emit('chat message', msg, result.insertId);
        callback({ success: true });
      } catch (err) {
        console.error('Erro ao salvar mensagem:', err);
        callback({ success: false });
      }
    });

    socket.on('disconnect', () => {
      console.log('❌ Usuário desconectado');
    });

    (async () => {
      if (!socket.recovered) {
        const offset = socket.handshake.auth.serverOffset || 0;
        const [rows] = await db.execute(
          'SELECT id, content FROM messages WHERE id > ?',
          [offset]
        );
        for (const row of rows) {
          socket.emit('chat message', row.content, row.id);
        }
      }
    })();
  });

  const port = process.env.PORT || 4000;
  server.listen(port, () => {
    console.log(`✅ Server running at http://localhost:${port}`);
  });
}

main();
