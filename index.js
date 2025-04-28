// backend/index.js
const express = require('express');
const app = express();
const cors = require('cors');
const http = require('http');
const bodyParser = require('body-parser');


app.use(cors("*"));
app.use(express.json());
app.use(bodyParser.json());

  // Rotas:
    // app.use('/Usuario', Usuario)
    const usuariosRouter = require('./routes/usuarios');
    const todosRouter = require('./routes/todos');
    const uploadRouter = require('./routes/uploads');
    
    // Usa as rotas
    app.use('/usuarios', usuariosRouter);
    app.use('/todos', todosRouter);
    app.use('/uploads', uploadRouter);

  http.createServer(app).listen(4000, () => {
    console.log('🚀 Backend rodando em http://localhost:4000');
  });
