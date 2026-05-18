# ============================================================
# חכמוני — PowerShell Launcher
# ============================================================
# מרים שרת-HTTP מקומי על localhost:8080 (או 8081–8085 אם תפוס)
# פותח Chrome ל-http://127.0.0.1:PORT
# רץ עד שChrome נסגר → עוצר את עצמו
# ============================================================
# Patches מהמועצה:
# - Patch #3: bind מפורש ל-127.0.0.1 (לא +/*)
# - Patch #10: port fallback 8080→8085
# - Security: Host-header validation, CSP headers, no-cache
# ============================================================

$ErrorActionPreference = 'Stop'
$ProjectRoot = Split-Path -Parent (Split-Path -Parent $MyInvocation.MyCommand.Path)
Set-Location $ProjectRoot

# ─── Port discovery (8080 → 8085) ───
$Port = $null
foreach ($p in 8080..8085) {
  $test = New-Object System.Net.Sockets.TcpListener('127.0.0.1', $p)
  try {
    $test.Start()
    $test.Stop()
    $Port = $p
    break
  } catch {
    continue
  }
}
if ($null -eq $Port) {
  Write-Error "לא נמצא port פנוי בטווח 8080–8085. סגור תוכנות אחרות ונסה שוב."
  exit 1
}
Write-Host "🦉 חכמוני — מתחיל שרת על http://127.0.0.1:$Port"

# ─── MIME types ───
$mimes = @{
  '.html' = 'text/html; charset=utf-8'
  '.js'   = 'application/javascript; charset=utf-8'
  '.mjs'  = 'application/javascript; charset=utf-8'
  '.css'  = 'text/css; charset=utf-8'
  '.json' = 'application/json; charset=utf-8'
  '.svg'  = 'image/svg+xml'
  '.png'  = 'image/png'
  '.jpg'  = 'image/jpeg'
  '.jpeg' = 'image/jpeg'
  '.webp' = 'image/webp'
  '.ico'  = 'image/x-icon'
  '.mp3'  = 'audio/mpeg'
  '.woff' = 'font/woff'
  '.woff2' = 'font/woff2'
  '.txt'  = 'text/plain; charset=utf-8'
}

# ─── HttpListener ───
$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add("http://127.0.0.1:$Port/")  # ⚠ Patch #3: bind מפורש, לא +/*
$listener.Start()

# ─── Open Chrome ───
Start-Process 'chrome.exe' "http://127.0.0.1:$Port" -ErrorAction SilentlyContinue
if ($LASTEXITCODE -ne 0 -and !$?) {
  # Try Edge as fallback
  Start-Process 'msedge.exe' "http://127.0.0.1:$Port" -ErrorAction SilentlyContinue
}

Write-Host "✓ שרת רץ. הילדים יכולים לשחק. סגור Chrome כדי לעצור."

# ─── Main loop ───
try {
  while ($listener.IsListening) {
    $context = $listener.GetContext()
    $request = $context.Request
    $response = $context.Response

    # ⚠ Patch: Host-header validation
    $host = $request.UserHostName
    if ($host -notmatch '^127\.0\.0\.1') {
      $response.StatusCode = 403
      $response.Close()
      continue
    }

    # Determine file path
    $path = $request.Url.AbsolutePath
    if ($path -eq '/') { $path = '/index.html' }
    $filePath = Join-Path $ProjectRoot $path.TrimStart('/')

    if (Test-Path $filePath -PathType Leaf) {
      $ext = [System.IO.Path]::GetExtension($filePath).ToLower()
      $mime = if ($mimes.ContainsKey($ext)) { $mimes[$ext] } else { 'application/octet-stream' }

      $bytes = [System.IO.File]::ReadAllBytes($filePath)

      # ⚠ Security headers
      $response.ContentType = $mime
      $response.Headers.Add('X-Content-Type-Options', 'nosniff')
      $response.Headers.Add('Cache-Control', 'no-store')
      $response.Headers.Add('Content-Security-Policy', "default-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://fonts.gstatic.com https://apis.google.com; img-src 'self' data: blob:; media-src 'self' blob:;")

      $response.ContentLength64 = $bytes.Length
      $response.OutputStream.Write($bytes, 0, $bytes.Length)
    } else {
      $response.StatusCode = 404
      $msg = [System.Text.Encoding]::UTF8.GetBytes("404 — File not found: $path")
      $response.OutputStream.Write($msg, 0, $msg.Length)
    }

    $response.Close()
  }
} finally {
  $listener.Stop()
  $listener.Close()
  Write-Host "✓ שרת נעצר."
}
