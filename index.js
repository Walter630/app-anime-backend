const express = require('express');
const http = require('http');
const cors = require('cors');
const bodyParser = require('body-parser');
const { Server } = require('socket.io');
const { join } = require('node:path');
const sqlite3 = require('better-sqlite3');
const { open } = require('sqlite');


async function main() {
  // Abre o arquivo do banco de dados
  const db = await open({
    filename: 'chat.db',
    driver: sqlite3.Database
  });

//   // Cria a tabela 'messages' caso não exista
//   await db.exec(`
//     CREATE TABLE IF NOT EXISTS messages (
//         id INTEGER PRIMARY KEY AUTOINCREMENT,
//         client_offset TEXT UNIQUE,
//         content TEXT
//     );
// `);
// await db.exec(`
//   CREATE TABLE IF NOT EXISTS episodios (
//     id INTEGER PRIMARY KEY AUTOINCREMENT,
//     anime_id INTEGER,
//     title TEXT,
//     description TEXT,
//     video TEXT,
//     episodio INTEGER,
//     FOREIGN KEY(anime_id) REFERENCES todos(id)
//   );
// `);


  const app = express();
  const server = http.createServer(app);
  const io = new Server(server, {
    connectionStateRecovery: {},
    cors: {
      origin: "*"
    },
    adapter: createAdapter()
  });

  // Middlewares
  app.use(cors());
  app.use(express.json());
  app.use(bodyParser.json());

  // Rota simples para testar (página HTML opcional)
  app.get('/', (req, res) => {
    res.sendFile(join(__dirname, 'index.html'));
  });

  // Rotas da API (usuários, todos, uploads)
  const usuariosRouter = require('./routes/usuarios');
  const todosRouter = require('./routes/todos');
  const uploadRouter = require('./routes/uploads');
  
  app.use('/usuarios', usuariosRouter);
  app.use('/todos', todosRouter);
  app.use('/uploads', uploadRouter);

  // WebSocket (Socket.io)
  io.on('connection', async (socket) => {
    // Escuta a mensagem 'chat message'
    socket.on("chat message", async (msg, clientOffset, callback) => {
      let result;
      try {
        // Insere a mensagem no banco de dados
        result = await db.run('INSERT INTO messages (content, client_Offset) VALUES (?, ?)', msg, clientOffset);
      } catch (e) {
        callback({ success: false });
        return;
      }
      io.emit('chat message', msg, result.lastID); // Emite a mensagem para todos os sockets conectados
      callback({ success: true });  // Envia a confirmação de sucesso
    });

    // Recupera as mensagens anteriores para o cliente
    if (!socket.recovered) {
      try {
        await db.each('SELECT id, content FROM messages WHERE id > ?',
          [socket.handshake.auth.serverOffset || 0],
          (_err, row) => {
            socket.emit('chat message', row.content, row.id); // Emite mensagens anteriores
          }
        );
      } catch (e) {
        // Tratar erro
      }
    }

    // Evento de desconexão
    socket.on('disconnect', () => {
      console.log('❌ Usuário desconectado');
    });
  });

  // Inicia o servidor
  const port = process.env.PORT || 4000; // Defina a porta corretamente
  server.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
  });
}

main();
