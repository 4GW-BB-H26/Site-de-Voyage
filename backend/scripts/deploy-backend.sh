#!/usr/bin/env bash
set -euo pipefail

echo ""
echo "=== Deploy backend Travel Express ==="
echo ""

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
BACKEND_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
cd "$BACKEND_ROOT"

if [ ! -f ".env" ]; then
  if [ -f ".env.example" ]; then
    cp ".env.example" ".env"
    echo ".env créé à partir de .env.example"
    echo "Ouvre backend/.env et remplis les valeurs avant de lancer l'API."
  else
    echo "Aucun .env.example trouvé. Crée un .env à la main."
  fi
fi

echo ""
echo "Installation des dépendances..."
npm install

echo ""
echo "Backend prêt."
echo "Commande pour démarrer: npm run dev"
echo ""
