#!/usr/bin/env node

/**
 * Configuration validation script for SCES website
 * Run with: node scripts/validate-config.js
 */

const path = require('path');
const fs = require('fs');

// Simple validation without importing the full Next.js app
function validateBasicConfig() {
  console.log('🔍 Validating SCES Website Configuration...\n');

  const errors = [];
  const warnings = [];
  const recommendations = [];

  // Check if required files exist
  const requiredFiles = [
    'src/config/content.ts',
    'src/config/settings.ts',
    'src/lib/content-manager.ts',
    'src/lib/settings-manager.ts',
    'src/lib/env-manager.ts',
    '.env.example'
  ];

  console.log('📁 Checking required configuration files...');
  requiredFiles.forEach(file => {
    const filePath = path.join(process.cwd(), file);
    if (fs.existsSync(filePath)) {
      console.log(`  ✅ ${file}`);
    } else {
      console.log(`  ❌ ${file}`);
      errors.push(`Missing required file: ${file}`);
    }
  });

  // Check environment variables
  console.log('\n🔐 Checking environment configuration...');
  
  const envPath = path.join(process.cwd(), '.env.local');
  const envExamplePath = path.join(process.cwd(), '.env.example');
  
  if (fs.existsSync(envPath)) {
    console.log('  ✅ .env.local file exists');
  } else {
    console.log('  ⚠️  .env.local file not found');
    warnings.push('Create .env.local file from .env.example template');
  }

  if (fs.existsSync(envExamplePath)) {
    console.log('  ✅ .env.example file exists');
  } else {
    console.log('  ❌ .env.example file missing');
    errors.push('Missing .env.example template file');
  }

  // Check package.json for required dependencies
  console.log('\n📦 Checking package dependencies...');
  
  const packagePath = path.join(process.cwd(), 'package.json');
  if (fs.existsSync(packagePath)) {
    try {
      const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
      const requiredDeps = [
        'next',
        'react',
        'tailwindcss',
        '@types/node',
        'typescript'
      ];

      const allDeps = {
        ...packageJson.dependencies,
        ...packageJson.devDependencies
      };

      requiredDeps.forEach(dep => {
        if (allDeps[dep]) {
          console.log(`  ✅ ${dep}`);
        } else {
          console.log(`  ❌ ${dep}`);
          errors.push(`Missing required dependency: ${dep}`);
        }
      });
    } catch (error) {
      console.log('  ❌ Error reading package.json');
      errors.push('Invalid package.json file');
    }
  } else {
    console.log('  ❌ package.json not found');
    errors.push('Missing package.json file');
  }

  // Check TypeScript configuration
  console.log('\n⚙️  Checking TypeScript configuration...');
  
  const tsConfigPath = path.join(process.cwd(), 'tsconfig.json');
  if (fs.existsSync(tsConfigPath)) {
    console.log('  ✅ tsconfig.json exists');
  } else {
    console.log('  ❌ tsconfig.json missing');
    errors.push('Missing TypeScript configuration');
  }

  // Check Tailwind configuration
  console.log('\n🎨 Checking Tailwind CSS configuration...');
  
  const tailwindConfigPath = path.join(process.cwd(), 'tailwind.config.ts');
  const postcssConfigPath = path.join(process.cwd(), 'postcss.config.mjs');
  
  if (fs.existsSync(tailwindConfigPath)) {
    console.log('  ✅ tailwind.config.ts exists (Tailwind v3)');
  } else if (fs.existsSync(postcssConfigPath)) {
    try {
      const postcssContent = fs.readFileSync(postcssConfigPath, 'utf8');
      if (postcssContent.includes('@tailwindcss/postcss')) {
        console.log('  ✅ Tailwind CSS v4 configured via PostCSS');
      } else {
        console.log('  ⚠️  PostCSS config exists but Tailwind not detected');
        warnings.push('Tailwind CSS configuration may be incomplete');
      }
    } catch (error) {
      console.log('  ❌ Error reading PostCSS config');
      errors.push('Invalid PostCSS configuration');
    }
  } else {
    console.log('  ❌ No Tailwind configuration found');
    errors.push('Missing Tailwind CSS configuration');
  }

  // Generate recommendations
  if (errors.length === 0 && warnings.length === 0) {
    recommendations.push('Configuration looks good! Run `npm run dev` to start development.');
  }

  if (warnings.length > 0) {
    recommendations.push('Address warnings to ensure full functionality.');
  }

  recommendations.push('Run `npm run build` to test production build.');
  recommendations.push('Use `npm run validate-config` regularly during development.');

  // Print summary
  console.log('\n📊 Validation Summary');
  console.log('='.repeat(50));
  
  if (errors.length === 0) {
    console.log('✅ Status: PASSED');
  } else {
    console.log('❌ Status: FAILED');
  }

  console.log(`📈 Score: ${Math.max(0, 100 - (errors.length * 20) - (warnings.length * 5))}/100`);

  if (errors.length > 0) {
    console.log('\n❌ Errors:');
    errors.forEach(error => console.log(`  - ${error}`));
  }

  if (warnings.length > 0) {
    console.log('\n⚠️  Warnings:');
    warnings.forEach(warning => console.log(`  - ${warning}`));
  }

  if (recommendations.length > 0) {
    console.log('\n💡 Recommendations:');
    recommendations.forEach(rec => console.log(`  - ${rec}`));
  }

  console.log('\n' + '='.repeat(50));
  
  if (errors.length > 0) {
    console.log('❌ Configuration validation failed. Please fix the errors above.');
    process.exit(1);
  } else {
    console.log('✅ Configuration validation passed!');
    process.exit(0);
  }
}

// Run validation
validateBasicConfig();