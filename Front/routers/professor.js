/*Função para criar*/
document.addEventListener('DOMContentLoaded', () => {
    const formprof= document.querySelector('#formularioprof');
  
    formprof.addEventListener('submit', (e) => {
        e.preventDefault();
  
        const nomeprof = document.querySelector('#nomeprof').value;
        const sobrenomeprof = document.querySelector('#sobrenomeprof').value;
        const nascimentoprof = document.querySelector('#nascimentoprof').value;
        const generoprof = document.querySelector('#generoprof').value;
        const cursoprof = document.querySelector('#cursoprof').value;
        
  
        fetch('http://127.0.0.1:3000/cadastrar-professor', {//Pede uma solicitação a uma rota
            method: 'POST', //diz o tipo 
            headers: { 
              // informações adicionais
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ // transforma em json
              nome: nomeprof,
              sobrenome: sobrenomeprof ,
              nascimento: nascimentoprof,
              genero: generoprof,
              curso: cursoprof
          })
        })
        .then((response) => response.json())//.then: Executa ações quando o servidor responde.
        .then((data) => {
            console.log(data);
            alert(data.mensagem); // Exibe uma mensagem de sucesso
        })
        .catch((error) => {
            console.error('Erro:', error);
            alert('Erro ao cadastrar aluno.');
        });
    });
  });

  /*Função Listar*/
document.addEventListener('DOMContentLoaded', () => {
    fetch('http://localhost:3000/listagem-professor')
    .then(response => response.json())
    .then(data => {
        const tbody = document.getElementById('entidades-professores');
        if (data.length === 0) {
            // Adiciona a mensagem "Nenhum aluno cadastrado"
            const row = document.createElement('tr');
            row.innerHTML = `
                <td colspan="7" style="text-align: center;">Nenhum Professor cadastrado</td>
            `;
            tbody.appendChild(row);
        } else {
        data.forEach(entidade => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${entidade.id_professor}</td>
                <td>${entidade.nome}</td>
                <td>${entidade.sobrenome}</td>
                <td>${entidade.nascimento}</td>
                <td>${entidade.genero}</td>
                <td>${entidade.curso}</td>
                <td>
                <button class="btn-editar" onclick="editarProfessor(${entidade.id_professor})">✏️</button>
                <button class="btn-apagar" onclick="apagarProfessor(${entidade.id_professor})">🗑️</button>
                </td>
            `;
            tbody.appendChild(row);
        });

          }
    })
    .catch(error => console.error('Erro ao carregar as entidades:', error));

    
});

 /*Função para apagar*/
 function apagarProfessor(id) {
    if (confirm("Deseja realmente apagar este professor?")) {
        fetch(`http://localhost:3000/apagar-professor/${id}`, { method: 'DELETE' })
            .then(response => response.json())
            .then(data => {
                alert(data.mensagem);
                location.reload(); // Recarrega a página para atualizar a lista
            })
            .catch(error => console.error('Erro ao apagar o professor:', error));
    }
}

/*função para editar */
function editarProfessor(id) {
    fetch(`http://localhost:3000/professor-edit/${id}`)
        .then(response => response.json())
        .then(data => {
            const nascimento = new Date(data.nascimento);
            const nascimentoFormatado = nascimento.toISOString().split('T')[0]; // Ajusta para 'YYYY-MM-DD'

            document.getElementById('editar-id').value = data.id_professor;
            document.getElementById('editar-nome').value = data.nome;
            document.getElementById('editar-sobrenome').value = data.sobrenome;
            document.getElementById('editar-nascimento').value = nascimentoFormatado;
            document.getElementById('editar-genero').value = data.genero;
            document.getElementById('editar-curso').value = data.curso;

            document.getElementById('modal-editar').style.display = 'block';
        })
        .catch(error => console.error('Erro ao buscar professor:', error));
}

// Fechar o modal
function fecharModal() {
    document.getElementById('modal-editar').style.display = 'none';
}


// Enviar os dados editados ao servidor
document.getElementById('form-editarprof').addEventListener('submit', (e) => {
    e.preventDefault();

    const id = document.getElementById('editar-id').value;
    const nome = document.getElementById('editar-nome').value;
    const sobrenome = document.getElementById('editar-sobrenome').value;
    const nascimento = document.getElementById('editar-nascimento').value;
    const genero = document.getElementById('editar-genero').value;
    const curso = document.getElementById('editar-curso').value;

    fetch(`http://localhost:3000/professor/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nome, sobrenome, nascimento, genero, curso}),
    })
        .then(response => {
            if (response.ok) {
                alert('Professor atualizado com sucesso!');
                fecharModal();
                location.reload(); // Recarrega a página para refletir as alterações
            } else {
                alert('Erro ao atualizar Professor.');
            }
        })
        .catch(error => console.error('Erro ao atualizar aluno:', error));
});

