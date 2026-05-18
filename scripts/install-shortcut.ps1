# ============================================================
# חכמוני — Install Desktop Shortcut
# ============================================================
# יוצר קיצור-דרך "חכמוני" על שולחן-העבודה.
# לחיצה כפולה מריצה את start-chachmoni.ps1 ופותחת Chrome.
# ============================================================

$ErrorActionPreference = 'Stop'
$ProjectRoot = Split-Path -Parent (Split-Path -Parent $MyInvocation.MyCommand.Path)

$DesktopPath = [Environment]::GetFolderPath('Desktop')
$ShortcutPath = Join-Path $DesktopPath 'חכמוני.lnk'

$LauncherScript = Join-Path $ProjectRoot 'scripts\start-chachmoni.ps1'
$IconPath = Join-Path $ProjectRoot 'assets\icons\favicon.ico'

# Create WScript.Shell COM object to make .lnk
$WScriptShell = New-Object -ComObject WScript.Shell
$Shortcut = $WScriptShell.CreateShortcut($ShortcutPath)
$Shortcut.TargetPath = "powershell.exe"
$Shortcut.Arguments = "-NoProfile -ExecutionPolicy Bypass -WindowStyle Hidden -File `"$LauncherScript`""
$Shortcut.WorkingDirectory = $ProjectRoot
$Shortcut.WindowStyle = 7  # Minimized
$Shortcut.Description = "חכמוני — משחק לימוד מחשב לילדים"

if (Test-Path $IconPath) {
  $Shortcut.IconLocation = $IconPath
} else {
  Write-Warning "Icon not found at $IconPath. שימוש בברירת-המחדל. הוסף favicon.ico ב-assets/icons/ אחר-כך."
}

$Shortcut.Save()

# ⚠ Mark as RunAs Hidden (prevents PowerShell window flash)
$bytes = [System.IO.File]::ReadAllBytes($ShortcutPath)
$bytes[0x15] = $bytes[0x15] -bor 0x20  # Set Hidden bit
[System.IO.File]::WriteAllBytes($ShortcutPath, $bytes)

Write-Host "✓ קיצור-דרך נוצר על שולחן-העבודה: $ShortcutPath"
Write-Host ""
Write-Host "הוראות לילדים:"
Write-Host "  לחיצה כפולה על 'חכמוני' → המשחק נפתח ב-Chrome."
