@echo off
SETLOCAL

:: Set the folder where this .bat file resides as the root directory.
set "ROOT_DIR=%~dp0"

:: Folder containing the ZIP files
set "TOOLS_DIR=%ROOT_DIR%tools"

:: Temporary extraction folder
set "TEMP_TOOLS_DIR=%ROOT_DIR%temp_tools"

:: Create the temporary folder if it doesn't exist
if not exist "%TEMP_TOOLS_DIR%" mkdir "%TEMP_TOOLS_DIR%"

REM --- Extract OpenJDK ---
if not exist "%TEMP_TOOLS_DIR%\openjdk" (
    echo Extracting OpenJDK 21...
    powershell -Command "Expand-Archive -Path '%TOOLS_DIR%\openjdk-21+35_windows-x64_bin.zip' -DestinationPath '%TEMP_TOOLS_DIR%'"
    REM Rename the extracted folder which may be named something like 'jdk-21'
    ren "%TEMP_TOOLS_DIR%\jdk-21" "openjdk"
)

REM --- Extract Maven ---
if not exist "%TEMP_TOOLS_DIR%\maven" (
    echo Extracting Maven 3.9.9...
    powershell -Command "Expand-Archive -Path '%TOOLS_DIR%\apache-maven-3.9.9-bin.zip' -DestinationPath '%TEMP_TOOLS_DIR%'"
    ren "%TEMP_TOOLS_DIR%\apache-maven-3.9.9" "maven"
)

REM --- Extract Node.js ---
if not exist "%TEMP_TOOLS_DIR%\node" (
    echo Extracting Node.js 22.14.0...
    powershell -Command "Expand-Archive -Path '%TOOLS_DIR%\node-v22.14.0-win-x64.zip' -DestinationPath '%TEMP_TOOLS_DIR%'"
    ren "%TEMP_TOOLS_DIR%\node-v22.14.0-win-x64" "node"
)

REM --- Set Environment Variables ---
set "JAVA_HOME=%TEMP_TOOLS_DIR%\openjdk"
set "MAVEN_HOME=%TEMP_TOOLS_DIR%\maven"
set "NODE_HOME=%TEMP_TOOLS_DIR%\node"
set "PATH=%JAVA_HOME%\bin;%MAVEN_HOME%\bin;%NODE_HOME%;%PATH%"

REM Verify JAVA_HOME is set correctly by checking for java.exe
if not exist "%JAVA_HOME%\bin\java.exe" (
    echo ERROR: JAVA_HOME is not defined correctly.
    echo Expected java.exe at: "%JAVA_HOME%\bin\java.exe"
    pause
    exit /b 1
)

echo Java version:
java -version
echo.
echo Node version:
node -v
echo.

REM --- Start the Frontend and Backend ---
echo Starting Frontend (React)...
start "Frontend" cmd /k "cd /d frontend-react/ml-pipeline-frontend && npm install --force && npm start"

echo Starting Backend (Spring Boot)...
start "Backend" cmd /k "cd /d java-datapipeline-platform && mvn spring-boot:run"

echo.
echo Environment setup complete. Press any key to exit.
pause
