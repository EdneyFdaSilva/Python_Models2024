:: Setting utils variables
SET WORKSPACE="C:\IRIS-OFFICIAL\hp_exceler_web\"
SET outputFolder="C:\Deploy_Exceler"
SET outputFolderBackend="C:\Deploy_Exceler\backend"
SET appName="e8Prod"
SET poolName="e8Prod"
SET computerName="https://saont284:8172/msdeploy.axd?site=e8Prod"
SET userName="AMERICAS\sao_execeler8"
SET password="37dI1&-g"
SET pathMSDeploy="C:\Program Files (x86)\IIS\Microsoft Web Deploy V3\msdeploy.exe"
SET NODE_OPTIONS=--max_old_space_size=8192

:: Cleaning previous build
rmdir /s /q %outputFolder%
mkdir %outputFolder%
mkdir %outputFolderBackend%

:: Forcing workspace folder
pushd %WORKSPACE%

:: Build frontend deploy files
pushd frontend
call npm i --save-dev
call npx ng build --prod

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