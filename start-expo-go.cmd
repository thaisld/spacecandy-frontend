@echo off
cd /d "%~dp0"
set "EXPO_HOME=%CD%\.expo-home"
set "npm_config_cache=%CD%\..\.npm-cache"
node.exe node_modules\expo\bin\cli start --go --lan --port 8081
