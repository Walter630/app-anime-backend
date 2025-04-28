const mysql = require('mysql2/promise');

    const db =  mysql.createPool({
      host: 'localhost',
      user: 'root',
      password: '',
      database: 'animedb',
      port: 3306,
    });
  
    console.log('Conectado ao MySQL');

module.exports = db