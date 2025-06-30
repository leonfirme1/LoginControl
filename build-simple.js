import { build } from 'esbuild';
import { execSync } from 'child_process';

async function buildProject() {
  try {
    console.log('🔨 Building frontend...');
    execSync('npx vite build', { stdio: 'inherit' });
    
    console.log('🔨 Building backend...');
    await build({
      entryPoints: ['server/index-simple.ts'],
      bundle: true,
      platform: 'node',
      target: 'node18',
      format: 'esm',
      outdir: 'dist',
      packages: 'external',
      minify: false,
      sourcemap: false,
      banner: {
        js: `
// Node.js 18 compatibility polyfill
import { fileURLToPath } from 'url';
import path from 'path';
const __dirname = path.dirname(fileURLToPath(import.meta.url));
`
      }
    });
    
    console.log('✅ Build completed successfully!');
  } catch (error) {
    console.error('❌ Build failed:', error);
    process.exit(1);
  }
}

buildProject();