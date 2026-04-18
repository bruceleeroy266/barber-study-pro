@echo off
echo ==========================================
echo   The Great Ark - Minecraft Server
echo ==========================================
echo.
echo Looking for bedrock_server.exe...
echo.

if not exist "bedrock_server.exe" (
    echo ERROR: bedrock_server.exe not found!
    echo.
    echo Please download the Minecraft server from:
    echo https://www.minecraft.net/en-us/download/server/bedrock
    echo.
    echo Instructions:
    echo 1. Go to the website above
    echo 2. Click Download for Windows
    echo 3. Extract the zip file HERE in this folder
    echo 4. Then run this START file again
    echo.
    pause
    exit
)

echo Found server! Starting...
echo.
echo Press Ctrl+C to stop the server
echo.

bedrock_server.exe

pause
