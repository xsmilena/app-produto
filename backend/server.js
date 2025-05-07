// simplifica o processo de criação de servidores e rotas HTTP. É a base do nosso servidor.
// mysql - permitir conexão com o banco de dados
// cors

const express = require('express');
const mysql = require('mysql');
const cors = require('cors');


// Configuração do banco de dados diretamente no server.js
const dbConfig = {
    host: 'localhost',  // Endereço do servidor MySQL
    user: 'root',       // Usuário padrão do XAMPP
    password: '',       // Senha padrão do XAMPP (vazia)
    database: 'exemplo_app'  // Nome do banco de dados que criamos
  };
  
//contante express para facilitar a rota e a criação da porta que irá rodar o servidor
const app = express();
const PORT = 3000;
  
// Middleware
app.use(cors());
app.use(express.json());

// Criar conexão com o banco de dados
const connection = mysql.createConnection(dbConfig);

// Conectar ao banco de dados
connection.connect(err => {
  if (err) {
    console.error('Erro ao conectar ao banco de dados:', err);
    return;
  }
  console.log('Conectado ao banco de dados MySQL');
});

// Endpoint para buscar todos os produtos
// app é onde a gente colocou o expess, que cria rotas
// esse get cria pastas dentro do node, primeiro a pasta API e depois a pasta PRODUTOS. Então ele vai no nosso banco de dos e faz a pesquisa
app.get('/api/produtos', (req, res) => {
    connection.query('SELECT * FROM produtos', (err, results) => {
      if (err) {
        console.error('Erro ao buscar produtos:', err);
        return res.status(500).json({ error: 'Erro ao buscar produtos' });
      }
      res.json(results);
    });
  });
  
// Endpoint para buscar um produto especifico pelo ID
app.get('/api/produtos/:id', (req, res) => {
    const id = req.params.id;
    connection.query('SELECT * FROM produtos WHERE id = ?', [id], (err, results) => {
      if (err) {
        console.error('Erro ao buscar produto:', err);
        return res.status(500).json({ error: 'Erro ao buscar produto' });
      }
  
      if (results.length === 0) {
        return res.status(404).json({ error: 'Produto não encontrado' });
      }
  
      res.json(results[0]);
    });
  });
  
  // Iniciar o servidor
  // na porta 3000 ele inicializa o servidor
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
  });
  