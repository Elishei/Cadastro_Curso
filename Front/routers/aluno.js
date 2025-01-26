/*Escuta para cadastrar */
document.addEventListener('DOMContentLoaded', () => {
  const form = document.querySelector('#cadastraraluno');

  form.addEventListener('submit', (e) => {
      e.preventDefault();

      const nome = document.querySelector('#nome').value;
      const sobrenome = document.querySelector('#sobrenome').value;
      const nascimento = document.querySelector('#nascimento').value;
      const genero = document.querySelector('#genero').value;
      

      fetch('http://127.0.0.1:3000/cadastrar-aluno', {//Pede uma solicitação a uma rota
          method: 'POST', //diz o tipo 
          headers: { 
            // informações adicionais
              'Content-Type': 'application/json',
          },
          body: JSON.stringify({ // transforma em json
            nome: nome,
            sobrenome: sobrenome ,
            nascimento: nascimento,
            genero: genero
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

/*Função para listar */
document.addEventListener('DOMContentLoaded', (e) => {
      
      fetch('http://localhost:3000/listagem-aluno')
      .then(response => response.json())
      .then(data => {
          const tbody = document.getElementById('entidades-aluno');
          if (data.length === 0) {
            // Adiciona a mensagem "Nenhum aluno cadastrado"
            const row = document.createElement('tr');
            row.innerHTML = `
                <td colspan="7" style="text-align: center;">Nenhum aluno cadastrado</td>
            `;
            tbody.appendChild(row);
        } else {
          data.forEach(entidade => {
            // Converte a data de nascimento para o formato YYYY-MM-DD
            const nascimento = new Date(entidade.nascimento);
            const ano = nascimento.getFullYear();
            const mes = String(nascimento.getMonth() + 1).padStart(2, '0'); // Adiciona zero à esquerda
            const dia = String(nascimento.getDate()).padStart(2, '0'); // Adiciona zero à esquerda
            const nascimentoFormatado = `${dia}-${mes}-${ano}`;
              const row = document.createElement('tr');
              row.innerHTML = `
                  <td>${entidade.id_aluno}</td>
                  <td>${entidade.nome}</td>
                  <td>${entidade.sobrenome}</td>
                  <td>${nascimentoFormatado}</td>
                  <td>${entidade.genero}</td>
                  <td>
                <button class="btn-editar" onclick="editarAluno(${entidade.id_aluno})">✏️</button>
                <button class="btn-apagar" onclick="apagarAluno(${entidade.id_aluno})">🗑️</button>
                </td>
              `;
              tbody.appendChild(row);
          });
          
           }
      })
      .catch(error => console.error('Erro ao carregar as entidades:', error));  
  });


/*Função para apagar*/
  function apagarAluno(id) {
    if (confirm("Deseja realmente apagar este aluno?")) {
        fetch(`http://localhost:3000/apagar-aluno/${id}`, { method: 'DELETE' })
            .then(response => response.json())
            .then(data => {
                alert(data.mensagem);
                location.reload(); // Recarrega a página para atualizar a lista
            })
            .catch(error => console.error('Erro ao apagar o aluno:', error));
    }
}

/*função para editar */
function editarAluno(id) {
    fetch(`http://localhost:3000/aluno-edit/${id}`)
        .then(response => response.json())
        .then(data => {
            const nascimento = new Date(data.nascimento);
            const nascimentoFormatado = nascimento.toISOString().split('T')[0]; // Ajusta para 'YYYY-MM-DD'

            document.getElementById('editar-id').value = data.id_aluno;
            document.getElementById('editar-nome').value = data.nome;
            document.getElementById('editar-sobrenome').value = data.sobrenome;
            document.getElementById('editar-nascimento').value = nascimentoFormatado;
            document.getElementById('editar-genero').value = data.genero;

            document.getElementById('modal-editar').style.display = 'block';
        })
        .catch(error => console.error('Erro ao buscar aluno:', error));
}

// Fechar o modal
function fecharModal() {
    document.getElementById('modal-editar').style.display = 'none';
}


// Enviar os dados editados ao servidor
document.getElementById('form-editar').addEventListener('submit', (e) => {
    e.preventDefault();

    const id = document.getElementById('editar-id').value;
    const nome = document.getElementById('editar-nome').value;
    const sobrenome = document.getElementById('editar-sobrenome').value;
    const nascimento = document.getElementById('editar-nascimento').value;
    const genero = document.getElementById('editar-genero').value;

    fetch(`http://localhost:3000/aluno/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nome, sobrenome, nascimento, genero }),
    })
        .then(response => {
            if (response.ok) {
                alert('Aluno atualizado com sucesso!');
                fecharModal();
                location.reload(); // Recarrega a página para refletir as alterações
            } else {
                alert('Erro ao atualizar aluno.');
            }
        })
        .catch(error => console.error('Erro ao atualizar aluno:', error));
});
document.addEventListener('DOMContentLoaded', () => {
    const searchBar = document.getElementById('search-bar');
    const tbody = document.getElementById('entidades-aluno');
  
    searchBar.addEventListener('keyup', () => {
      const query = searchBar.value.toLowerCase();
      const rows = tbody.querySelectorAll('tr');
  
      rows.forEach(row => {
        const cells = row.querySelectorAll('td');
        const textContent = Array.from(cells)
          .map(cell => cell.textContent.toLowerCase())
          .join(' ');
        
        if (textContent.includes(query)) {
          row.style.display = '';
        } else {
          row.style.display = 'none';
        }
      });
    });
  });
  

