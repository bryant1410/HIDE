hide
====

Haxe Integrated Development Environment (HIDE) are written using Haxe and Javascript.

Thanks to group of [crowd funders at IndieGoGo](http://www.indiegogo.com/projects/cactus-ide/), HIDE is open source, licensed under terms of MIT License.

Google Group:
[HIDE Google Group](https://groups.google.com/forum/#!forum/haxeide)

You can discuss almost anything related to HIDE. Including new features, features requests and just give feedback about HIDE.

Please note, that HIDE currently is in active development. HIDE currently is not ready for use. 
this information is for curious people and contributors.

###How to run:

1. Download node-webkit binary from https://github.com/rogerwang/node-webkit
2. Extract contents of archive to bin/ folder of HIDE, so it should look like this: 
![Alt text](http://s13.postimg.org/9l0qcxo87/screenshot_204.png)
3. Run nw.exe

We will provide easier ways to run and distribute HIDE, when it will be ready for use.

###How to compile:
1. You will need Haxe 3 and make sure you have installed jQueryExtern and hxparse(currently not used yet) haxelibs:

    haxelib install jQueryExtern
    haxelib install hxparse

2. If you are on Windows, open HaxeEditor2.hxproj using FlashDevelop, if you are on Linux or Mac, you should be able to compile HIDE using this command:

    haxe HaxeEditor2.hxml
    
3. On Windows, you can start HIDE using run.bat, if you will provide path to node-webkit.
On Linux, you can run it like this:

    nw /path/to/hide/bin
    
Mac users can run it using instructions on node-webkit page:
https://github.com/rogerwang/node-webkit/wiki/How-to-run-apps

Main thing you need to know is, you need to run nw with path/to/hide/bin folder argument.

###How to contribute:
1. Before doing something it's better to start discussion at [HIDE Google Group](https://groups.google.com/forum/#!forum/haxeide) or create issue here
2. If you have questions about how it works, and wonder where to look for something, you can write your questions in HIDE Google Group. We will try to answer them as soon as we have time.

Contributions are welcome.

###Current TODOs:
1. New Project Dialog(should be implemented using Bootstrap 3, similar to Cactus IDE

###License:
HIDE is licensed under terms of MIT License. CodeMirror and Tern are licensed under terms of MIT License.
