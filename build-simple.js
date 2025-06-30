import { build } from 'esbuild';
import { execSync } from 'child_process';
import fs from 'fs';

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
      outfile: 'dist/index.js',
      packages: 'external',
      minify: false,
      sourcemap: false,
      external: ['./vite'], // Exclude vite module to avoid path issues
      define: {
        'import.meta.dirname': '__dirname'
      },
      banner: {
        js: `
// Node.js 18 compatibility polyfill
import { fileURLToPath } from 'url';
import path from 'path';
const __dirname = path.dirname(fileURLToPath(import.meta.url));
`
      }
    });
    
    // Create a simple start script
    const startScript = `#!/usr/bin/env node
import('./index.js').catch(console.error);
`;
    fs.writeFileSync('dist/start.js', startScript);
    
    console.log('✅ Build completed successfully!');
    console.log('📁 Files created:');
    console.log('  - dist/index.js (main server)');
    console.log('  - dist/start.js (starter script)');
  } catch (error) {
    console.error('❌ Build failed:', error);
    process.exit(1);
  }
}

buildProject();