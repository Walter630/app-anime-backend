const express = require('express');
const http = require('http');
const cors = require('cors');
const bodyParser = require('body-parser');
const { join } = require('node:path');


async function main() {
  const app = express();
  const server = http.createServer(app);


  app.use(cors());
  app.use(express.json());
  app.use(bodyParser.json());

  app.get('/', (req, res) => {
  res.send('🚀 API do Yokuso está online!');
});

  const usuariosRouter = require('./routes/usuarios');
  const todosRouter = require('./routes/todos');
  const uploadRouter = require('./routes/uploads');

  app.use('/usuarios', usuariosRouter);
  app.use('/todos', todosRouter);
  app.use('/uploads', uploadRouter);

 
  const PORT = process.env.PORT || 4000;
  server.listen(PORT, () => {
    console.log(`✅ Server running at http://localhost:${PORT}`);
  });
}

main();
