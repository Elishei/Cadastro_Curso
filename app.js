//Importando módulos 
import express from 'express'; //Espress
import { createConnection } from 'mysql2';

//app 
const app = express()

//Configurando Conexão 
const conexao = createConnection({
   host: 'localhost',
   user: 'root',
   password: 'adimin',
   database: 'curso'
});
//Teste
conexao.connect(function(erro){
   if(erro) throw erro; 
   console.log('conexão efetuada') 
})


//Rota 
app.get('/', function( req, res){
res.write('Hello World Utilizando o nomdemon');
res.end();
});

//Servidor
app.listen(3000);