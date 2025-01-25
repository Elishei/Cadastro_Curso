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


/*função: apagando cadastro */
function criarRotaDeDelecao(app, rota, tabela, colunaId) {
    app.delete(rota, (req, res) => {
        const id = req.params.id;
        const sql = `DELETE FROM ${tabela} WHERE ${colunaId} = ?`;

        conexao.query(sql, [id], (err, resultado) => {
            if (err) {
                console.error(`Erro ao apagar na tabela ${tabela}:`, err);
                res.status(500).json({ mensagem: `Erro ao apagar na tabela ${tabela}.` });
            } else {
                res.status(200).json({ mensagem: `${tabela.slice(0, -1)} apagado com sucesso!` });
            }
        });
    });
}
criarRotaDeDelecao(app, '/apagar-aluno/:id', 'alunos', 'id_aluno');
criarRotaDeDelecao(app, '/apagar-professor/:id', 'professores', 'id_professor');
criarRotaDeDelecao(app, '/apagar-curso/:id', 'cursos', 'id_curso');


// Atualizar um aluno pelo ID
function CriarRotaAtualizar(app, rotaget, rotaput, tabela, id) {
    const id_busca = id;

    // Rota para buscar o item pelo ID
    app.get(rotaget, (req, res) => {
        const id = req.params.id;
        const query = `SELECT * FROM ${tabela} WHERE ${id_busca} = ?`;
        conexao.query(query, [id], (error, results) => {
            if (error) {
                res.status(500).send('Erro ao buscar a entidade.');
            } else {
                res.json(results[0]); // Envia apenas o registro correspondente
            }
        });
    });

    // Rota para atualizar o item pelo ID
    app.put(rotaput, (req, res) => {
        const id = req.params.id;
        const campos = req.body; // Captura os campos enviados no corpo da requisição
        const colunas = Object.keys(campos)
            .map(coluna => `${coluna} = ?`)
            .join(', ');
        const valores = [...Object.values(campos), id];
        const query = `UPDATE ${tabela} SET ${colunas} WHERE ${id_busca} = ?`;

        conexao.query(query, valores, (error, results) => {
            if (error) {
                console.error('Erro ao executar a query:', error);
                res.status(500).send('Erro ao atualizar a entidade.');
            } else {
                res.send('Entidade atualizada com sucesso!');
            }
        });
    });
}


CriarRotaAtualizar(app, '/aluno-edit/:id','/aluno/:id', 'alunos', 'id_aluno')
CriarRotaAtualizar(app, '/professor-edit/:id','/professor/:id', 'professores', 'id_professor')
CriarRotaAtualizar(app, '/curso-edit/:id','/curso/:id', 'cursos', 'id_curso')

app.get('',(req, res)=>{
    res.write('porta rodando com sucesso!')
    res.end()
})

app.listen(porta, ()=>{
    console.log(`rota rodando na porta ${porta}`)
});

module.exports = app;