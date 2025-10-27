const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { produtosSimulados } = require('./produtos'); 

let vendasSimuladas = [];
let nextVendaId = 1;

router.post('/', auth, async (req, res) => {
    const { itens } = req.body; 
    
    let valorTotal = 0;
    
    try {
        for (const item of itens) {
            const produtoIndex = produtosSimulados.findIndex(p => p.id === item.produto_id);
            const produto = produtosSimulados[produtoIndex];

            if (!produto || produto.estoque_atual < item.quantidade) {
                return res.status(400).json({ error: `Estoque insuficiente para ${produto ? produto.nome : 'desconhecido'}.` });
            }
            valorTotal += produto.preco_venda * item.quantidade;
        }
        const novaVenda = {
            id: nextVendaId++,
            usuario_id: req.usuario.id,
            data_venda: new Date(),
            valor_total: parseFloat(valorTotal.toFixed(2)),
            itens: itens,
        };

        for (const item of itens) {
            const produtoIndex = produtosSimulados.findIndex(p => p.id === item.produto_id);
            produtosSimulados[produtoIndex].estoque_atual -= item.quantidade;
        }

        vendasSimuladas.push(novaVenda);
        
        res.status(201).json({ message: 'Venda finalizada com sucesso!', vendaId: novaVenda.id });

    } catch (e) {
        console.error("Erro simulado na venda:", e);
        res.status(500).send({ error: e.message || 'Erro interno ao processar a venda.' });
    }
});

module.exports = { router, vendasSimuladas };