// back-end/server.js

const express = require('express');
const cors = require('cors');

// IMPORTAÇÃO CORRIGIDA:
// auth.js exporta 'router' diretamente (module.exports = router)
const authRoutes = require('./routes/auth'); 
// produtos.js e vendas.js exportam um objeto que contém 'router' e dados simulados ({ router, dados })
const { router: produtosRoutes } = require('./routes/produtos');
const { router: vendasRoutes } = require('./routes/vendas');
// Assumimos que relatorios.js exporta 'router' diretamente
const relatoriosRoutes = require('./routes/relatorios'); 


const app = express();
const PORT = 3001; 

// Middlewares Essenciais
app.use(cors()); 
app.use(express.json()); // Permite que o Express entenda JSON no corpo das requisições

// USO CORRIGIDO DAS ROTAS:
app.use('/api', authRoutes); // Rotas como /api/login
app.use('/api/produtos', produtosRoutes);
app.use('/api/vendas', vendasRoutes);
app.use('/api/relatorios', relatoriosRoutes);

// Rota de Teste Simples
app.get('/', (req, res) => {
  res.send('API do PDV-App está funcionando em modo simulação!');
});

// Inicia o servidor
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT} (MODO SIMULAÇÃO ATIVO)`);
    console.log(`Use admin@pdv.com / 123456`);
});