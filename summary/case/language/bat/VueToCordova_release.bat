@echo off
set "vueAddress=D:\Vue\ydgw"
set "appName=ydgw"
set "keystore=ydgw.release.keystore"
set "alias=ydgw"
set "storePassword=wonderscd"
set "password=wonderscd"
set "printAddress=C:\Users\wdgw\Desktop"
set "VueBuild=D: && cd D:\publish && call VueBuild.bat %vueAddress% && D: && cd D:\publish"
set "moveVue=call clearFiles.bat D:\cordova\%appName%\www && call copy.bat %vueAddress%\dist D:\cordova\%appName%\www"
set "cordovaBuild=call cordovaBuild_release.bat %appName%  %keystore% %alias% %storePassword% %password% && D: && cd D:\publish"
set "moveApk=call copy.bat %appName% true release"
set "exe=%VueBuild% && %moveVue% && %cordovaBuild% && %moveApk%" 
%exe%