const formTarefa = document.getElementById('formTarefa');
const listaTarefas = document.getElementById('listaTarefas');

function carregarTarefas(nome) {
    fetch(`http://localhost:3000/api/tarefas/${nome}`)
        .then(response => response.json())
        .then(data => {
            listaTarefas.innerHTML = '';
            data.forEach(tarefa => {
                const li = document.createElement('li');
                li.setAttribute('data-id', tarefa.id);
                li.innerHTML = `
                    <span><strong>${tarefa.titulo}</strong>: ${tarefa.descricao}</span>
                    <button class="excluir" onclick="excluirTarefa(${tarefa.id})">Excluir</button>
                `;
                listaTarefas.appendChild(li);
            });
        })
        .catch(error => console.error('Erro ao carregar tarefas:', error));
}




formTarefa.addEventListener('submit', function (event) {
    event.preventDefault();


    const nome2 = document.getElementById('nome').value;
    const titulo = document.getElementById('titulo').value;
    const descricao = document.getElementById('descricao').value;

    fetch('http://localhost:3000/api/tarefas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nome2, titulo, descricao })
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Erro ao adicionar tarefa');
            }
            return response.json();
        })
        .then(() => {
            carregarTarefas(nome2);
        })        
        .catch(error => console.error('Erro ao adicionar tarefa:', error));


});




function excluirTarefa(id) {
    fetch(`http://localhost:3000/api/tarefas/${id}`, {
        method: 'DELETE'
    })
        .then(response => response.json())
        .then(() => {
            const tarefaElemento = document.querySelector(`li[data-id="${id}"]`);
            if (tarefaElemento) {
                listaTarefas.removeChild(tarefaElemento);
            }
        })
        .catch(error => console.error('Erro ao excluir tarefa:', error));
}


window.onload = function () {
    const nome = document.getElementById('nome').value;
    if (nome) {
        carregarTarefas(nome);
    } else {
        console.log('Informe o nome para carregar as tarefas.');
    }
};

