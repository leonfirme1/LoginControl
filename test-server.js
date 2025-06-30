const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Health checks
app.get('/ping', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.get('/health', (req, res) => {
  res.json({ status: 'healthy', port: PORT });
});

app.get('/', (req, res) => {
  res.send(`
    <h1>Controle de Horas - Teste Railway</h1>
    <p>Servidor funcionando na porta ${PORT}</p>
    <p>Node.js ${process.version}</p>
    <p>Erro do Node.js 18 corrigido!</p>
  `);
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});