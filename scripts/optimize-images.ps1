# PowerShell script to optimize gallery images
# This script converts JPG images to WebP format for better performance
# Requires ImageMagick or similar tool to be installed

param(
    [string]$InputDir = "public/gallery",
    [string]$OutputDir = "public/gallery",
    [int]$Quality = 85
)

Write-Host "Starting image optimization process..." -ForegroundColor Green

# Check if input directory exists
if (-not (Test-Path $InputDir)) {
    Write-Error "Input directory '$InputDir' does not exist!"
    exit 1
}

# Create output directory if it doesn't exist
if (-not (Test-Path $OutputDir)) {
    New-Item -ItemType Directory -Path $OutputDir -Force
    Write-Host "Created output directory: $OutputDir" -ForegroundColor Yellow
}

# Get all JPG files
$jpgFiles = Get-ChildItem -Path $InputDir -Filter "*.jpg"

if ($jpgFiles.Count -eq 0) {
    Write-Warning "No JPG files found in '$InputDir'"
    exit 0
}

Write-Host "Found $($jpgFiles.Count) JPG files to process" -ForegroundColor Cyan

# Process each image
foreach ($file in $jpgFiles) {
    $inputPath = $file.FullName
    $webpPath = Join-Path $OutputDir ($file.BaseName + ".webp")
    
    Write-Host "Processing: $($file.Name)" -ForegroundColor White
    
    # Try to convert using different methods
    $converted = $false
    
    # Method 1: Try using magick (ImageMagick)
    if (Get-Command "magick" -ErrorAction SilentlyContinue) {
        try {
            & magick $inputPath -quality $Quality $webpPath
            $converted = $true
            Write-Host "  ✓ Converted using ImageMagick" -ForegroundColor Green
        }
        catch {
            Write-Warning "  ✗ ImageMagick conversion failed: $($_.Exception.Message)"
        }
    }
    
    # Method 2: Try using cwebp (Google WebP tools)
    if (-not $converted -and (Get-Command "cwebp" -ErrorAction SilentlyContinue)) {
        try {
            & cwebp -q $Quality $inputPath -o $webpPath
            $converted = $true
            Write-Host "  ✓ Converted using cwebp" -ForegroundColor Green
        }
        catch {
            Write-Warning "  ✗ cwebp conversion failed: $($_.Exception.Message)"
        }
    }
    
    if (-not $converted) {
        Write-Warning "  ✗ Could not convert $($file.Name) - no suitable converter found"
        Write-Host "    Install ImageMagick or Google WebP tools to enable conversion" -ForegroundColor Yellow
    }
}

Write-Host "`nImage optimization complete!" -ForegroundColor Green
Write-Host "Note: If conversions failed, install one of the following:" -ForegroundColor Yellow
Write-Host "  - ImageMagick: https://imagemagick.org/script/download.php#windows" -ForegroundColor Cyan
Write-Host "  - Google WebP tools: https://developers.google.com/speed/webp/download" -ForegroundColor Cyan