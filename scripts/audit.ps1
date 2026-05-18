# ============================================================
# חכמוני — Lighthouse Audit
# ============================================================
# מריץ Lighthouse על המשחק הרץ ומשווה ל-budgets.
# דורש Node.js + lighthouse CLI מותקן (לא נדרש ב-MVP).
# יחסוך בPhase 2 כש-CI יהיה רלוונטי.
# ============================================================

$ErrorActionPreference = 'Continue'  # אל תקרוס אם lighthouse לא מותקן

# Check if lighthouse is installed
if (-not (Get-Command lighthouse -ErrorAction SilentlyContinue)) {
  Write-Warning "lighthouse לא מותקן. התקן עם: npm install -g lighthouse"
  Write-Host "מדלג — לא חוסם MVP."
  exit 0
}

# Check if server is running
try {
  $resp = Invoke-WebRequest 'http://127.0.0.1:8080' -UseBasicParsing -TimeoutSec 2
} catch {
  Write-Warning "חכמוני לא רץ על localhost:8080. הפעל start-chachmoni.ps1 קודם."
  exit 0
}

# Run Lighthouse
$outFile = "lighthouse-report-$(Get-Date -Format 'yyyy-MM-dd-HHmm').json"
lighthouse http://127.0.0.1:8080 --output=json --output-path=$outFile --quiet --chrome-flags="--headless"

if (-not (Test-Path $outFile)) {
  Write-Error "Lighthouse failed."
  exit 1
}

# Parse results
$report = Get-Content $outFile | ConvertFrom-Json

$fcp = $report.audits.'first-contentful-paint'.numericValue
$tti = $report.audits.interactive.numericValue
$performance = $report.categories.performance.score * 100
$a11y = $report.categories.accessibility.score * 100

# Budgets
$budgets = @{
  FCP = 1000
  TTI = 2000
  Performance = 90
  A11y = 95
}

Write-Host ""
Write-Host "Lighthouse Results:"
Write-Host "  FCP:         $([Math]::Round($fcp))ms (budget: $($budgets.FCP)ms)" -ForegroundColor $(if ($fcp -le $budgets.FCP) { 'Green' } else { 'Red' })
Write-Host "  TTI:         $([Math]::Round($tti))ms (budget: $($budgets.TTI)ms)" -ForegroundColor $(if ($tti -le $budgets.TTI) { 'Green' } else { 'Red' })
Write-Host "  Performance: $($performance)% (budget: $($budgets.Performance)%)" -ForegroundColor $(if ($performance -ge $budgets.Performance) { 'Green' } else { 'Red' })
Write-Host "  A11y:        $($a11y)% (budget: $($budgets.A11y)%)" -ForegroundColor $(if ($a11y -ge $budgets.A11y) { 'Green' } else { 'Red' })

$failed = (($fcp -gt $budgets.FCP) -or ($tti -gt $budgets.TTI) -or ($performance -lt $budgets.Performance) -or ($a11y -lt $budgets.A11y))

if ($failed) {
  Write-Host ""
  Write-Host "❌ Budget exceeded — ראה דוח-מלא ב-$outFile" -ForegroundColor Red
  exit 1
} else {
  Write-Host ""
  Write-Host "✓ כל ה-budgets עומדים." -ForegroundColor Green
  Remove-Item $outFile  # נקה אם הצליח
  exit 0
}
