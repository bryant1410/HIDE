#!/bin/bash
cd "`dirname "$0"`"
rm  ./dist/HIDE-linux64.tar.gz
#zip -r ./dist/linux64.zip ./ -x /runtime/windows/* -x /runtime/linux-32/* -x /zip-* -x /windows.bat -x /dist/*
tar -zcvf ./dist/HIDE-linux64.tar.gz ./ --exclude=./runtime/windows --exclude=./dist --exclude=./runtime/linux-32 --exclude=./zip-* --exclude=./windows.bat
