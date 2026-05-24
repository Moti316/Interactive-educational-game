# ============================================================
#  Chachmoni - PowerShell Launcher
# ============================================================
#  Starts a local HTTP server on 127.0.0.1:8080 (or 8081-8085).
#  Opens Chrome to http://127.0.0.1:PORT.
#  Runs until you close the PowerShell window or press Ctrl+C.
# ============================================================
#  Council patches:
#   - Patch #3: explicit 127.0.0.1 bind (not + or *)
#   - Patch #10: port fallback 8080 -> 8085
#   - Security: Host-header validation, CSP headers, no-cache
# ============================================================

$ErrorActionPreference = 'Stop'
$ProjectRoot = Split-Path -Parent (Split-Path -Parent $MyInvocation.MyCommand.Path)
Set-Location $ProjectRoot

# --- Port discovery (8080 -> 8085) ---
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
    Write-Error "No free port found in 8080-8085. Close other programs and try again."
    exit 1
}
Write-Host "Chachmoni - serving on http://127.0.0.1:$Port"

# --- MIME types ---
$mimes = @{
    '.html'  = 'text/html; charset=utf-8'
    '.js'    = 'application/javascript; charset=utf-8'
    '.mjs'   = 'application/javascript; charset=utf-8'
    '.css'   = 'text/css; charset=utf-8'
    '.json'  = 'application/json; charset=utf-8'
    '.svg'   = 'image/svg+xml'
    '.png'   = 'image/png'
    '.jpg'   = 'image/jpeg'
    '.jpeg'  = 'image/jpeg'
    '.webp'  = 'image/webp'
    '.ico'   = 'image/x-icon'
    '.mp3'   = 'audio/mpeg'
    '.woff'  = 'font/woff'
    '.woff2' = 'font/woff2'
    '.txt'   = 'text/plain; charset=utf-8'
}

# --- HttpListener ---
$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add("http://127.0.0.1:$Port/")
$listener.Start()

# --- Open Chrome (fall back to Edge, otherwise print URL) ---
$browserOpened = $false
try {
    Start-Process 'chrome.exe' "http://127.0.0.1:$Port" -ErrorAction Stop
    $browserOpened = $true
} catch {
    try {
        Start-Process 'msedge.exe' "http://127.0.0.1:$Port" -ErrorAction Stop
        $browserOpened = $true
    } catch {
        Write-Host "Could not auto-open a browser. Open this URL manually:"
        Write-Host "  http://127.0.0.1:$Port"
    }
}

Write-Host "Server running. Close Chrome (or press Ctrl+C) to stop."

# --- Main request loop ---
$cspValue = "default-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://fonts.gstatic.com https://apis.google.com; img-src 'self' data: blob:; media-src 'self' blob:;"
try {
    while ($listener.IsListening) {
        $context = $listener.GetContext()
        $request = $context.Request
        $response = $context.Response

        # Host-header validation (renamed from $host to avoid clashing with the
        # read-only $host automatic variable in PowerShell)
        $reqHost = $request.UserHostName
        if ($reqHost -notmatch '^127\.0\.0\.1') {
            $response.StatusCode = 403
            $response.Close()
            continue
        }

        # Map URL to file
        $path = $request.Url.AbsolutePath
        if ($path -eq '/') { $path = '/index.html' }
        $filePath = Join-Path $ProjectRoot $path.TrimStart('/')

        if (Test-Path $filePath -PathType Leaf) {
            $ext = [System.IO.Path]::GetExtension($filePath).ToLower()
            $mime = if ($mimes.ContainsKey($ext)) { $mimes[$ext] } else { 'application/octet-stream' }

            $bytes = [System.IO.File]::ReadAllBytes($filePath)

            $response.ContentType = $mime
            $response.Headers.Add('X-Content-Type-Options', 'nosniff')
            $response.Headers.Add('Cache-Control', 'no-store')
            $response.Headers.Add('Content-Security-Policy', $cspValue)

            $response.ContentLength64 = $bytes.Length
            $response.OutputStream.Write($bytes, 0, $bytes.Length)
        } else {
            $response.StatusCode = 404
            $msg = [System.Text.Encoding]::UTF8.GetBytes("404 - File not found: $path")
            $response.OutputStream.Write($msg, 0, $msg.Length)
        }

        $response.Close()
    }
} finally {
    $listener.Stop()
    $listener.Close()
    Write-Host "Server stopped."
}
