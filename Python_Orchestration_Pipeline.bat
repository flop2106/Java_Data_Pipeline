@echo off

REM Check Java version
java -version > temp.txt 2>&1
findstr /i "21.0.5" temp.txt >nul
IF %ERRORLEVEL% NEQ 0 (
    echo Please install Java version 21.0.5 or later.
    pause
    exit /b 1
)
del temp.txt
REM Start React Frontend
start "React" cmd /k "cd /d frontend-react/ml-pipeline-frontend && npm start"

REM Start SpringBoot Backend
start "SpringBoot" cmd /k " cd /d java-datapipeline-platform && mvn spring-boot:run" 