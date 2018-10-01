D:
cd cordova
set "create=cordova create ydgw com.wonderscd.mobile.ydgw ÒÆ¶¯¹«ÎÀ && cd ydgw"
set "platform=cordova platform add android"
set "plugin=cordova plugin add cordova-plugin-splashscreen && cordova plugin add cordova-plugin-backbutton && cordova plugin add cordova-plugin-statusbar && cordova plugin add cordova-plugin-file cordova-plugin-file-transfer cordova-plugin-file-opener2 && cordova plugin add phonegap-plugin-barcodescanner && cordova plugin add cordova-plugin-screen-orientation && cordova plugin add cordova-plugin-camera && cordova plugin add cordova-plugin-app-version && cordova plugin add cordova-android-support-gradle-release"
set "show=cordova platform ls && cordova plugin ls"
set "exe=%create% && %platform% && %plugin% && %show%" 
%exe%