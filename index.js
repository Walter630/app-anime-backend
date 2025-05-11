const express = require('express');
const http = require('http');
const cors = require('cors');
const bodyParser = require('body-parser');
const { Server } = require('socket.io');
const { join } = require('node:path');
const { createAdapter } = require('@socket.io/cluster-adapter');


function main() {
  

  const app = express();
  const server = http.createServer(app);
  const io = new Server(server, {
    connectionStateRecovery: {},
    cors: { origin: "*" },
    adapter: createAdapter()
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

  io.on('connection', (socket) => {
    socket.on("chat message", (msg, clientOffset, callback) => {
      try {
        const result = db.prepare('INSERT INTO messages (content, client_offset) VALUES (?, ?)').run(msg, clientOffset);
        io.emit('chat message', msg, result.lastInsertRowid);
        callback({ success: true });
      } catch {
        callback({ success: false });
      }
    });

    if (!socket.recovered) {
      const offset = socket.handshake.auth.serverOffset || 0;
      const rows = db.prepare('SELECT id, content FROM messages WHERE id > ?').all(offset);
      for (const row of rows) {
        socket.emit('chat message', row.content, row.id);
      }
    }

    socket.on('disconnect', () => {
      console.log('❌ Usuário desconectado');
    });
  });

  const port = process.env.PORT || 4000;
  server.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
  });
}

main();
