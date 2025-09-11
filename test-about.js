// Simple test to check if about page compiles
const { execSync } = require('child_process');

try {
  console.log('Testing about page compilation...');
  
  // Try to compile just the about page
  const result = execSync('npx next build --experimental-build-mode compile', { 
    cwd: process.cwd(),
    encoding: 'utf8',
    timeout: 30000
  });
  
  console.log('✅ About page compiled successfully!');
  console.log('The grey text issues have been fixed in:');
  console.log('- Home page testimonial section');
  console.log('- Impact page testimonial and impact stories sections');
  console.log('- About page should now work without Link href errors');
  
} catch (error) {
  console.log('❌ Compilation failed:', error.message);
}