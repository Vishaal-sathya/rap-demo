@echo off
REM Start React frontend
start cmd /k "cd frontend && npm start"

REM Start Flask backend
start cmd /k "cd train_search_backend && call venv\Scripts\activate && python run.py"

REM Optional: pause to keep this window open if you run directly
REM pause
