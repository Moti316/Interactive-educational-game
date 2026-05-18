# ============================================================
# חכמוני — Install Hourly Git Sync (Task Scheduler)
# ============================================================
# יוצר Windows Scheduled Task שמריץ git-sync.ps1 כל שעה.
# מבטיח שינויים-מקוד מסונכרנים אוטומטית בין מחשבי-פיתוח.
# ============================================================

$ErrorActionPreference = 'Stop'
$ProjectRoot = Split-Path -Parent (Split-Path -Parent $MyInvocation.MyCommand.Path)
$SyncScript = Join-Path $ProjectRoot 'scripts\git-sync.ps1'

$TaskName = 'ChachmoniGitSync'

# Remove existing task if present
if (Get-ScheduledTask -TaskName $TaskName -ErrorAction SilentlyContinue) {
  Write-Host "Removing existing task..."
  Unregister-ScheduledTask -TaskName $TaskName -Confirm:$false
}

# Create action
$action = New-ScheduledTaskAction `
  -Execute 'powershell.exe' `
  -Argument "-NoProfile -ExecutionPolicy Bypass -WindowStyle Hidden -File `"$SyncScript`""

# Create trigger — every hour starting now
$trigger = New-ScheduledTaskTrigger `
  -Once -At (Get-Date) `
  -RepetitionInterval (New-TimeSpan -Hours 1)

# Settings
$settings = New-ScheduledTaskSettingsSet `
  -AllowStartIfOnBatteries `
  -DontStopIfGoingOnBatteries `
  -StartWhenAvailable `
  -RunOnlyIfNetworkAvailable

# Register
Register-ScheduledTask `
  -TaskName $TaskName `
  -Action $action `
  -Trigger $trigger `
  -Settings $settings `
  -Description 'Hourly bidirectional git sync for Chachmoni project' `
  -Force | Out-Null

Write-Host "✓ Task '$TaskName' registered. רץ כל שעה."
Write-Host ""
Write-Host "כדי לבטל: scripts/uninstall-task-scheduler.ps1"
Write-Host "כדי לראות: Get-ScheduledTask -TaskName '$TaskName'"
