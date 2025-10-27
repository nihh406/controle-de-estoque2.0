
let cart = []; 

document.addEventListener('DOMContentLoaded', () => {
    if (window.location.pathname.includes('index.html') || window.location.pathname === '/') {
        setupNavigation();
        loadPageFromHash(); 

        window.addEventListener('hashchange', loadPageFromHash);
    }
});

function setupNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            const page = link.getAttribute('data-page');

            navLinks.forEach(l => l.classList.remove('active'));
            link.classList.add('active');

        });
    });
}

function loadPageFromHash() {
    const hash = window.location.hash.substring(1) || 'dashboard'; 
    renderPage(hash);

     const navLinks = document.querySelectorAll('.nav-link');
     navLinks.forEach(link => {
        link.classList.toggle('active', link.getAttribute('data-page') === hash);
     });
}


function renderPage(pageName) {
    const renderer = pageRenderers[pageName];
    if (renderer) {
        renderer(); 
        if (pageName === 'pdv') {
            setupPDVListeners();
        }
    } else {
        document.getElementById('main-content').innerHTML = `<h2>Página não encontrada: ${pageName}</h2>`;
    }
}


function setupPDVListeners() {
    const searchInput = document.getElementById('pdv-search-input');
    const searchResultsDiv = document.getElementById('pdv-search-results');
    const finalizeButton = document.getElementById('pdv-finalize-btn');
    const clearButton = document.getElementById('pdv-clear-btn');
    const pdvMessage = document.getElementById('pdv-message');

    let debounceTimer;
    searchInput?.addEventListener('input', () => {
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(async () => {
            const searchTerm = searchInput.value.trim();
            searchResultsDiv.innerHTML = ''; 
            if (searchTerm.length > 0) {
                try {
                    const produtos = await api.getProdutos(searchTerm);
                    if (produtos.length > 0) {
                        produtos.forEach(p => {
                            const div = document.createElement('div');
                            div.className = 'product-card';
                            div.innerHTML = `<span>${p.nome}</span> - <strong>R$ ${parseFloat(p.preco_venda).toFixed(2)}</strong>`;
                            div.onclick = () => addToCart(p); 
                            searchResultsDiv.appendChild(div);
                        });
                    } else {
                        searchResultsDiv.innerHTML = '<p>Nenhum produto encontrado.</p>';
                    }
                } catch (error) {
                     searchResultsDiv.innerHTML = `<p class="error-message">Erro ao buscar: ${error.message}</p>`;
                }
            }
        }, 300); 
    });

    finalizeButton?.addEventListener('click', async () => {
        if (cart.length === 0) {
            pdvMessage.textContent = 'O carrinho está vazio!';
            pdvMessage.style.color = 'red';
            return;
        }

        finalizeButton.disabled = true;
        finalizeButton.textContent = 'Finalizando...';
        pdvMessage.textContent = '';

        const itensParaApi = cart.map(item => ({
            produto_id: item.id,
            quantidade: item.quantidade
        }));

        try {
            const result = await api.createVenda(itensParaApi);
            cart = []; 
            updateCartUI(); 
            pdvMessage.textContent = `Venda ${result.vendaId} finalizada com sucesso!`;
            pdvMessage.style.color = 'green';
             
            setTimeout(() => { pdvMessage.textContent = ''; }, 5000);

        } catch (error) {
            pdvMessage.textContent = `Erro: ${error.message}`;
            pdvMessage.style.color = 'red';
        } finally {
             finalizeButton.disabled = false;
             finalizeButton.textContent = 'Finalizar Venda';
        }
    });

    clearButton?.addEventListener('click', () => {
        cart = [];
        updateCartUI();
        pdvMessage.textContent = ''; 
    });

    updateCartUI();
}

function addToCart(produto) {
    const existingItem = cart.find(item => item.id === produto.id);
    if (existingItem) {
        existingItem.quantidade++;
    } else {
        cart.push({ ...produto, quantidade: 1 });
    }
    updateCartUI();
}

function updateCartUI() {
    const cartItemsDiv = document.getElementById('pdv-cart-items');
    const cartTotalSpan = document.getElementById('pdv-cart-total');
    let total = 0;

    if (!cartItemsDiv || !cartTotalSpan) return; 

    if (cart.length === 0) {
        cartItemsDiv.innerHTML = '<p>Carrinho vazio.</p>';
        cartTotalSpan.textContent = 'R$ 0,00';
        return;
    }

    cartItemsDiv.innerHTML = `
        <table style="width:100%; font-size: 0.9rem;">
            <thead>
                <tr><th>Item</th><th>Qtd</th><th>Preço</th><th>Subtotal</th><th></th></tr>
            </thead>
            <tbody>
                ${cart.map(item => {
                    const subtotal = item.preco_venda * item.quantidade;
                    total += subtotal;
                    return `
                        <tr>
                            <td>${item.nome}</td>
                            <td>
                                <input type="number" value="${item.quantidade}" min="1" data-id="${item.id}" class="cart-item-qty" style="width: 50px; text-align: center;">
                            </td>
                            <td>R$ ${parseFloat(item.preco_venda).toFixed(2)}</td>
                            <td>R$ ${subtotal.toFixed(2)}</td>
                            <td><button class="remove-item-btn" data-id="${item.id}" style="color: red; border: none; background: none; cursor: pointer;">X</button></td>
                        </tr>
                    `;
                }).join('')}
            </tbody>
        </table>
    `;
    cartTotalSpan.textContent = `R$ ${total.toFixed(2).replace('.', ',')}`;

    
    document.querySelectorAll('.remove-item-btn').forEach(btn => {
        btn.onclick = () => removeFromCart(parseInt(btn.getAttribute('data-id')));
    });
    document.querySelectorAll('.cart-item-qty').forEach(input => {
        input.onchange = () => updateQuantity(parseInt(input.getAttribute('data-id')), parseInt(input.value));
    });
}

function removeFromCart(produtoId) {
    cart = cart.filter(item => item.id !== produtoId);
    updateCartUI();
}

function updateQuantity(produtoId, quantidade) {
    if (quantidade <= 0) {
        removeFromCart(produtoId);
        return;
    }
    const item = cart.find(item => item.id === produtoId);
    if (item) {
        item.quantidade = quantidade;
    }
    updateCartUI();
}