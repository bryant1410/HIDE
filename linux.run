#!/bin/bash
cd "`dirname "$0"`"
ARCH=`uname -m`

	if [ "$ARCH" == "x86_64" ]; then
		LD_LIBRARY_PATH="./runtime/linux-64/library:${LD_LIBRARY_PATH}" ./runtime/linux-64/nw ./bin $@
	else
		LD_LIBRARY_PATH="./runtime/linux-32/library:${LD_LIBRARY_PATH}" ./runtime/linux-32/nw ./bin $@
	fi


