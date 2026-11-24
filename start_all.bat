@echo off
title PlanAI Multi-Agent Travel Planner Launcher
echo =======================================================================
echo          PLANAI - MULTI-AGENT TRAVEL PLANNER (FASTAPI + REACT)
echo =======================================================================
echo.
echo [1/2] Launching FastAPI Backend on http://localhost:8000...
start "FastAPI Backend (main:app)" cmd /k "cd multi-agent-travel_planner && ..\venv\Scripts\python.exe -m uvicorn main:app --reload --port 8000"

echo [2/2] Launching Vite Frontend on http://localhost:5173...
start "Vite React Frontend" cmd /k "cd frontend && npm run dev"

echo.
echo =======================================================================
echo  Services Running:
echo   - Web UI: http://localhost:5173
echo   - Backend Swagger API: http://localhost:8000/docs
echo   - Health Check: http://localhost:8000/api/health
echo =======================================================================
pause
