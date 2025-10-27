function renderDashboard() {
    const mainContent = document.getElementById('main-content');
    mainContent.innerHTML = `
        <h2>Dashboard</h2>
        <p>Bem-vindo ao PDV App! Aqui você verá um resumo das vendas e estoque.</p>
        `;
}

async function renderProdutos() {
    const mainContent = document.getElementById('main-content');
    mainContent.innerHTML = `
        <h2>Gestão de Produtos</h2>
        <button id="add-produto-btn" class="btn btn-primary" style="margin-bottom: 1rem;">Novo Produto</button>
        <div id="produtos-list">Carregando produtos...</div>
        `;
    document.getElementById('add-produto-btn').addEventListener('click', () => {
        alert('Funcionalidade de adicionar produto ainda não implementada no modal.');
    });

    try {
        const produtos = await api.getProdutos();
        const produtosListDiv = document.getElementById('produtos-list');
        if (produtos.length === 0) {
            produtosListDiv.innerHTML = '<p>Nenhum produto cadastrado.</p>';
            return;
        }

        let tableHTML = `
            <table class="styled-table">
                <thead>
                    <tr>
                        <th>Nome</th>
                        <th>Preço Venda</th>
                        <th>Estoque</th>
                        <th>Status</th>
                    </tr>
                </thead>
                <tbody>
        `;
        produtos.forEach(p => {
            const isLowStock = p.estoque_atual <= p.estoque_minimo;
            tableHTML += `
                <tr class="${isLowStock ? 'stock-alert-row' : ''}">
                    <td>${p.nome}</td>
                    <td>R$ ${parseFloat(p.preco_venda).toFixed(2).replace('.', ',')}</td>
                    <td>${p.estoque_atual}</td>
                    <td>${isLowStock ? '<span class="stock-alert">Baixo</span>' : 'Normal'}</td>
                </tr>
            `;
        });
        tableHTML += `</tbody></table>`;
        produtosListDiv.innerHTML = tableHTML;

    } catch (error) {
        document.getElementById('produtos-list').innerHTML = `<p class="error-message">Erro ao carregar produtos: ${error.message}</p>`;
    }
}


function renderPDV() {
    const mainContent = document.getElementById('main-content');
    mainContent.innerHTML = `
        <h2>Ponto de Venda (PDV)</h2>
        <div class="pdv-container">
            <div class="pdv-search">
                <h3>Buscar Produto</h3>
                <input type="text" id="pdv-search-input" placeholder="Nome ou Código de Barras" class="form-group input" style="width: 95%; margin-bottom: 1rem;">
                <div id="pdv-search-results" class="search-results"></div>
            </div>
            <div class="pdv-cart">
                <h3>Carrinho</h3>
                <div id="pdv-cart-items" class="cart-items"><p>Carrinho vazio.</p></div>
                <div class="cart-total">Total: <span id="pdv-cart-total">R$ 0,00</span></div>
                <button id="pdv-finalize-btn" class="btn btn-primary" style="margin-top: 1rem;">Finalizar Venda</button>
                <button id="pdv-clear-btn" class="btn" style="margin-top: 0.5rem; background-color: #eee;">Limpar Carrinho</button>
                 <p id="pdv-message" class="error-message" style="margin-top: 1rem;"></p>
            </div>
        </div>
    `;

}

const pageRenderers = {
    dashboard: renderDashboard,
    produtos: renderProdutos,
    pdv: renderPDV,
};