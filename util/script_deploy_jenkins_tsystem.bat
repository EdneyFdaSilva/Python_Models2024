:: Setting utils variables
SET WORKSPACE="C:\IRIS-OFFICIAL\hp_exceler_web\"
SET outputFolder="C:\Deploy_Exceler"
SET outputFolderBackend="C:\Deploy_Exceler\backend"
SET appName="exceler8"
SET poolName="E8_API"
SET computerName="https://10.100.0.7:8172/msdeploy.axd?site=exceler8"
SET userName="RFIDHP\jcarvalho-fit"
SET password="HP@tsystems2024"
SET pathMSDeploy="C:\Program Files (x86)\IIS\Microsoft Web Deploy V3\msdeploy.exe"

:: Cleaning previous build
rmdir /s /q %outputFolder%
mkdir %outputFolder%
mkdir %outputFolderBackend%

:: Forcing workspace folder
pushd %WORKSPACE%

:: Build frontend deploy files
pushd frontend
call npm i --save-dev
call node --max_old_space_size=8192 ./node_modules/@angular/cli/bin/ng build --prod

:: Copy frontend deploy files
xcopy /s dist\exceler-frontend %outputFolder%

:: Build backend deploy files
pushd %WORKSPACE%
pushd backend
dotnet publish Exceler8_API -o %outputFolderBackend%

:: Copy web.config
pushd %WORKSPACE%
xcopy /s uteis\web.config %outputFolder%

pause;
:: Publishing new deploy to IIS
call %pathMSDeploy% -verb:sync -source:recycleApp -dest:recycleApp=%poolName%,recycleMode="StopAppPool",computerName=%computerName%,authType='basic',username=%userName%,password=%password% -enableRule:AppOffline -allowUntrusted
call %pathMSDeploy% -verb:sync -source:IisApp=%outputFolder% -dest:iisapp=%appName%,computerName=%computerName%,authType='basic',username=%userName%,password=%password%  -enableRule:AppOffline -allowUntrusted
call %pathMSDeploy% -verb:sync -source:recycleApp -dest:recycleApp=%poolName%,recycleMode="StartAppPool",computerName=%computerName%,authType='basic',username=%userName%,password=%password%  -enableRule:AppOffline -allowUntrusted
pause;