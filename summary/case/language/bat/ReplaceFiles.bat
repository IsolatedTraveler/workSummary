@echo off
set /p url=�������ļ�����·��:
set /p strOld=������Ҫ�滻���ı�:
set /p strNew=�������滻����ı�:
cd %url%
SETLOCAL EnableDelayedExpansion
for /F "tokens=1,4 delims=" %%a IN ('dir *.* /B') DO (
	set "name=%%a"
	set "name=!name:%strOld%=%strNew%!"
	echo !name!
	ren "%%a" "!name!"
)
pause