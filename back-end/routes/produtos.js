const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth'); 

// SIMULAÇÃO DE DADOS EM MEMÓRIA
let produtosSimulados = [
    { id: 1, nome: 'Água Mineral 500ml', preco_venda: 2.50, preco_custo: 1.00, estoque_atual: 50, estoque_minimo: 10, codigo_barras: '12345' },
    { id: 2, nome: 'Chocolate ao Leite', preco_venda: 5.00, preco_custo: 2.50, estoque_atual: 5, estoque_minimo: 10, codigo_barras: '67890' }, // Estoque baixo
    { id: 3, nome: 'Biscoito Salgado', preco_venda: 3.50, preco_custo: 1.50, estoque_atual: 30, estoque_minimo: 5, codigo_barras: '11223' },
];
let nextId = 4;

const filtrarProdutos = (produtos, termo) => {
    if (!termo) return produtos;
    const termoLowerCase = termo.toLowerCase();
    return produtos.filter(p =>
        p.nome.toLowerCase().includes(termoLowerCase) ||
        p.codigo_barras === termo
    );
};

router.get('/', auth, (req, res) => {
    const { search } = req.query; 
    const produtosFiltrados = filtrarProdutos(produtosSimulados, search);
    res.json(produtosFiltrados);
});

router.post('/', auth, (req, res) => {
    const { nome, preco_venda, preco_custo, estoque_atual, estoque_minimo, codigo_barras } = req.body;
    
    const novoProduto = { 
        id: nextId++,
        nome, 
        preco_venda: parseFloat(preco_venda), 
        preco_custo: parseFloat(preco_custo), 
        estoque_atual: parseInt(estoque_atual), 
        estoque_minimo: parseInt(estoque_minimo), 
        codigo_barras
    };
    
    produtosSimulados.push(novoProduto);
    res.status(201).json(novoProduto);
});

module.exports = { router, produtosSimulados };