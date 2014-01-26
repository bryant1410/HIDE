#!/bin/bash
cd "`dirname "$0"`"
rm  ./dist/HIDE-win.zip
zip -r ./dist/HIDE-win.zip ./ -x /runtime/linux-32/* -x /runtime/linux-64/* -x /zip-* -x /linux.run -x /dist/* -x /.git/*
