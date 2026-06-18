# Encerra se ocorrer erro
$ErrorActionPreference = "Stop"

$SourceBranch = (git rev-parse --abbrev-ref HEAD).Trim()
$TargetBranch = "live"

Write-Host "🚀 Publicando alterações de '$SourceBranch' → '$TargetBranch'..."

# Impede merge acidental no mesmo branch
if ($SourceBranch -eq $TargetBranch) {
    Write-Host "❌ Você já está no branch '$TargetBranch'. Abortando para evitar merge incorreto."
    exit 1
}

# Verifica repositório limpo
$status = git status --porcelain
if ($status) {
    Write-Host "⚠️  Existem alterações não commitadas. Faça commit ou stash antes de publicar."
    exit 1
}

# Atualiza referências
git fetch origin

# Garante existência do branch 'live'
if (git show-ref --verify --quiet "refs/heads/$TargetBranch") {
    Write-Host "✅ Branch '$TargetBranch' existe localmente."
} elseif (git show-ref --verify --quiet "refs/remotes/origin/$TargetBranch") {
    Write-Host "⬇️  Criando branch local a partir de origin/$TargetBranch..."
    git checkout -b $TargetBranch origin/$TargetBranch
} else {
    Write-Host "⚙️  Criando novo branch '$TargetBranch' (não existe remoto ainda)..."
    git checkout -b $TargetBranch
}

# Garante versão mais recente
git checkout $TargetBranch
try { git pull origin $TargetBranch } catch {}

# Faz merge
$timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
git merge --no-ff $SourceBranch -m "🚀 Publicação automática de '$SourceBranch' → '$TargetBranch' em $timestamp"

# Push
git push origin $TargetBranch

# Retorna ao branch original
git checkout $SourceBranch

Write-Host "✅ Publicação concluída com sucesso!"
Write-Host "   O GitHub Actions será acionado para build e deploy."
