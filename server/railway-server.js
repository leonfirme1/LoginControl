// Servidor ultra-simplificado para Railway - ES Module
import express from 'express';
import { createServer } from 'http';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import pkg from 'pg';

const { Pool } = pkg;
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Configuração do banco PostgreSQL AWS RDS
const pool = new Pool({
  host: process.env.PGHOST || 'controlehoras-db.c8pqeqc0u2u5.us-east-1.rds.amazonaws.com',
  port: process.env.PGPORT || 5432,
  database: process.env.PGDATABASE || 'controlehoras',
  user: process.env.PGUSER || 'postgres',
  password: process.env.PGPASSWORD,
  ssl: {
    rejectUnauthorized: false
  },
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

// Função para verificar conexão com banco
async function testDatabaseConnection() {
  try {
    const client = await pool.connect();
    const result = await client.query('SELECT NOW()');
    client.release();
    console.log('✅ Conexão PostgreSQL AWS estabelecida:', result.rows[0]);
    return true;
  } catch (error) {
    console.error('❌ Erro conexão PostgreSQL:', error.message);
    return false;
  }
}

// Função para buscar usuário no banco
async function getUserFromDatabase(username, password) {
  try {
    const client = await pool.connect();
    const query = 'SELECT id, name FROM consultants WHERE name = $1 AND password = $2';
    const result = await client.query(query, [username, password]);
    client.release();
    
    if (result.rows.length > 0) {
      console.log('✅ Usuário autenticado:', result.rows[0]);
      return result.rows[0];
    } else {
      console.log('❌ Credenciais inválidas para usuário:', username);
      return null;
    }
  } catch (error) {
    console.error('❌ Erro consulta banco:', error.message);
    throw error;
  }
}

// Configuração básica
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware básico
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Log todas as requisições
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Health check endpoints (Railway requirements)
app.get('/ping', (req, res) => {
  res.status(200).json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    port: PORT,
    node_version: process.version
  });
});

