
const API_BASE_URL = 'http://localhost:3001/api'; 

async function request(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    const token = localStorage.getItem('token'); 

    const headers = {
        'Content-Type': 'application/json',
        ...options.headers,
    };

    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    const config = {
        method: options.method || 'GET',
        headers: headers,
        body: options.body ? JSON.stringify(options.body) : null,
    };

    try {
        const response = await fetch(url, config);
        const data = await response.json();

        if (!response.ok) {
            
            throw new Error(data.error || `HTTP error! status: ${response.status}`);
        }
        return data;
    } catch (error) {
        console.error('API Request Error:', error);
        throw error;
    }
}

const api = {
    login: (email, senha) => request('/login', {
        method: 'POST',
        body: { email, senha }
    }),
    register: (nome, email, senha) => request('/register', { 
        method: 'POST',
        body: { nome, email, senha }
    }),
    getProdutos: (searchTerm = '') => request(`/produtos?search=${encodeURIComponent(searchTerm)}`),
    createProduto: (produtoData) => request('/produtos', {
        method: 'POST',
        body: produtoData
    }),
    createVenda: (itensVenda) => request('/vendas', {
        method: 'POST',
        body: { itens: itensVenda } 
    }),
};