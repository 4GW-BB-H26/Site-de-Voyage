$ErrorActionPreference = "Stop"

Write-Host ""
Write-Host "=== Deploy backend Travel Express ==="
Write-Host ""

$backendRoot = Split-Path -Parent $PSScriptRoot
Set-Location $backendRoot

if (-not (Test-Path ".env")) {
  if (Test-Path ".env.example") {
    Copy-Item ".env.example" ".env"
    Write-Host ".env créé à partir de .env.example"
    Write-Host "Ouvre backend/.env et remplis les valeurs avant de lancer l'API."
  } else {
    Write-Host "Aucun .env.example trouvé. Crée un .env à la main."
  }
}

Write-Host ""
Write-Host "Installation des dépendances..."
npm install

Write-Host ""
Write-Host "Backend prêt."
Write-Host "Commande pour démarrer: npm run dev"
Write-Host ""
