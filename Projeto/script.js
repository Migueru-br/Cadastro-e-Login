const formUsuario = document.getElementById('formUsuario');
const listaUsuarios = document.getElementById('listaUsuarios');

function carregarUsuarios() {
    fetch('http://localhost:3000/api/usuarios')
        .then(response => response.json())
        .then(data => {
            listaUsuarios.innerHTML = '';
            data.forEach(usuario => {
                const li = document.createElement('li');
                li.textContent = `Nome: ${usuario.nome}`;
                listaUsuarios.appendChild(li);
            });
        })
        .catch(error => console.error('Erro ao carregar usuários:', error));
}

formUsuario.addEventListener('submit', function(event) {
    event.preventDefault();
    const nome = document.getElementById('nome').value;
    const senha = document.getElementById('senha').value;

    fetch('http://localhost:3000/api/usuarios', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nome, senha })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Erro ao cadastrar usuário');
        }
        return response.json();
    })
    .then(data => {
        alert(data.message); 
        formUsuario.reset(); 
        carregarUsuarios(); 
    })
    .catch(error => console.error('Erro ao cadastrar usuário:', error));
});

window.onload = carregarUsuarios;
