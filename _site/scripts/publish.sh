#!/bin/bash
set -e  # interrompe em caso de erro

SOURCE_BRANCH=$(git rev-parse --abbrev-ref HEAD)
TARGET_BRANCH="live"

echo "🚀 Publicando alterações de '$SOURCE_BRANCH' → '$TARGET_BRANCH'..."

# Garante que não estamos no próprio branch live
if [ "$SOURCE_BRANCH" = "$TARGET_BRANCH" ]; then
  echo "❌ Você já está no branch '$TARGET_BRANCH'. Cancele para evitar merge incorreto."
  exit 1
fi

# Garante que repositório está limpo
if [ -n "$(git status --porcelain)" ]; then
  echo "⚠️  Existem mudanças não commitadas. Faça commit ou stash antes de publicar."
  exit 1
fi

# Atualiza repositório local
git fetch origin

# Garante que o branch live existe
if git show-ref --quiet refs/heads/$TARGET_BRANCH; then
  echo "✅ Branch '$TARGET_BRANCH' existe localmente."
else
  if git show-ref --quiet refs/remotes/origin/$TARGET_BRANCH; then
    echo "⬇️  Criando branch local a partir de origin/$TARGET_BRANCH..."
    git checkout -b $TARGET_BRANCH origin/$TARGET_BRANCH
  else
    echo "⚙️  Criando novo branch '$TARGET_BRANCH' (não existe remoto ainda)..."
    git checkout -b $TARGET_BRANCH
  fi
fi

# Garante que temos a última versão do live
git checkout $TARGET_BRANCH
git pull origin $TARGET_BRANCH || true

# Faz merge do branch de origem
git merge --no-ff "$SOURCE_BRANCH" -m "🚀 Publicação automática de '$SOURCE_BRANCH' → '$TARGET_BRANCH' em $(date +'%Y-%m-%d %H:%M:%S')"

# Envia para o remoto (aciona o Actions)
git push origin $TARGET_BRANCH

# Retorna para o branch original
git checkout "$SOURCE_BRANCH"

echo "✅ Publicação concluída com sucesso!"
echo "   O GitHub Actions será acionado para build e deploy."
