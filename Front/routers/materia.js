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

  document.addEventListener('DOMContentLoaded', () => {
     
    fetch('http://localhost:3000/listagem-curso')
    .then(response => response.json())
    .then(data => {
        const tbody = document.getElementById('entidades-curos');
        data.forEach(entidade => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${entidade.id_curso}</td>
                <td>${entidade.nome}</td>
                <td>${entidade.data_inicio}</td>
                <td>${entidade.data_termino}</td>
                <td>${entidade.modalidade}</td>
                
            `;
            tbody.appendChild(row);
        });
    })
    .catch(error => console.error('Erro ao carregar as entidades:', error));

    
});