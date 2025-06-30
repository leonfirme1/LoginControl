// Servidor ultra-simplificado para Railway - JavaScript puro
const express = require('express');
const { createServer } = require('http');
const path = require('path');
const fs = require('fs');

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

app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'healthy', 
    database: 'available',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({ 
    message: 'Controle de Horas API',
    status: 'running',
    version: '1.0.0',
    endpoints: ['/ping', '/health', '/api/login', '/api/register']
  });
});

// Endpoints de API básicos (temporários para teste)
app.post('/api/login', (req, res) => {
  console.log('Login attempt:', req.body);
  const { name, password } = req.body;
  
  // Teste básico
  if (name === '1' && password === '1') {
    res.json({ 
      id: 1, 
      name: '1',
      message: 'Login successful' 
    });
  } else {
    res.status(401).json({ message: 'Invalid credentials' });
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

server.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Railway Server running on port ${PORT}`);
  console.log(`📍 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`💚 Health checks: /ping, /health, /`);
  console.log(`🔧 Test login: usuário "1", senha "1"`);
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