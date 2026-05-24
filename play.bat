@echo off
REM ============================================================
REM  Chachmoni — one-click launcher
REM  Double-click this file to start the local server + Chrome.
REM ============================================================
cd /d "%~dp0"
powershell -ExecutionPolicy Bypass -File "scripts\start-chachmoni.ps1"
pause
