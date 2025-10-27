const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { produtosSimulados } = require('./produtos');
const { vendasSimuladas } = require('./vendas'); 

router.get('/resumo', auth, (req, res) => {
    let lucroTotal = 0;
    let vendasLiquidas = 0;
    let totalVendas = vendasSimuladas.length;

    vendasSimuladas.forEach(venda => {
        venda.itens.forEach(itemVenda => {
            const produtoBase = produtosSimulados.find(p => p.id === itemVenda.produto_id);
            
            if (produtoBase && produtoBase.preco_custo) {
                const custoTotal = produtoBase.preco_custo * itemVenda.quantidade;
                const receitaTotal = itemVenda.preco_venda * itemVenda.quantidade;
                
                lucroTotal += (receitaTotal - custoTotal);
                vendasLiquidas += receitaTotal;
            }
        });
    });

    const produtosEmAlerta = produtosSimulados.filter(p => p.estoque_atual <= p.estoque_minimo).length;

    res.json({
        totalVendas: totalVendas,
        valorTotalVendido: parseFloat(vendasLiquidas.toFixed(2)),
        lucroBruto: parseFloat(lucroTotal.toFixed(2)),
        produtosEmAlerta: produtosEmAlerta,
    });
});

module.exports = router;