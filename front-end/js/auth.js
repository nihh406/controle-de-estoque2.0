
const isLoginPage = window.location.pathname.includes('login.html');
const isAppPage = window.location.pathname.includes('index.html') || window.location.pathname === '/';
if (isLoginPage) {
    if (localStorage.getItem('token')) {
        window.location.href = 'index.html'; 
    }

    const loginForm = document.getElementById('login-form');
    const emailInput = document.getElementById('email');
    const senhaInput = document.getElementById('senha');
    const errorMessage = document.getElementById('error-message');
    const loginButton = document.getElementById('login-button');

    loginForm?.addEventListener('submit', async (e) => {
        e.preventDefault();
        errorMessage.textContent = '';
        loginButton.disabled = true;
        loginButton.textContent = 'Entrando...';

        try {
            const data = await api.login(emailInput.value, senhaInput.value);
            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data.usuario)); 
            window.location.href = 'index.html'; 
        } catch (error) {
            errorMessage.textContent = error.message || 'Erro ao fazer login.';
            loginButton.disabled = false;
            loginButton.textContent = 'Entrar';
        }
    });

} else if (isAppPage) {

    if (!localStorage.getItem('token')) {
        window.location.href = 'login.html';
    } else {
        const logoutButton = document.getElementById('logout-button');
        logoutButton?.addEventListener('click', () => {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            window.location.href = 'login.html'; 
        });

        const userInfo = document.getElementById('user-info');
        if (userInfo) {
            try {
                const user = JSON.parse(localStorage.getItem('user'));
                userInfo.textContent = user?.nome || user?.email || 'Usuário';
            } catch (e) {
                userInfo.textContent = 'Usuário';
            }
        }
    }
}