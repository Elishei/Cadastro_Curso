/*Cadastro de Cursos*/
document.addEventListener('DOMContentLoaded', () => {
    const formcurso= document.querySelector('#formulariocurso');
  
    formcurso.addEventListener('submit', (e) => {
        e.preventDefault();
  
        const nomecurso = document.querySelector('#nomecurso').value;
        const datainit = document.querySelector('#datainit').value;
        const dataterm = document.querySelector('#dataterm').value;
        const mode = document.querySelector('#mode').value;
        
  
        fetch('http://127.0.0.1:3000/cadastrar-curso', {//Pede uma solicitação a uma rota
            method: 'POST', //diz o tipo 
            headers: { 
              // informações adicionais
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ // transforma em json
              nome: nomecurso,
              data_inicio: datainit ,
              data_termino: dataterm,
              modalidade: mode
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

/*Listagem dos Cursos*/
  document.addEventListener('DOMContentLoaded', () => {
     
    fetch('http://localhost:3000/listagem-curso')
    .then(response => response.json())
    .then(data => {
        const tbody = document.getElementById('entidades-cursos');
        if (data.length === 0) {
            // Adiciona a mensagem "Nenhum aluno cadastrado"
            const row = document.createElement('tr');
            row.innerHTML = `
                <td colspan="7" style="text-align: center;">Nenhuma matéria cadastrada cadastrado</td>
            `;
            tbody.appendChild(row);
        } else {
        data.forEach(entidade => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${entidade.id_curso}</td>
                <td>${entidade.nome}</td>
                <td>${entidade.data_inicio}</td>
                <td>${entidade.data_termino}</td>
                <td>${entidade.modalidade}</td>
                <td>
                <button class="btn-editar" onclick="editarCurso(${entidade.id_curso})">✏️</button>
                <button class="btn-apagar" onclick="apagarCurso(${entidade.id_curso})">🗑️</button>
                </td>
                
            `;
            tbody.appendChild(row);
        });
          }
    })
    .catch(error => console.error('Erro ao carregar as entidades:', error));

    
});

/*Função para apagar*/
function apagarCurso(id) {
    if (confirm("Deseja realmente apagar este curso?")) {
        fetch(`http://localhost:3000/apagar-curso/${id}`, { method: 'DELETE' })
            .then(response => response.json())
            .then(data => {
                alert(data.mensagem);
                location.reload(); // Recarrega a página para atualizar a lista
            })
            .catch(error => console.error('Erro ao apagar o curso:', error));
    }
}

/*função para editar */
function editarCurso(id) {
    fetch(`http://localhost:3000/curso-edit/${id}`)
        .then(response => response.json())
        .then(data => {
            const data_inicio = new Date(data.data_inicio);
            const datainicio = data_inicio.toISOString().split('T')[0]; // Ajusta para 'YYYY-MM-DD'
            const data_termino= new Date(data.data_termino);
            const datatermino = data_termino.toISOString().split('T')[0]; // Ajusta para 'YYYY-MM-DD'
            

            document.getElementById('editar-id').value = data.id_curso;
            document.getElementById('editar-nome').value = data.nome;
            document.getElementById('editar-datainicio').value = datainicio;
            document.getElementById('editar-datatermino').value = datatermino;
            document.getElementById('editar-modalidade').value = data.modalidade;

            document.getElementById('modal-editar').style.display = 'block';
        })
        .catch(error => console.error('Erro ao buscar curso:', error));
}

// Fechar o modal
function fecharModal() {
    document.getElementById('modal-editar').style.display = 'none';
}


// Enviar os dados editados ao servidor
document.getElementById('form-editarcurso').addEventListener('submit', (e) => {
    e.preventDefault();

    const id = document.getElementById('editar-id').value;
    const nome = document.getElementById('editar-nome').value;
    const data_inicio = document.getElementById('editar-datainicio').value;
    const data_termino = document.getElementById('editar-datatermino').value;
    const modalidade = document.getElementById('editar-modalidade').value;

    fetch(`http://localhost:3000/curso/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nome, data_inicio, data_termino, modalidade}),
    })
        .then(response => {
            if (response.ok) {
                alert('curso atualizado com sucesso!');
                fecharModal();
                location.reload(); // Recarrega a página para refletir as alterações
            } else {
                alert('Erro ao atualizar curso.');
            }
        })
        .catch(error => console.error('Erro ao atualizar curso:', error));
});
