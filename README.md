HIDE
====

HIDE - cross platform IDE for Haxe programming language

Thanks to a group of [crowd funders at IndieGoGo](http://www.indiegogo.com/projects/cactus-ide/), HIDE is open source, licensed under the terms of the MIT License.

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

1. `haxelib git HIDE https://github.com/as3boyan/HIDE/ master bin`
2. `haxelib install node-webkit`
3. `haxelib run HIDE`

##### How to build:
1. Clone source using git

        git clone --recursive https://github.com/HaxeIDE/HIDE.git

1. You will need Haxe 3. Install haxelibs:
	
        haxelib install jQueryExtern
        haxelib install tjson
        haxelib install node-webkit

2. Navigate to the root folder and compile HIDE by running:

        haxe HIDE.hxml

3. Navigate to __HIDE/bin__ folder and run node-webkit there using:

        haxelib run node-webkit

4. Select __File__ -> __Open Project...__ and select __project.hide__ in the root folder of the HIDE repository to open HIDE project in HIDE

5. (Optional) Navigate to __HIDE/bin__ and run __npm install__ to install required dependencies(you might need to add __sudo__ if you work under Linux/Mac OS X)

	npm install

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
