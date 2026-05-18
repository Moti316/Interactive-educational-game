# ============================================================
# חכמוני — Color Contrast Checker (WCAG AA)
# ============================================================
# בודק את הניגודיות של כל הזוגות-המוגדרים-ב-tokens.css
# נכשל ב-exit-code != 0 אם זוג נופל מ-4.5:1 (טקסט רגיל).
# ============================================================

$ErrorActionPreference = 'Stop'
$ProjectRoot = Split-Path -Parent (Split-Path -Parent $MyInvocation.MyCommand.Path)
$TokensFile = Join-Path $ProjectRoot 'design-mocks\shared\tokens.css'

if (-not (Test-Path $TokensFile)) {
  Write-Error "tokens.css not found at $TokensFile"
  exit 1
}

# ─── Parse colors from tokens.css ───
$content = Get-Content $TokensFile -Raw
$colors = @{}
$regex = [regex] '--color-([\w-]+):\s*(#[0-9a-fA-F]{6})'
foreach ($match in $regex.Matches($content)) {
  $name = $match.Groups[1].Value
  $hex = $match.Groups[2].Value
  $colors[$name] = $hex
}

Write-Host "Found $($colors.Count) colors in tokens.css:"
$colors.GetEnumerator() | ForEach-Object { Write-Host "  $($_.Key): $($_.Value)" }
Write-Host ""

# ─── Contrast calculation (WCAG formula) ───
function Get-Luminance($hex) {
  $r = [Convert]::ToInt32($hex.Substring(1,2), 16) / 255.0
  $g = [Convert]::ToInt32($hex.Substring(3,2), 16) / 255.0
  $b = [Convert]::ToInt32($hex.Substring(5,2), 16) / 255.0

  $r = if ($r -le 0.03928) { $r / 12.92 } else { [Math]::Pow(($r + 0.055) / 1.055, 2.4) }
  $g = if ($g -le 0.03928) { $g / 12.92 } else { [Math]::Pow(($g + 0.055) / 1.055, 2.4) }
  $b = if ($b -le 0.03928) { $b / 12.92 } else { [Math]::Pow(($b + 0.055) / 1.055, 2.4) }

  return 0.2126 * $r + 0.7152 * $g + 0.0722 * $b
}

function Get-Contrast($hex1, $hex2) {
  $l1 = Get-Luminance $hex1
  $l2 = Get-Luminance $hex2
  $lighter = [Math]::Max($l1, $l2)
  $darker = [Math]::Min($l1, $l2)
  return ($lighter + 0.05) / ($darker + 0.05)
}

# ─── Critical pairs to check ───
$pairs = @(
  @{ Name = 'text on cream (body)'; FG = $colors['text']; BG = $colors['cream']; MinRatio = 4.5 }
  @{ Name = 'text on sky (header)'; FG = $colors['text']; BG = $colors['sky']; MinRatio = 4.5 }
  @{ Name = 'text on sun (Primary CTA)'; FG = $colors['text']; BG = $colors['sun']; MinRatio = 4.5 }
  @{ Name = 'text on mint'; FG = $colors['text']; BG = $colors['mint']; MinRatio = 4.5 }
  @{ Name = 'text on lavender'; FG = $colors['text']; BG = $colors['lavender']; MinRatio = 4.5 }
  @{ Name = 'coral-dark on cream (Secondary CTA)'; FG = $colors['coral-dark']; BG = $colors['cream']; MinRatio = 4.5 }
  @{ Name = 'cream on coral (anti-pattern, expected to fail)'; FG = $colors['cream']; BG = $colors['coral']; MinRatio = 4.5 }
)

$failures = 0
foreach ($p in $pairs) {
  $ratio = Get-Contrast $p.FG $p.BG
  $status = if ($ratio -ge $p.MinRatio) { '✓ PASS' } else { '✗ FAIL' }
  $color = if ($ratio -ge $p.MinRatio) { 'Green' } else { 'Red' }
  Write-Host ("{0,-50} {1,6:F2}:1 {2}" -f $p.Name, $ratio, $status) -ForegroundColor $color
  if ($ratio -lt $p.MinRatio -and -not $p.Name.Contains('anti-pattern')) {
    $failures++
  }
}

Write-Host ""
if ($failures -gt 0) {
  Write-Host "❌ $failures pairs failed WCAG AA. תקן tokens.css." -ForegroundColor Red
  exit 1
} else {
  Write-Host "✓ כל הזוגות עוברים WCAG AA." -ForegroundColor Green
  exit 0
}
