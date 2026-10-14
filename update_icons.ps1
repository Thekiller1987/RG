Add-Type -AssemblyName System.Drawing

$sourcePath = "C:\Users\waska\Desktop\Proyectos Personales\RG\logo nuevo.png"
if (-not (Test-Path $sourcePath)) {
    Write-Error "No se encontro el archivo $sourcePath"
    exit 1
}

$srcImage = [System.Drawing.Image]::FromFile($sourcePath)

function Resize-And-Save($targetPath, $width, $height) {
    $dir = Split-Path $targetPath -Parent
    if (-not (Test-Path $dir)) {
        New-Item -ItemType Directory -Path $dir -Force | Out-Null
    }
    
    $destBitmap = New-Object System.Drawing.Bitmap($width, $height)
    $graphics = [System.Drawing.Graphics]::FromImage($destBitmap)
    $graphics.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $graphics.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
    $graphics.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
    $graphics.CompositingQuality = [System.Drawing.Drawing2D.CompositingQuality]::HighQuality
    
    # Limpiar fondo transparente
    $graphics.Clear([System.Drawing.Color]::Transparent)
    
    $graphics.DrawImage($srcImage, 0, 0, $width, $height)
    $destBitmap.Save($targetPath, [System.Drawing.Imaging.ImageFormat]::Png)
    $graphics.Dispose()
    $destBitmap.Dispose()
    Write-Host "Generado: $targetPath ($($width)x$($height))"
}

# 1. Android Mipmaps (Iconos de la app)
$androidRes = "C:\Users\waska\Desktop\Proyectos Personales\RG\client\android\app\src\main\res"

$mipmaps = @(
    @{ folder = "mipmap-mdpi"; launcher = 48; foreground = 108 },
    @{ folder = "mipmap-hdpi"; launcher = 72; foreground = 162 },
    @{ folder = "mipmap-xhdpi"; launcher = 96; foreground = 216 },
    @{ folder = "mipmap-xxhdpi"; launcher = 144; foreground = 324 },
    @{ folder = "mipmap-xxxhdpi"; launcher = 192; foreground = 432 }
)

foreach ($m in $mipmaps) {
    $fPath = Join-Path $androidRes $m.folder
    Resize-And-Save (Join-Path $fPath "ic_launcher.png") $m.launcher $m.launcher
    Resize-And-Save (Join-Path $fPath "ic_launcher_round.png") $m.launcher $m.launcher
    Resize-And-Save (Join-Path $fPath "ic_launcher_foreground.png") $m.foreground $m.foreground
}

# 2. Splash screens
$splashes = @(
    "drawable\splash.png",
    "drawable-land-hdpi\splash.png",
    "drawable-land-mdpi\splash.png",
    "drawable-land-xhdpi\splash.png",
    "drawable-land-xxhdpi\splash.png",
    "drawable-land-xxxhdpi\splash.png",
    "drawable-port-hdpi\splash.png",
    "drawable-port-mdpi\splash.png",
    "drawable-port-xhdpi\splash.png",
    "drawable-port-xxhdpi\splash.png",
    "drawable-port-xxxhdpi\splash.png"
)

foreach ($s in $splashes) {
    Resize-And-Save (Join-Path $androidRes $s) 480 480
}

# 3. Web icons (public/icons)
$publicIcons = "C:\Users\waska\Desktop\Proyectos Personales\RG\client\public\icons"
Resize-And-Save (Join-Path $publicIcons "logo.png") 512 512
Resize-And-Save (Join-Path $publicIcons "192x192.png") 192 192
Resize-And-Save (Join-Path $publicIcons "icon-512x512.png") 512 512

$srcImage.Dispose()
Write-Host "✅ Todos los iconos y logos actualizados con exito desde 'logo nuevo.png'!"
