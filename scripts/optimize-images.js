const fs = require('fs');
const path = require('path');

// Simple image optimization script
// This creates a manifest of images and their metadata
// In a production environment, you'd use tools like sharp or imagemin

const GALLERY_DIR = path.join(__dirname, '../public/gallery');
const OUTPUT_FILE = path.join(__dirname, '../src/config/gallery-manifest.json');

async function generateImageManifest() {
  console.log('🖼️  Generating image manifest...');
  
  try {
    // Read all files in gallery directory
    const files = fs.readdirSync(GALLERY_DIR);
    const imageFiles = files.filter(file => 
      file.toLowerCase().endsWith('.jpg') || 
      file.toLowerCase().endsWith('.jpeg') ||
      file.toLowerCase().endsWith('.webp')
    );
    
    console.log(`Found ${imageFiles.length} image files`);
    
    // Generate manifest with file info
    const manifest = {
      generated: new Date().toISOString(),
      images: imageFiles.map(filename => {
        const filePath = path.join(GALLERY_DIR, filename);
        const stats = fs.statSync(filePath);
        
        return {
          filename,
          size: stats.size,
          lastModified: stats.mtime.toISOString(),
          hasWebP: files.includes(filename.replace(/\.(jpg|jpeg)$/i, '.webp'))
        };
      })
    };
    
    // Write manifest file
    fs.writeFileSync(OUTPUT_FILE, JSON.stringify(manifest, null, 2));
    console.log(`✅ Manifest generated: ${OUTPUT_FILE}`);
    
    // Log summary
    const totalSize = manifest.images.reduce((sum, img) => sum + img.size, 0);
    const webpCount = manifest.images.filter(img => img.hasWebP).length;
    
    console.log(`📊 Summary:`);
    console.log(`   Total images: ${manifest.images.length}`);
    console.log(`   Total size: ${(totalSize / 1024 / 1024).toFixed(2)} MB`);
    console.log(`   WebP versions: ${webpCount}/${manifest.images.length}`);
    
    if (webpCount < manifest.images.length) {
      console.log(`\n💡 To optimize images further, consider:`);
      console.log(`   - Installing ImageMagick or Google WebP tools`);
      console.log(`   - Running the PowerShell optimization script`);
      console.log(`   - Using Next.js Image component for automatic optimization`);
    }
    
  } catch (error) {
    console.error('❌ Error generating manifest:', error.message);
    process.exit(1);
  }
}

// Run the script
generateImageManifest();