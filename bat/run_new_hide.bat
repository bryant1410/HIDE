@echo off
iF [%1]==[]  (
	SET BIN_PATH=..\bin\
) ELSE (	
	SET BIN_PATH=%~1
)
cd /d %BIN_PATH%
haxelib run node-webkit "