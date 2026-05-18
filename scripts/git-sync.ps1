# ============================================================
# חכמוני — Bidirectional Git Sync
# ============================================================
# מבוצע ע"י:
# - Claude Code hook (SessionStart: pull, Stop: push)
# - Windows Task Scheduler (כל שעה)
# - הרצה ידנית
# ============================================================
# Patches מהמועצה:
# - Patch #13: lock-file mechanism (.git/sync.lock)
# - Patch #13: git add מפורש (לא -A) — מונע push של secrets בטעות
# ============================================================

param(
  [string]$Action = 'sync',  # 'sync' | 'pull' | 'push'
  [string]$Message = "auto-sync from $env:COMPUTERNAME at $(Get-Date -Format 'yyyy-MM-dd HH:mm')"
)

$ErrorActionPreference = 'Stop'
$ProjectRoot = Split-Path -Parent (Split-Path -Parent $MyInvocation.MyCommand.Path)
Set-Location $ProjectRoot

# ─── Lock mechanism — מונע race בין Task Scheduler ל-Claude hook ───
$lockFile = '.git\sync.lock'
if (Test-Path $lockFile) {
  $lockAge = (Get-Date) - (Get-Item $lockFile).LastWriteTime
  if ($lockAge.TotalMinutes -lt 5) {
    Write-Host "Sync already running (lock age: $([Math]::Round($lockAge.TotalSeconds))s). Exit."
    exit 0
  }
  Write-Host "Stale lock found ($([Math]::Round($lockAge.TotalMinutes)) min). Removing."
  Remove-Item $lockFile -Force
}

try {
  New-Item -Path $lockFile -ItemType File -Force | Out-Null
} catch {
  Write-Error "Cannot create lock file."
  exit 1
}

try {
  # ─── PULL ───
  if ($Action -in 'sync', 'pull') {
    Write-Host "🔽 Pulling..."
    git pull --rebase --autostash
    if ($LASTEXITCODE -ne 0) {
      New-Item -Path '.git\SYNC_CONFLICT' -ItemType File -Force | Out-Null
      Write-Error "Rebase conflict. Manual resolution needed. See .git/SYNC_CONFLICT flag."
      exit 1
    }
  }

  # ─── PUSH ───
  if ($Action -in 'sync', 'push') {
    $status = git status --porcelain
    if ($status) {
      Write-Host "🔼 Pushing changes..."

      # ⚠ Patch #13: רשימה מפורשת של תיקיות, לא git add -A עיוור
      git add src/ docs/ styles/ scripts/ assets/ design-mocks/ .claude/ tests/
      git add index.html CLAUDE.md README.md PLAN.md .gitignore -- 2>$null

      $staged = git diff --cached --name-only
      if ($staged) {
        git commit -m $Message
        git push
        Write-Host "✓ Pushed."
      } else {
        Write-Host "No tracked files changed."
      }
    } else {
      Write-Host "Nothing to push."
    }
  }
} finally {
  Remove-Item $lockFile -Force -ErrorAction SilentlyContinue
}
