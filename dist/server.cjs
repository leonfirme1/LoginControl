const express = require('express');
const { Pool } = require('pg');
const path = require('path');

console.log('🚀 Iniciando servidor Railway...');

// Configuração do banco PostgreSQL AWS RDS
const pool = new Pool({
  host: 'controlehoras-db.c8pqeqc0u2u5.us-east-1.rds.amazonaws.com',
  port: 5432,
  database: 'controlehoras',
  user: 'postgres',
  password: process.env.PGPASSWORD,
  ssl: {
    rejectUnauthorized: false
  },
  max: 3,
  connectionTimeoutMillis: 3000
});

// Teste de conexão na inicialização
pool.connect()
  .then(client => {
    console.log('✅ PostgreSQL conectado');
    client.release();
  })
  .catch(err => {
    console.error('❌ Erro PostgreSQL:', err.message);
  });

// Função para buscar usuário no banco
async function getUserFromDatabase(username, password) {
  try {
    const result = await pool.query(
      'SELECT id, name FROM consultants WHERE name = $1 AND password = $2',
      [username, password]
    );
    
    if (result.rows.length > 0) {
      console.log('✅ Login OK:', result.rows[0].name);
      return result.rows[0];
    } else {
      console.log('❌ Login falhou:', username);
      return null;
    }
  } catch (error) {
    console.error('❌ Erro banco:', error.message);
    return null;
  }
}

// Configuração básica
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware básico
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  
  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
  } else {
    next();
  }
});

// Log requests
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`);
  next();
});

// Health check para Railway
app.get('/health', (req, res) => {
  res.status(200).send('OK');
});

// Endpoint de login
app.post('/api/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    
    if (!username || !password) {
      return res.status(400).json({ error: 'Dados obrigatórios' });
    }
    
    const user = await getUserFromDatabase(username, password);
    
    if (user) {
      res.json({ 
        success: true, 
        message: 'Login OK',
        user: { id: user.id, name: user.name }
      });
    } else {
      res.status(401).json({ error: 'Credenciais inválidas' });
    }
  } catch (error) {
    console.error('❌ Erro login:', error);
    res.status(500).json({ error: 'Erro servidor' });
  }
});

// Servir frontend
const staticPath = path.join(__dirname, 'public');
app.use(express.static(staticPath));

// SPA fallback
app.get('*', (req, res) => {
  const indexPath = path.join(staticPath, 'index.html');
  res.sendFile(indexPath, (err) => {
    if (err) {
      console.log('❌ Erro index.html:', err.message);
      res.status(404).send('Página não encontrada');
    }
  });
});

// Iniciar servidor
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🌐 Servidor ativo na porta ${PORT}`);
  console.log(`🔗 PostgreSQL: AWS RDS conectado`);
});