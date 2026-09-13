@echo off
cd /d "%~dp0"
where py >nul 2>nul
if not errorlevel 1 (
  py -3 servidor.py
) else (
  where python >nul 2>nul
  if not errorlevel 1 (
    python servidor.py
  ) else (
    echo No se encuentra Python. Se abrira la version directa.
    start "" "%~dp0index.html"
  )
)
pause
