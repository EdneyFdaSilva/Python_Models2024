:: Setting utils variables
SET WORKSPACE="C:\Projetos\hp_exceler_web\"
SET outputFolder="C:\Deploy_Exceler"
SET outputFolderBackend="C:\Deploy_Exceler\backend"
SET appName="exceler8homolog"
SET poolName="exceler8homolog"
SET computerName="https://187.86.215.40:8172/msdeploy.axd?site=exceler8homolog"
SET userName="RFIDHP\EGONCALVES-FIT"
SET password="Fit@2020"
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

:: Publishing new deploy to IIS
call %pathMSDeploy% -verb:sync -source:recycleApp -dest:recycleApp=%poolName%,recycleMode="StopAppPool",computerName=%computerName%,authType='basic',username=%userName%,password=%password% -enableRule:AppOffline -allowUntrusted
call %pathMSDeploy% -verb:sync -source:IisApp=%outputFolder% -dest:iisapp=%appName%,computerName=%computerName%,authType='basic',username=%userName%,password=%password%  -enableRule:AppOffline -allowUntrusted
call %pathMSDeploy% -verb:sync -source:recycleApp -dest:recycleApp=%poolName%,recycleMode="StartAppPool",computerName=%computerName%,authType='basic',username=%userName%,password=%password%  -enableRule:AppOffline -allowUntrusted