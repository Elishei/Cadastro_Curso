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
          data.forEach(entidade => {
              const row = document.createElement('tr');
              row.innerHTML = `
                  <td>${entidade.id_aluno}</td>
                  <td>${entidade.nome}</td>
                  <td>${entidade.sobrenome}</td>
                  <td>${entidade.nascimento}</td>
                  <td>${entidade.genero}</td>
              `;
              tbody.appendChild(row);
          });
      })
      .catch(error => console.error('Erro ao carregar as entidades:', error));

      
  });
