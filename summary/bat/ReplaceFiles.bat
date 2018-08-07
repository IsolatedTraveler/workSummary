@echo off
set /p url=请输入文件所在路径:
set /p strOld=请输入要替换的文本:
set /p strNew=请输入替换后的文本:
cd %url%
SETLOCAL EnableDelayedExpansion
for /F "tokens=1,4 delims=" %%a IN ('dir *.* /B') DO (
	set "name=%%a"
	set "name=!name:%strOld%=%strNew%!"
	echo !name!
	ren "%%a" "!name!"
)
pause