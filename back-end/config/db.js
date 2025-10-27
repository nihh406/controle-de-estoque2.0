
require('dotenv').config();
const mysql = require('mysql2/promise'); 

const pool = mysql.createPool({
    host: '127.0.0.1',
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    port: process.env.DB_PORT || 3306,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

async function testConnection() {
    try {
        const connection = await pool.getConnection();
        console.log('Conexão com o banco de dados MySQL estabelecida com sucesso.');
        connection.release(); // Libera a conexão de volta para o pool
    } catch (error) {
        console.error('ERRO ao conectar ao banco de dados:', error);
        // Em caso de erro grave, encerrar o processo para evitar execução parcial
        process.exit(1); 
    }
}

module.exports = { pool, testConnection };