const express = require('express');
const http = require('http');
const cors = require('cors');
const bodyParser = require('body-parser');
const { Server } = require('socket.io');
const { join } = require('node:path');
const sqlite3 = require('sqlite3');
const {open} = require('sqlite')

async function main() {
  // open the database file
  const db = await open({
    filename: 'chat.db',
    driver: sqlite3.Database
  });

  // create our 'messages' table (you can ignore the 'client_offset' column for now)
  await db.exec(`
    CREATE TABLE IF NOT EXISTS messages (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        client_offset TEXT UNIQUE,
        content TEXT
    );
  `);

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  connectionStateRecovery: {},
  cors: {
    origin: "*"
  }
});

// Middlewares
app.use(cors());
app.use(express.json());
app.use(bodyParser.json());

// Rota simples para teste (página HTML opcional)
app.get('/', (req, res) => {
  res.sendFile(join(__dirname, 'index.html'));
});

// Rotas da API
const usuariosRouter = require('./routes/usuarios');
const todosRouter = require('./routes/todos');
const uploadRouter = require('./routes/uploads');


app.use('/usuarios', usuariosRouter);
app.use('/todos', todosRouter);
app.use('/uploads', uploadRouter);


// WebSocket (Socket.io)
io.on('connection', async (socket) => {
  socket.on('chat message', async (msg) => {
    let result;
    try {
      result = await db.run('INSERT INTO messages (content) VALUES (?)', msg);
    } catch (e) {
      // TODO handle the failure
      return;
    }
    io.emit('chat message', msg, result.lastID);
  });

  if (!socket.recovered) {
    // if the connection state recovery was not successful
    try {
      await db.each('SELECT id, content FROM messages WHERE id > ?',
        [socket.handshake.auth.serverOffset || 0],
        (_err, row) => {
          socket.emit('chat message', row.content, row.id);
        }
      )
    } catch (e) {
      // something went wrong
    }
  }

    socket.on('disconnect', () => {
      console.log('❌ Usuário desconectado');
    });
  });



// Inicia o servidor
  server.listen(4000, () => {
    console.log('🚀 Backend rodando em http://localhost:4000');
  });
}
main()
