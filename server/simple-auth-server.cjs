const express = require('express');
const { Pool } = require('pg');
const path = require('path');

// Configuração do banco PostgreSQL AWS RDS
const pool = new Pool({
  host: 'controlehoras-db.c8pqeqc0u2u5.us-east-1.rds.amazonaws.com',
  port: 5432,
  database: 'controlehoras',
  user: 'postgres',
  password: process.env.PGPASSWORD,
  ssl: {
    rejectUnauthorized: false
  }
});

// Função para buscar usuário no banco
async function getUserFromDatabase(username, password) {
  try {
    const result = await pool.query(
      'SELECT id, name FROM consultants WHERE name = $1 AND password = $2',
      [username, password]
    );
    
    if (result.rows.length > 0) {
      console.log('✅ Usuário autenticado:', result.rows[0]);
      return result.rows[0];
    } else {
      console.log('❌ Credenciais inválidas para usuário:', username);
      return null;
    }
  } catch (error) {
    console.error('❌ Erro consulta banco:', error.message);
    return null;
  }
}

// Configuração básica
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware básico
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS simples
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  
  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
  } else {
    next();
  }
});

// Log todas as requisições
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Health check
app.get('/health', (req, res) => {
  res.status(200).send('OK');
});

// Endpoint de login
app.post('/api/login', async (req, res) => {
  try {
    console.log('📝 Tentativa de login:', req.body);
    const { username, password } = req.body;
    
    if (!username || !password) {
      console.log('❌ Dados incompletos');
      return res.status(400).json({ error: 'Usuário e senha são obrigatórios' });
    }
    
    const user = await getUserFromDatabase(username, password);
    
    if (user) {
      console.log('✅ Login bem-sucedido para:', username);
      res.json({ 
        success: true, 
        message: 'Login realizado com sucesso',
        user: { id: user.id, name: user.name }
      });
    } else {
      console.log('❌ Login falhou para:', username);
      res.status(401).json({ error: 'Credenciais inválidas' });
    }
  } catch (error) {
    console.error('❌ Erro no endpoint de login:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Servir arquivos estáticos
app.use(express.static(path.join(__dirname, '../dist/public')));

// Fallback para SPA
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../dist/public/index.html'));
});

// Iniciar servidor
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
  console.log(`📊 Conectado ao PostgreSQL: controlehoras-db.c8pqeqc0u2u5.us-east-1.rds.amazonaws.com`);
});