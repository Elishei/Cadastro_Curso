const mysql = require('mysql2')

const conexao = mysql.createConnection({
    host: 'localhost',   
    user: 'root',        
    password: 'adimin', 
    database: 'curso'  
});

/*Testando a conexão*/
conexao.connect((err) => {
    if (err) {
      console.error('Erro de conexão: ' + err.stack);
      return;
    }
    console.log('Conectado ao banco de dados MySQL');
  });

  module.exports = conexao;