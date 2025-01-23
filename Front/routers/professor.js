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

  document.addEventListener('DOMContentLoaded', () => {
     
    fetch('http://localhost:3000/listagem-professor')
    .then(response => response.json())
    .then(data => {
        const tbody = document.getElementById('entidades-professores');
        data.forEach(entidade => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${entidade.id_professor}</td>
                <td>${entidade.nome}</td>
                <td>${entidade.sobrenome}</td>
                <td>${entidade.nascimento}</td>
                <td>${entidade.genero}</td>
                 <td>${entidade.curso}</td>
            `;
            tbody.appendChild(row);
        });
    })
    .catch(error => console.error('Erro ao carregar as entidades:', error));

    
});