app.get('/health', async (req, res) => {
  try {
    const dbConnected = await testDatabaseConnection();
    res.status(200).json({ 
      status: 'healthy', 
      database: dbConnected ? 'connected' : 'disconnected',
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'development'
    });
  } catch (error) {
    console.error('Health check failed:', error);
    res.status(503).json({ 
      status: 'unhealthy', 
      database: 'error',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Root endpoint - Interface de Login
app.get('/', (req, res) => {
  res.send(`
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Controle de Horas - Login</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { 
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        .container { 
            background: white;
            border-radius: 12px;
            box-shadow: 0 10px 40px rgba(0,0,0,0.1);
            padding: 40px;
            width: 100%;
            max-width: 400px;
        }
        h1 { 
            text-align: center;
            color: #333;
            margin-bottom: 30px;
            font-size: 28px;
        }
        .form-group { 
            margin-bottom: 20px;
        }
        label { 
            display: block;
            margin-bottom: 8px;
            color: #555;
            font-weight: 500;
        }
        input { 
            width: 100%;
            padding: 12px;
            border: 2px solid #e1e1e1;
            border-radius: 8px;
            font-size: 16px;
            transition: border-color 0.3s;
        }
        input:focus {
            outline: none;
            border-color: #667eea;
        }
        button { 
            width: 100%;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 14px;
            border: none;
            border-radius: 8px;
            font-size: 16px;
            font-weight: 600;
            cursor: pointer;
            transition: transform 0.2s;
        }
        button:hover {
            transform: translateY(-2px);
        }
        button:disabled {
            opacity: 0.7;
            cursor: not-allowed;
            transform: none;
        }
        .message {
            margin-top: 20px;
            padding: 12px;
            border-radius: 6px;
            text-align: center;
            font-weight: 500;
        }
        .success { background: #d4edda; color: #155724; border: 1px solid #c3e6cb; }
        .error { background: #f8d7da; color: #721c24; border: 1px solid #f5c6cb; }
        .footer {
            text-align: center;
            margin-top: 30px;
            color: #888;
            font-size: 14px;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>Controle de Horas</h1>
        <form id="loginForm">
            <div class="form-group">
                <label for="username">Usuário:</label>
                <input type="text" id="username" name="username" placeholder="Digite seu usuário" required>
            </div>
            <div class="form-group">
                <label for="password">Senha:</label>
                <input type="password" id="password" name="password" placeholder="Digite sua senha" required>
            </div>
            <button type="submit" id="loginBtn">Entrar</button>
        </form>
        <div id="message"></div>
        <div class="footer">
            Sistema de autenticação AWS RDS PostgreSQL
        </div>
    </div>
    
    <script>
        document.getElementById('loginForm').addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const loginBtn = document.getElementById('loginBtn');
            const messageDiv = document.getElementById('message');
            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;
            
            loginBtn.disabled = true;
            loginBtn.textContent = 'Entrando...';
            messageDiv.innerHTML = '';
            
            try {
                const response = await fetch('/api/login', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ name: username, password })
                });
                
                const data = await response.json();
                
                if (response.ok) {
                    messageDiv.innerHTML = '<div class="message success">✅ Login realizado com sucesso!<br><strong>Bem-vindo, ' + data.name + '!</strong></div>';
                    setTimeout(() => {
                        messageDiv.innerHTML += '<div class="message success">🎉 Sistema funcionando perfeitamente no Railway!</div>';
                    }, 1000);
                } else {
                    messageDiv.innerHTML = '<div class="message error">❌ ' + data.message + '</div>';
                }
            } catch (error) {
                messageDiv.innerHTML = '<div class="message error">❌ Erro de conexão com o servidor</div>';
            } finally {
                loginBtn.disabled = false;
                loginBtn.textContent = 'Entrar';
            }
        });
        
        // Auto-focus no primeiro campo
        document.getElementById('username').focus();
    </script>
</body>
</html>`);
});

// Endpoint de login com autenticação PostgreSQL real
app.post('/api/login', async (req, res) => {
  console.log('🔐 Tentativa de login:', req.body);
  const { name, password } = req.body;
  
  if (!name || !password) {
    return res.status(400).json({ message: 'Usuário e senha são obrigatórios' });
  }
  
  try {
    const user = await getUserFromDatabase(name, password);
    
    if (user) {
      console.log('✅ Login bem-sucedido para usuário:', user.name);
      res.json({ 
        id: user.id, 
        name: user.name,
        message: 'Login realizado com sucesso!'
      });
    } else {
      console.log('❌ Credenciais inválidas para:', name);
      res.status(401).json({ message: 'Usuário ou senha incorretos' });
    }
  } catch (error) {
    console.error('❌ Erro no login:', error.message);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
});

app.post('/api/register', (req, res) => {
  res.status(400).json({ message: 'Registration not available in test mode' });
});

app.get('/api/user', (req, res) => {
  res.status(401).json({ message: 'Not authenticated' });
});

app.post('/api/logout', (req, res) => {
  res.json({ message: 'Logged out' });
});

// Servir arquivos estáticos em produção
if (process.env.NODE_ENV === 'production') {
  // Tentar localizar arquivos estáticos
  const staticPaths = [
    path.join(__dirname, '../dist/public'),
    path.join(__dirname, '../public'), 
    path.join(process.cwd(), 'dist/public'),
    path.join(process.cwd(), 'public')
  ];
  
  let staticPath = null;
  for (const testPath of staticPaths) {
    if (fs.existsSync(testPath)) {
      staticPath = testPath;
      console.log(`Static files found at: ${staticPath}`);
      break;
    }
  }
  
  if (staticPath) {
    app.use(express.static(staticPath));
    
    // SPA fallback
    app.get('*', (req, res) => {
      const indexPath = path.join(staticPath, 'index.html');
      if (fs.existsSync(indexPath)) {
        res.sendFile(indexPath);
      } else {
        // HTML inline básico para teste
        res.send(`
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Controle de Horas</title>
    <style>
        body { font-family: Arial, sans-serif; padding: 20px; }
        .container { max-width: 400px; margin: 0 auto; }
        .form-group { margin-bottom: 15px; }
        label { display: block; margin-bottom: 5px; }
        input { width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px; }
        button { background: #007bff; color: white; padding: 10px 20px; border: none; border-radius: 4px; cursor: pointer; }
    </style>
</head>
<body>
    <div class="container">
        <h2>Controle de Horas</h2>
        <form id="loginForm">
            <div class="form-group">
                <label>Usuário:</label>
                <input type="text" id="username" value="1" required>
            </div>
            <div class="form-group">
                <label>Senha:</label>
                <input type="password" id="password" value="1" required>
            </div>
            <button type="submit">Entrar</button>
        </form>
        <div id="message"></div>
    </div>
    
    <script>
        document.getElementById('loginForm').addEventListener('submit', async (e) => {
            e.preventDefault();
            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;
            
            try {
                const response = await fetch('/api/login', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ name: username, password })
                });
                
                const data = await response.json();
                const messageDiv = document.getElementById('message');
                
                if (response.ok) {
                    messageDiv.innerHTML = '<p style="color: green;">Login realizado com sucesso! Bem-vindo!</p>';
                } else {
                    messageDiv.innerHTML = '<p style="color: red;">Erro: ' + data.message + '</p>';
                }
            } catch (error) {
                document.getElementById('message').innerHTML = '<p style="color: red;">Erro de conexão</p>';
            }
        });
    </script>
</body>
</html>`);
      }
    });
  } else {
    console.log('No static files directory found - API only mode');
  }
}

// Error handling
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({ message: 'Internal server error' });
});

// Start server
const server = createServer(app);

server.listen(PORT, '0.0.0.0', async () => {
  console.log(`🚀 Railway Server running on port ${PORT}`);
  console.log(`📍 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`💚 Health checks: /ping, /health, /`);
  
  // Testar conexão PostgreSQL na inicialização
  const dbConnected = await testDatabaseConnection();
  if (dbConnected) {
    console.log(`🗄️ Database: PostgreSQL AWS RDS conectado`);
    console.log(`🔐 Autenticação: Tabela 'consultants' disponível`);
  } else {
    console.log(`❌ Aviso: Falha na conexão com PostgreSQL`);
    console.log(`📋 Configure as variáveis: PGUSER, PGPASSWORD`);
  }
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  server.close(() => {
    console.log('Process terminated');
  });
});

process.on('SIGINT', () => {
  console.log('SIGINT received, shutting down gracefully');
  server.close(() => {
    console.log('Process terminated');
  });
});