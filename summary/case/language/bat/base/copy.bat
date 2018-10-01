echo copy
pause
set "oldAddress=%1"
set "newAddress=%2"
if "%3" == "true" (
	set "oldAddress=D:\cordova\%1\platforms\android\app\build\outputs\apk\debug\app-debug.apk"
)
if "%2" == "true" (
	set "newAddress=C:\Users\wdgw\Desktop"
)
xcopy %oldAddress% %newAddress% /y /s