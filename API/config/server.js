const express = require('express');
const app = express(); 
const cors = require('cors');
const porta = 3000;

let conexao = require('./bd.js')

app.use(express.static('public')); 

app.use(cors());
app.use(express.json()); // Permite processar JSON no corpo das requisições

/*Função: criando rotas para cadastrar*/
function criarRotaDeCadastro(app, rota, tabela, atributos) {
    app.post(rota, (req, res) => {
        // Extrai os dados do corpo da requisição
        const valores = atributos.map(atributo => req.body[atributo]);
        
        // Monta a query SQL dinamicamente
        const colunas = atributos.join(', ');
        const placeholders = atributos.map(() => '?').join(', ');
        const sql = `INSERT INTO ${tabela} (${colunas}) VALUES (${placeholders})`;

        // Executa a query
        conexao.query(sql, valores, (err, resultado) => {
            if (err) {
                console.error(`Erro ao adicionar na tabela ${tabela}:`, err);
                res.status(500).json({ erro: `Erro ao adicionar na tabela ${tabela}` });
            } else {
                console.log(`${tabela.slice(0, -1)} adicionado com sucesso`, resultado);
                res.status(201).json({ mensagem: `${tabela.slice(0, -1)} adicionado com sucesso!` });
            }
        });
    });
}

criarRotaDeCadastro(app, '/cadastrar-aluno', 'alunos', ['nome', 'sobrenome', 'nascimento', 'genero']);
criarRotaDeCadastro(app, '/cadastrar-professor', 'professores', ['nome', 'sobrenome', 'nascimento', 'genero','curso']);
criarRotaDeCadastro(app, '/cadastrar-curso', 'cursos', ['nome', 'data_inicio', 'data_termino', 'modalidade']);




/*função: mostrando cadastros*/
function criarrotasdelistagem(app, rota, entidade){
    app.get(rota, (req, res) => {
        const query = `SELECT * FROM ${entidade}`; // Nome da tabela no banco
        conexao.query(query, (err, results) => {
            if (err) {
                return res.status(500).send(err);
            }
            res.json(results);
        });
    })
};

criarrotasdelistagem(app,'/listagem-aluno', 'alunos')
criarrotasdelistagem(app,'/listagem-professor', 'professores')
criarrotasdelistagem(app,'/listagem-curso', 'cursos')






app.get('',(req, res)=>{
    res.write('porta rodando com sucesso!')
    res.end()
})

app.listen(porta, ()=>{
    console.log(`rota rodando na porta ${porta}`)
});

module.exports = app;