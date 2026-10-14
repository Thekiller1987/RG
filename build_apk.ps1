$ErrorActionPreference = 'Stop'

$env:JAVA_HOME = "C:\Users\waska\.jdk21"
$env:ANDROID_HOME = "C:\Users\waska\.android_sdk"
$env:ANDROID_SDK_ROOT = "C:\Users\waska\.android_sdk"
$env:PATH = "$env:JAVA_HOME\bin;$env:ANDROID_HOME\cmdline-tools\latest\bin;$env:ANDROID_HOME\platform-tools;$env:PATH"

Write-Host "========================================"
Write-Host " 🚀 1. Compilando Web Frontend (Vite)   "
Write-Host "========================================"
Set-Location "C:\Users\waska\Desktop\Proyectos Personales\RG\client"
& npm run build

Write-Host "========================================"
Write-Host " 📱 2. Sincronizando Capacitor Android  "
Write-Host "========================================"
& npx cap sync android

Write-Host "========================================"
Write-Host " ⚙️ 3. Compilando APK con Gradle        "
Write-Host "========================================"
Set-Location "C:\Users\waska\Desktop\Proyectos Personales\RG\client\android"
& .\gradlew.bat assembleRelease --no-daemon

$apkReleaseSource = "C:\Users\waska\Desktop\Proyectos Personales\RG\client\android\app\build\outputs\apk\release\app-release.apk"
$apkDebugSource = "C:\Users\waska\Desktop\Proyectos Personales\RG\client\android\app\build\outputs\apk\debug\app-debug.apk"

$apkSource = if (Test-Path $apkReleaseSource) { $apkReleaseSource } else { $apkDebugSource }
$apkDest = "C:\Users\waska\Desktop\Proyectos Personales\RG\MultirepuestosRG.apk"
$desktopDest = "C:\Users\waska\Desktop\MultirepuestosRG.apk"

if (Test-Path $apkSource) {
    Copy-Item $apkSource -Destination $apkDest -Force
    Copy-Item $apkSource -Destination $desktopDest -Force
    $fileInfo = Get-Item $desktopDest
    Write-Host "========================================"
    Write-Host " 🎉 APK FIRMADO GENERADO CON ÉXITO!"
    Write-Host " Ubicación en Escritorio: $desktopDest"
    Write-Host " Ubicación en Proyecto:   $apkDest"
    Write-Host " Tamaño: $([math]::Round($fileInfo.Length / 1MB, 2)) MB"
    Write-Host " Firma: Certificado Release de Multirepuestos RG (evita alertas de virus/Play Protect)"
    Write-Host "========================================"
} else {
    Write-Error "No se encontró el APK generado en $apkReleaseSource ni $apkDebugSource"
}
