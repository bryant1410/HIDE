hide
====

Haxe Integrated Development Environment (HIDE) is written in Haxe and Javascript.

Thanks to a group of [crowd funders at IndieGoGo](http://www.indiegogo.com/projects/cactus-ide/), HIDE is open source, licensed under the terms of the MIT License.

Google Plus:
[Haxe Integrated Development Environment](https://plus.google.com/113245482496557815887)



Google Group:
[HIDE Google Group](https://groups.google.com/forum/#!forum/haxeide)

There, you can discuss anything related to HIDE; including features requests, bugs, or just give feedback about HIDE.

Please note that HIDE is in active development. HIDE is currently not ready for use. 
This information is for curious people and contributors.

1. Before doing something it's better to start a discussion at [HIDE Google Group](https://groups.google.com/forum/#!forum/haxeide) or create an issue on [GitHub](https://github.com/misterpah/hide/issues?state=open).
2. If you have questions about how it works, or wonder where to find for something, you can ask your questions in the HIDE Google Group. We will try to answer them as soon as possible.

###How to run:

1. Download node-webkit binary from https://github.com/rogerwang/node-webkit
2. Extract the contents of the archive to the bin/ folder of HIDE, so it looks like this: 
![Alt text](http://s13.postimg.org/9l0qcxo87/screenshot_204.png)
3. Run nw.exe

We will provide easier ways to run and distribute HIDE when it is ready for use.

###How to compile:
1. You will need Haxe 3. Make sure you have installed the jQueryExtern and hxparse(currently not used) haxelibs:

        haxelib install jQueryExtern
        haxelib install hxparse

2. If you are on Windows, open HaxeEditor2.hxproj using FlashDevelop. If you are on Linux or Mac, you should be able to compile HIDE using this command:

        haxe HaxeEditor2.hxml
    
3. On Windows, you can start HIDE using run.bat, if you provide the path to node-webkit.
On Linux, you can run it like this:

        nw /path/to/hide/bin
    
Mac users can run it using the instructions on the node-webkit page:
https://github.com/rogerwang/node-webkit/wiki/How-to-run-apps

The main thing you need to know is that you need to run nw with the path/to/hide/bin folder argument.

###How to contribute:
1  Make sure you have a [GitHub Account](https://github.com/signup/free)
2. Fork [HIDE](https://github.com/misterpah/hide)
  ([how to fork a repo](https://help.github.com/articles/fork-a-repo))
3. Make your changes
4. Submit a pull request
([how to create a pull request](https://help.github.com/articles/fork-a-repo))

Contributions are welcome.

###Getting help

Community discussion, questions, and informal bug reporting is done on the
[HIDE Google group](https://groups.google.com/group/haxeide).
	
## Submitting bug reports

The preferred way to report bugs is to use the
[GitHub issue tracker](https://github.com/misterpah/hide/issues).

Questions should be asked on the
[HIDE Google group](http://groups.google.com/group/haxeide).

###Current TODOs:
1. New Project Dialog(should be implemented using Bootstrap 3, similar to Cactus IDE)
2. Project Management
3. Code completion(Haxe completion + hxparse)

###License:
HIDE is licensed under the terms of the MIT License.
CodeMirror, Tern and Acorn are licensed under the terms of the MIT License.
JQuery and JQuery UI are licensed under the terms of the MIT License.
JQuery xml2json is licensed under the terms of the MIT License.
JQuery Layout plugin is dual-licensed under the GPL and MIT licenses.
Bootstrap is licensed under the terms of the Apache License Version 2.0

jQueryExtern is released in the public domain.
hxparse is licensed under the terms of the BSD License.
