/**
 * Performance audit script
 */

const fs = require('fs');
const path = require('path');

// Analyze bundle size
function analyzeBundleSize() {
  const buildDir = path.join(process.cwd(), '.next');
  
  if (!fs.existsSync(buildDir)) {
    console.log('❌ Build directory not found. Run "npm run build" first.');
    return;
  }

  console.log('📊 Bundle Size Analysis');
  console.log('======================');

  // Check static files
  const staticDir = path.join(buildDir, 'static');
  if (fs.existsSync(staticDir)) {
    const chunks = fs.readdirSync(path.join(staticDir, 'chunks'));
    let totalSize = 0;

    chunks.forEach(chunk => {
      const chunkPath = path.join(staticDir, 'chunks', chunk);
      const stats = fs.statSync(chunkPath);
      const sizeKB = (stats.size / 1024).toFixed(2);
      totalSize += stats.size;
      
      if (stats.size > 100 * 1024) { // > 100KB
        console.log(`⚠️  Large chunk: ${chunk} (${sizeKB} KB)`);
      }
    });

    console.log(`📦 Total bundle size: ${(totalSize / 1024 / 1024).toFixed(2)} MB`);
  }
}

// Check image optimization
function checkImageOptimization() {
  console.log('\n🖼️  Image Optimization Check');
  console.log('============================');

  const publicDir = path.join(process.cwd(), 'public');
  const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.bmp'];
  
  function checkDirectory(dir, relativePath = '') {
    const items = fs.readdirSync(dir);
    
    items.forEach(item => {
      const fullPath = path.join(dir, item);
      const stats = fs.statSync(fullPath);
      
      if (stats.isDirectory()) {
        checkDirectory(fullPath, path.join(relativePath, item));
      } else {
        const ext = path.extname(item).toLowerCase();
        if (imageExtensions.includes(ext)) {
          const sizeKB = (stats.size / 1024).toFixed(2);
          const imagePath = path.join(relativePath, item);
          
          if (stats.size > 500 * 1024) { // > 500KB
            console.log(`⚠️  Large image: ${imagePath} (${sizeKB} KB)`);
          } else if (stats.size > 100 * 1024) { // > 100KB
            console.log(`ℹ️  Medium image: ${imagePath} (${sizeKB} KB)`);
          }
        }
      }
    });
  }
  
  if (fs.existsSync(publicDir)) {
    checkDirectory(publicDir);
  }
}

// Check for performance best practices
function checkBestPractices() {
  console.log('\n✅ Performance Best Practices');
  console.log('==============================');

  const checks = [
    {
      name: 'Next.js Image component usage',
      check: () => {
        const srcDir = path.join(process.cwd(), 'src');
        let hasOptimizedImages = false;
        
        function searchFiles(dir) {
          const items = fs.readdirSync(dir);
          
          items.forEach(item => {
            const fullPath = path.join(dir, item);
            const stats = fs.statSync(fullPath);
            
            if (stats.isDirectory()) {
              searchFiles(fullPath);
            } else if (item.endsWith('.tsx') || item.endsWith('.jsx')) {
              const content = fs.readFileSync(fullPath, 'utf8');
              if (content.includes('from "next/image"') || content.includes('from \'next/image\'')) {
                hasOptimizedImages = true;
              }
            }
          });
        }
        
        if (fs.existsSync(srcDir)) {
          searchFiles(srcDir);
        }
        
        return hasOptimizedImages;
      }
    },
    {
      name: 'Lazy loading implementation',
      check: () => {
        const lazyHookPath = path.join(process.cwd(), 'src/hooks/useLazyLoading.ts');
        return fs.existsSync(lazyHookPath);
      }
    },
    {
      name: 'Performance utilities',
      check: () => {
        const perfLibPath = path.join(process.cwd(), 'src/lib/performance.ts');
        return fs.existsSync(perfLibPath);
      }
    },
    {
      name: 'Bundle optimization in Next.js config',
      check: () => {
        const configPath = path.join(process.cwd(), 'next.config.ts');
        if (fs.existsSync(configPath)) {
          const content = fs.readFileSync(configPath, 'utf8');
          return content.includes('optimizePackageImports');
        }
        return false;
      }
    }
  ];

  checks.forEach(({ name, check }) => {
    const passed = check();
    console.log(`${passed ? '✅' : '❌'} ${name}`);
  });
}

// Generate performance report
function generateReport() {
  console.log('🚀 SCES Website Performance Audit');
  console.log('==================================\n');

  analyzeBundleSize();
  checkImageOptimization();
  checkBestPractices();

  console.log('\n📋 Recommendations:');
  console.log('- Run "npm run build:analyze" to see detailed bundle analysis');
  console.log('- Use "npm run perf:lighthouse" to run Lighthouse audit');
  console.log('- Optimize large images with "npm run optimize-images"');
  console.log('- Monitor Core Web Vitals in production');
}

// Run the audit
generateReport();