const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const port = 3000;

app.use(cors());
app.use(bodyParser.json());

const db = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: '',
    database: 'teste_db'
});

db.connect(err => {
    if (err) {
        console.error('Erro ao conectar ao MySQL: ', err);
        return;
    }
    console.log("Conectado com sucesso ao Banco de Dados MySQL");
});

app.post('/api/usuarios', (req, res) => {
    const { nome, senha } = req.body;
    const sql = 'INSERT INTO usuarios (nome, senha) VALUES (?, ?)';
    db.query(sql, [nome, senha], (err, result) => {
        if (err) {
            console.error('Erro ao inserir usuário:', err);
            return res.status(500).send('Erro ao inserir usuário');
        }
        res.send({ message: 'Usuário inserido com sucesso!' });
    });
});

app.get('/api/usuarios', (req, res) => {
    const sql = 'SELECT * FROM usuarios';
    db.query(sql, (err, results) => {
        if (err) {
            console.error('Erro ao buscar usuários:', err);
            return res.status(500).send('Erro ao buscar usuários');
        }
        res.send(results);
    });
});


app.post('/api/login', (req, res) => {
    const { nome, senha } = req.body;
    const sql = 'SELECT id FROM usuarios WHERE nome = ? AND senha = ?';

    db.query(sql, [nome, senha], (err, results) => {
        if (err) {
            return res.status(500).send('Erro no servidor');
        }
        if (results.length === 0) {
            return res.status(401).send('Credenciais inválidas');
        }
        const usuario = results[0];
        res.send({ id: usuario.id });
    });
});


app.post('/api/tarefas', (req, res) => {
    const { nome2, titulo, descricao } = req.body;

    if (!nome2 || !titulo || !descricao) {
        return res.status(400).send('Todos os campos são obrigatórios');
    }

    const sqlCheckUser = 'SELECT id FROM usuarios WHERE nome = ?';
    db.query(sqlCheckUser, [nome2], (err, results) => {
        if (err) {
            console.error('Erro ao buscar usuário:', err);
            return res.status(500).send('Erro interno no servidor');
        }

        if (results.length === 0) {
            return res.status(404).send('Usuário não encontrado');
        }

        const usuario_id = results[0].id;


        const sqlInsertTask = 'INSERT INTO tarefas (nome, usuario_id, titulo, descricao) VALUES (?,?, ?, ?)';
        db.query(sqlInsertTask, [nome2, usuario_id, titulo, descricao], (err, result) => {
            if (err) {
                console.error('Erro ao inserir tarefa:', err);
                return res.status(500).send('Erro ao inserir tarefa');
            }
            res.send({ message: 'Tarefa inserida com sucesso!' });
        });
    });
});


app.get('/api/tarefas/:nome', (req, res) => {
    const { nome } = req.params;
    const sql = 'SELECT * FROM tarefas WHERE nome = ?';
    console.log(`Buscando tarefas para o usuário: ${nome}`);
    db.query(sql, [nome], (err, results) => {
        if (err) {
            console.error('Erro ao buscar tarefas:', err);
            return res.status(500).send('Erro ao obter tarefas');
        }
        console.log(`Tarefas encontradas: ${results.length}`);
        res.send(results);
    });

});




app.delete('/api/tarefas/:id', (req, res) => {
    const { id } = req.params;
    const sql = 'DELETE FROM tarefas WHERE id = ?';
    db.query(sql, [id], (err, result) => {
        if (err) {
            return res.status(500).send('Erro ao excluir tarefa');
        }
        res.send({ message: 'Tarefa excluída com sucesso!' });
    });
});

app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
});