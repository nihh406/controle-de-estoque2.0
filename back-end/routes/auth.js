const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');

const JWT_SECRET = 'SEGREDO_MUITO_SECRETO_DO_PDV_SIMPLES'; 

router.post('/login', async (req, res) => {
    const { email, senha } = req.body;

    // LÓGICA HARDCODED PARA TESTE
    if (email === 'admin@pdv.com' && senha === '123456') {
        const token = jwt.sign(
            { id: 99, email: email }, 
            JWT_SECRET,
            { expiresIn: '1h' }
        );

        res.send({
            token,
            usuario: { id: 99, nome: 'Admin Simulado', email: email },
        });
    } else {
         res.status(401).send({ error: 'Credenciais inválidas. Use admin@pdv.com / 123456.' });
    }
});

module.exports = router;