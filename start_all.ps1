# PowerShell script to start both Backend and Frontend
Write-Host "=======================================================================" -ForegroundColor Cyan
Write-Host "         PLANAI - MULTI-AGENT TRAVEL PLANNER (FASTAPI + REACT)" -ForegroundColor Cyan
Write-Host "=======================================================================" -ForegroundColor Cyan
Write-Host ""

$baseDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$pythonExe = Join-Path $baseDir "venv\Scripts\python.exe"

Write-Host "[1/2] Starting FastAPI Backend (main:app) on http://localhost:8000..." -ForegroundColor Green
Start-Process powershell -ArgumentList "-NoExit", "-Command", "Set-Location '$baseDir\multi-agent-travel_planner'; & '$pythonExe' -m uvicorn main:app --reload --port 8000"

Write-Host "[2/2] Starting Vite Frontend on http://localhost:5173..." -ForegroundColor Green
Start-Process powershell -ArgumentList "-NoExit", "-Command", "Set-Location '$baseDir\frontend'; npm run dev"

Write-Host ""
Write-Host "All services initialized! Open your browser at http://localhost:5173" -ForegroundColor Yellow
