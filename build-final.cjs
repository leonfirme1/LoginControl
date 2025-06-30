const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

function buildForRailway() {
  try {
    console.log('🔨 Building frontend...');
    execSync('npx vite build', { stdio: 'inherit' });
    
    console.log('🔨 Preparing Railway server...');
    
    // Criar diretório dist se não existir
    if (!fs.existsSync('dist')) {
      fs.mkdirSync('dist', { recursive: true });
    }
    
    // Copiar servidor JavaScript puro
    const serverSource = path.join('server', 'railway-server.js');
    const serverDest = path.join('dist', 'server.js');
    
    fs.copyFileSync(serverSource, serverDest);
    console.log('✅ Server copied to dist/server.js');
    
    // Verificar se tudo está no lugar
    const distContents = fs.readdirSync('dist');
    console.log('📁 Dist folder contents:', distContents);
    
    console.log('✅ Build completed successfully!');
    console.log('🚀 Ready for Railway deployment');
    
  } catch (error) {
    console.error('❌ Build failed:', error.message);
    process.exit(1);
  }
}

buildForRailway();