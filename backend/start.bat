@echo off
title FastAPI Deepfake Detection Backend
cd /d "%~dp0"
echo Activating virtual environment...
call venv\Scripts\activate
echo Initializing database and removing legacy demo accounts...
python seed.py
echo Starting FastAPI server at http://127.0.0.1:8000 ...
python run.py
pause
