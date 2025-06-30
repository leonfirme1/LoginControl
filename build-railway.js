import { build } from 'esbuild';
import { execSync } from 'child_process';
import fs from 'fs';

async function buildProject() {
  try {
    console.log('🔨 Building frontend...');
    execSync('npx vite build', { stdio: 'inherit' });
    
    console.log('🔨 Building backend for Railway (Node.js 18)...');
    
    // Build the ultra-simplified server
    await build({
      entryPoints: ['server/index-railway.ts'],
      bundle: true,
      platform: 'node',
      target: 'node18',
      format: 'esm',
      outfile: 'dist/server.js',
      packages: 'external',
      minify: false,
      sourcemap: false,
      // Exclude all problematic modules
      external: [
        './vite',
        './vite.js', 
        'vite',
        '@replit/*'
      ]
    });
    
    console.log('✅ Build completed successfully!');
    console.log('📁 Railway-compatible server created: dist/server.js');
    
    // Verify the build
    if (fs.existsSync('dist/server.js')) {
      console.log('✅ Server file exists and ready for Railway');
    } else {
      throw new Error('Server build failed - file not created');
    }
    
  } catch (error) {
    console.error('❌ Build failed:', error);
    process.exit(1);
  }
}

buildProject();