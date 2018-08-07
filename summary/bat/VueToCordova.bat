@echo off
set "vueAddress=D:\WDPHIS\trunk\his\Ô´´úÂë\jshtml\APP\ydgw"
set "appName=ydgw"
set "printAddress=C:\Users\wdgw\Desktop"
set "VueBuild=D: && cd D:\publish && call VueBuild.bat %vueAddress% && D: && cd D:\publish"
set "moveVue=call clearFiles.bat D:\cordova\%appName%\www && call copy.bat %vueAddress%\dist D:\cordova\%appName%\www"
set "cordovaBuild=call cordovaBuild.bat %appName% && D: && cd D:\publish"
set "moveApk=call copy.bat %appName% true true"
set "exe=%VueBuild% && %moveVue% && %cordovaBuild% && %moveApk%" 
%exe%