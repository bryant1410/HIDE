HIDE
====

HIDE - cross platform IDE for Haxe programming language

Thanks to a group of [crowd funders at IndieGoGo](http://www.indiegogo.com/projects/cactus-ide/), HIDE is open source, licensed under the terms of the MIT License.

###History
Project was actively developed for almost a year by @as3boyan. (Summer 2013 - Summer 2014).
It's pretty huge project, and there is not much IDEs made purely on web technologies.
@misterpah gave this project great starting boost with making starting menu and choosing Bootstrap framework as main framework for GUI. After that it was maintained mostly by @as3boyan. @misterpah decided to develop it's own IDE for Haxe, named Haxe Studio.

@NickHolder did amazing job on outline panel(types, scope of functions and variables, sorting).

###Architechture controversy
At start @as3boyan and @misterpah worked on one branch(master).
@as3boyan and @misterpah argued a lot on plugin system implementation(which was requirement from Haxe Foundation).
@as3boyan and @misterpah implemented their own plugin systems.
Then @as3boyan decided to integrate everything into the core. @misterpah didn't agreed with this decision.
Anyway, they both worked on different branches.

>Most IDEs integrate basic functionality to the core, for performance and stability reasons. And having lots of plugins, makes it harder to manage dependencies.


###Project funding
$2,740USD(including 7% fees) were equally split between two developers: @as3boyan and @misterpah.

Google Plus:
[HIDE Google Plus page](https://plus.google.com/113245482496557815887)

Google Group:
[HIDE Google Group](https://groups.google.com/forum/#!forum/haxeide)

There, you can discuss anything related to HIDE; including features requests, bugs, or just give feedback about HIDE.

###How to run:

``` haxe
haxelib install HIDE
haxelib run HIDE
```

##### Alternative way

1. Download node-webkit binary from https://github.com/rogerwang/node-webkit
2. Extract the contents of the archive to the bin/ folder of HIDE, so it looks like this: 
![Alt text](http://s13.postimg.org/9l0qcxo87/screenshot_204.png)
3. Run nw

##### Development version

```bash
haxelib git HIDE https://github.com/as3boyan/HIDE/ master bin
haxelib install node-webkit
haxelib run HIDE
```

##### How to build:

1. Run following commands:

```bash
#Clone source using git
git clone --recursive https://github.com/HaxeIDE/HIDE.git

#Haxe 3 is required. Install haxelibs
haxelib install jQueryExtern
haxelib install tjson
haxelib install node-webkit

#Navigate to the root directory
cd HIDE

#Compile HIDE
haxe HIDE.hxml

#Navigate to HIDE/bin directory
cd bin

#Run node-webkit
haxelib run node-webkit
```

2. In HIDE select __File__ -> __Open Project...__ and select __project.hide__ in the root folder of the HIDE repository to open HIDE project in HIDE

3. (Optional) Navigate to __HIDE/bin__ and run __npm install__ to install required dependencies(you might need to add __sudo__ if you work under Linux/Mac OS X)

```bash
npm install
```

##### Contributing
I am always thrilled to receive pull requests, and I do my best to process them as fast as possible. Not sure if that typo is worth a pull request? Do it! I will appreciate it.

###License:
HIDE is licensed under the terms of the MIT License.
CodeMirror is licensed under the terms of the MIT License.
JQuery is licensed under the terms of the MIT License.
Bootstrap is licensed under the terms of the Apache License Version 2.0.
JQWidgets is licensed under non-commercial license(http://creativecommons.org/licenses/by-nc/3.0/).
Completion types is from Tern which is licensed under the terms of the MIT License.
Completion description CodeMirror add-on by @angelozerr.
Code snippets CodeMirror add-on by @angelozerr (with minor fixes by @AS3Boyan).
jQueryExtern is released in the public domain.
tjson is licensed under the terms of the MIT License
