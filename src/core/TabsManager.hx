package core;
import haxe.Timer;
import js.Browser;
import jQuery.*;
import js.html.AnchorElement;
import js.html.DivElement;
import js.html.Element;
import js.html.LIElement;
import js.html.MouseEvent;
import js.html.RGBColor;
import js.html.SpanElement;
import js.html.UListElement;

//Code from Tern bin\includes\js\tern\doc\demo\demo.js
//Ported to Haxe

typedef Doc = {
	var name:String;
	var doc:Dynamic;
	var path:String;
}

/**
 * ...
 * @author AS3Boyan
 */
class TabsManager
{

	public static var useWorker:Bool = false;
	public static var server:Dynamic;
	public static var editor:Dynamic;
	public static var docs:Array<Doc> = [];
	public static var curDoc:Doc;
	private static var themes:Array<String>;
	
	public function new() 
	{
		
	}
	
	public static function init()
	{
		themes = 
		[
		"3024-day",
		"3024-night",
		"ambiance",
		"base16-dark",
		"base16-light",
		"blackboard",
		"cobalt",
		"eclipse",
		"elegant",
		"erlang-dark",
		"lesser-dark",
		"midnight",
		"monokai",
		"neat",
		"night",
		"paraiso-dark",
		"paraiso-light",
		"rubyblue",
		"solarized dark",
		"solarized light",
		"the-matrix",
		"tomorrow-night-eighties",
		"twilight",
		"vibrant-ink",
		"xq-dark",
		"xq-light"
		];
		
		CodeMirror.on(Browser.window, "load", function() {
		  //Those defs(ecma5.json, browser.json, jquery.json) contain default completion for JavaScript, 
		  //probably we can supply here Haxe keywords, like so:
		  //this, typedef, class, interface, package, private, public, static, var, function, trace, switch, case and etc.
		  //http://haxe.org/ref/keywords
		  //We can create file similar to ecma5.json and provide description for each keyword
		  
		  //We can even provide completion for classes here, like String.
			
		  //var files = ["./includes/js/tern/defs/ecma5.json"];
		  //var files = ["./includes/js/tern/defs/ecma5.json", "./includes/js/tern/defs/browser.json", "./includes/js/tern/defs/jquery.json"];
		  //var loaded = 0;
		  //for (var i = 0; i < files.length; ++i) (function(i) {
			//load(files[i], function(json) {
			  //defs[i] = JSON.parse(json);
			  //if (++loaded == files.length) initEditor();
			//});
		  //})(i);
		  
		  initEditor();

		  //var cmds = document.getElementById("commands");
		  //CodeMirror.on(cmds, "change", function() {
			//if (!editor || cmds.selectedIndex == 0) return;
			//var found = commands[cmds.value];
			//cmds.selectedIndex = 0;
			//editor.focus();
			//if (found) found(editor);
		  //});
		  
			Main.resize();
			
			TabsManager.editor.refresh();
		  
			createContextMenu();
		});
	}
	
	private static function createContextMenu():Void
	{
		var contextMenu:DivElement = Browser.document.createDivElement();
		contextMenu.className = "dropdown";
		contextMenu.style.position = "absolute";
		contextMenu.style.display = "none";
		
		Browser.document.onclick = function (e:MouseEvent)
		{
			contextMenu.style.display = "none";
		};
		
		var ul:UListElement = Browser.document.createUListElement();
		ul.className = "dropdown-menu";
		ul.style.display = "block";
		
		ul.appendChild(createContextMenuItem("New File...", TabsManager.createFileInNewTab));
		
		var li:LIElement = Browser.document.createLIElement();
		li.className = "divider";
		
		ul.appendChild(li);
		ul.appendChild(createContextMenuItem("Close", function ()
		{
			TabsManager.closeTab(contextMenu.getAttribute("path"));
		}
		));
		ul.appendChild(createContextMenuItem("Close All", function ()
		{
			closeAll();
		}
		));
		
		ul.appendChild(createContextMenuItem("Close Other", function ()
		{
			var path = contextMenu.getAttribute("path");
			closeOthers(path);
		}
		));
		
		contextMenu.appendChild(ul);
		
		Browser.document.body.appendChild(contextMenu);
		
		Browser.document.getElementById("docs").addEventListener('contextmenu', function(ev:MouseEvent) 
		{ 
			ev.preventDefault();
			
			var clickedOnTab:Bool = false;
			
			for (li in Browser.document.getElementById("docs").childNodes)
			{
				if (ev.target == li)
				{
					clickedOnTab = true;
					break;
				}
			}
			
			if (clickedOnTab)
			{
				var li:LIElement = cast(ev.target, LIElement);
				contextMenu.setAttribute("path", li.getAttribute("path"));
				
				contextMenu.style.display = "block";
				contextMenu.style.left = Std.string(ev.pageX) + "px";
				contextMenu.style.top = Std.string(ev.pageY) + "px";
			}
			
			return false;
		}
		);
	}
	
	private static function createContextMenuItem(text:String, onClick:Dynamic):LIElement
	{
		var li:LIElement = Browser.document.createLIElement();
		li.onclick = function (e:MouseEvent)
		{
			onClick();
		};
		
		var a:AnchorElement = Browser.document.createAnchorElement();
		a.href = "#";
		a.textContent = text;
		li.appendChild(a);
		
		return li;
	}
	
	public static function applyRandomTheme():Void
	{		
		var theme:String = themes[Std.random(themes.length)];
		editor.setOption("theme", theme);
		new JQuery("body").css("background", new JQuery(".CodeMirror").css("background"));
		new JQuery("#style_override").append("<style>ul.tabs li {background: " + new JQuery(".CodeMirror").css("background") + ";}</style>");
		new JQuery("#style_override").append("<style>ul.tabs li {color: " + new JQuery(".CodeMirror").css("color") +  ";}</style>");
		new JQuery("#style_override").append("<style>ul.tabs li:hover {color: " + new JQuery(".cm-keyword").css("color") +  ";}</style>");
		new JQuery("#style_override").append("<style>ul.tabs li.selected {background: " + new JQuery(".CodeMirror").css("background") + ";}</style>");
		new JQuery("#style_override").append("<style>ul.tabs li.selected {color: " + new JQuery(".cm-variable").css("color") + ";}</style>");
		new JQuery("#style_override").append("<style>.CodeMirror-hints {background: " + new JQuery(".CodeMirror").css("background") + ";}</style>");
		new JQuery("#style_override").append("<style>.CodeMirror-hint {color: " + new JQuery(".cm-variable").css("color") + ";}</style>");
		new JQuery("#style_override").append("<style>.CodeMirror-hint-active {background: " + new JQuery(".CodeMirror").css("background") + ";}</style>");
		new JQuery("#style_override").append("<style>.CodeMirror-hint-active {color: " + new JQuery(".cm-keyword").css("color") + ";}</style>");
	}
	
	public static function createFileInNewTab():Void
	{
		FileDialog.saveFile(function (value:String)
		{
			var path:String = convertPathToUnixFormat(value);
		
			if (isAlreadyOpened(path))
			{
				return;
			}
			
			var name:String = getFileName(path);
			var mode:String = getMode(name);
			
			var code:String = "";
			
			if (Utils.path.extname(name) == ".hx")
			{
				path = path.substr(0, path.length - name.length) + Utils.capitalize(name);
				
				code = "package ;\n\nclass " + Utils.path.basename(name) + "\n{\n\n}";
			}
			
			registerDoc(name, new CodeMirror.Doc(code, mode), path);
			selectDoc(docs.length - 1);
		}
		);
	}
	
	private static function convertPathToUnixFormat(path:String):String
	{
		if (Utils.getOS() == Utils.WINDOWS)
		{
			var ereg = ~/[\\]/g;
			
			path = ereg.replace(path, "/");
		}
		
		return path;
	}
	
	private static function isAlreadyOpened(path:String):Bool
	{
		var opened:Bool = false;
		
		for (i in 0...docs.length)
		{
			if (docs[i].path == path)
			{
				selectDoc(i);
				opened = true;
				break;
			}
		}
		
		return opened;
	}
	
	private static function getFileName(path:String):String
	{				
		var pos:Int = null;
		
		if (Utils.getOS() == Utils.WINDOWS)
		{
			pos = path.lastIndexOf("\\");
			
			if (pos == -1)
			{
				pos = path.lastIndexOf("/");
			}
		}
		else
		{
			pos = path.lastIndexOf("/");
		}
		
		var filename:String = null;
		
		if (pos != -1)
		{
			filename = path.substr(pos + 1);
		}
		else
		{
			filename = path;
		}
		
		return filename;
	}
	
	private static function getMode(filename:String):String
	{
		var mode:String = "haxe";
			
		switch (Utils.path.extname(filename)) 
		{
			case ".js":
				mode = "javascript";
			case ".css":
				mode = "css";
			case ".xml":
				mode = "xml";
			case ".html":
				mode = "text/html";
			case ".md":
				mode = "markdown";
			case ".sh", ".bat":
				mode = "shell";
			case ".ml":
				mode = "ocaml";
			default:
				
		}
		
		return mode;
	}
	
	public static function openFileInNewTab(path:String):Void
	{
		path = convertPathToUnixFormat(path);
		
		if (isAlreadyOpened(path))
		{
			return;
		}
		
		var filename:String = getFileName(path);
		
		Utils.system_openFile(path, function(data:String):Void
		{			
			var mode:String = getMode(filename);
			registerDoc(filename, new CodeMirror.Doc(data, mode), path);
			selectDoc(docs.length - 1);
			
			if (new JQuery("#sourceCodeEditor").css("display") == "none" && docs.length > 0)
			{
				new JQuery("#sourceCodeEditor").css("display", "block");
				TabsManager.editor.refresh();
				Main.updateMenu();
			}
			
			Main.resize();
		});
	}
	
	public static function closeAll():Void
	{
		for (i in 0...docs.length)
		{
			if (docs[i] != null)
			{
				closeTab(docs[i].path, false);
			}
		}
		
		if (docs.length > 0)
		{
			Timer.delay(function ()
			{
				closeAll();
			}
			,30);
		}
	}
	
	public static function closeOthers(path:String):Void
	{
		for (i in 0...docs.length)
		{
			if (docs[i] != null && path != docs[i].path)
			{
				closeTab(docs[i].path);
			}
		}
		
		if (docs.length > 1)
		{
			Timer.delay(function ()
			{
				closeOthers(path);
			}
			,30);
		}
	}
	
	public static function closeTab(path:String, ?switchToTab:Bool = true):Void
	{
		for (i in 0...docs.length)
		{				
			if (docs[i] != null && docs[i].path == path)
			{
				unregisterDoc(docs[i], switchToTab);
			}
		}
	}
	
	public static function closeActiveTab():Void
	{
		unregisterDoc(curDoc);
	}
	
	public static function showNextTab():Void
	{
		var n = Lambda.indexOf(docs, curDoc);
		
		n++;
		
		if (n > docs.length - 1)
		{
			n = 0;
		}
		
		selectDoc(n);
	}
	
	public static function showPreviousTab():Void
	{
		var n = Lambda.indexOf(docs, curDoc);
		
		n--;
		
		if (n < 0)
		{
			n = docs.length - 1;
		}
		
		selectDoc(n);
	}
	
	private static function initEditor():Void
	{
		  var keyMap = {
			"Ctrl-I": function(cm) { server.showType(cm); },
			"Ctrl-Space": function(cm) { server.complete(cm); },
			"Alt-.": function(cm) { server.jumpToDef(cm); },
			"Alt-,": function(cm) { server.jumpBack(cm); },
			"Ctrl-Q": function(cm) { server.rename(cm); },
			//".": function(cm) 
			//{ 
				//untyped setTimeout(function(){server.complete(cm);}, 100); 
				//untyped throw CodeMirror.Pass; // tell CodeMirror we didn't handle the key 
			//} 
		  };

		  editor = CodeMirror.fromTextArea(Browser.document.getElementById("code"), {
			lineNumbers: true,
			extraKeys: keyMap,
			matchBrackets: true,
			dragDrop: false,
			autoCloseBrackets: true,
			foldGutter: {
				rangeFinder: untyped __js__("new CodeMirror.fold.combine(CodeMirror.fold.brace, CodeMirror.fold.comment)")
			},
			gutters: ["CodeMirror-linenumbers", "CodeMirror-foldgutter"]
		  });
		  
		  server = new TernServer({
			defs: [],
			plugins: {doc_comment: true},
			switchToDoc: function(name) { selectDoc(docID(name)); },
			workerDeps: ["./includes/js/acorn/acorn.js", "./includes/js/acorn/acorn_loose.js",
						 "./includes/js/acorn/util/walk.js", "./includes/js/tern/lib/signal.js", "./includes/js/tern/lib/tern.js",
						 "./includes/js/tern/lib/def.js", "./includes/js/tern/lib/infer.js", "./includes/js/tern/lib/comment.js",
						 "./includes/js/tern/plugin/doc_comment.js"],
			workerScript: "./includes/js/codemirror-3.18/addon/tern/worker.js",
			useWorker: useWorker

		  });

		  editor.on("cursorActivity", function(cm) { server.updateArgHints(cm); } );
		  
		  openFileInNewTab("../src/Main.hx");
		  
		  CodeMirror.on(Browser.document.getElementById("docs"), "click", function(e) {
			var target:Dynamic = e.target || e.srcElement;
			if (target.nodeName.toLowerCase() != "li") return;
			
			var i = 0;
			var c:Dynamic = target.parentNode.firstChild;
			
			if (c == target)
			{
				return selectDoc(0);
			}
			else
			{
				while (true)
				{
					i++;
					c = c.nextSibling;
					if (c == target) return selectDoc(i);
				}
			}			
			//for (var i = 0, c = target.parentNode.firstChild; ; ++i, (c = c.nextSibling))
			  //if (c == target) return selectDoc(i);
		  });
	}

	private static function findDoc(name) { return docs[docID(name)]; }
	private static function docID(name) { for (i in 0...docs.length) if (docs[i].name == name) return i; return null; }

private static function registerDoc(name:String, doc:CodeMirror.Doc, path:String):Void
{	
  server.addDoc(name, doc, path);
  var data = {name: name, doc: doc, path: path};
  docs.push(data);

  var docTabs = Browser.document.getElementById("docs");
  var li:LIElement = Browser.document.createLIElement();
  li.title = path;
  li.innerText = name + "\t";
  li.setAttribute("path", path);
  
  var span:SpanElement = Browser.document.createSpanElement();
  span.style.position = "relative";
  span.style.top = "2px";
  
  span.onclick = function (e)
  {
	  closeTab(path);
  }
  
  var span2:SpanElement = Browser.document.createSpanElement();
  span2.className = "glyphicon glyphicon-remove-circle";
  span.appendChild(span2);
  
  li.appendChild(span);
  
  docTabs.appendChild(li);
  
  if (editor.getDoc() == doc) 
  {
    setSelectedDoc(docs.length - 1);
    curDoc = data;
  }
}

private static function unregisterDoc(doc, ?switchToTab:Bool = true):Void
{
	var b = curDoc == doc;
	
  server.delDoc(doc.name);
  var j:Int = null;
  for (i in 0...docs.length) 
  {
	  j = i;
	  if (doc == docs[i]) break;
  }
  
  docs.splice(j, 1);
  var docList = Browser.document.getElementById("docs");
  docList.removeChild(docList.childNodes[j]);
  
  if (switchToTab && b && docList.childNodes.length > 0)
  {
	selectDoc(Std.int(Math.max(0, j - 1)));
  }
  
  if (docList.childNodes.length == 0)
  {
	  new JQuery("#sourceCodeEditor").css("display", "none");
	  Main.updateMenu();
  }
  
  Main.resize();
}

private static function setSelectedDoc(pos):Void
{
	var docTabs = Browser.document.getElementById("docs");
	for (i in 0...docTabs.childNodes.length)
	{
		var child:Element = cast(docTabs.childNodes[i], Element);
	  
		if (pos == i)
		{
			child.className = "selected";
		}
		else
		{
			child.className = "";
		}
	}
}
	
public static function selectDoc(pos):Void
{
	if (curDoc != null)
	{
		server.hideDoc(curDoc.name);
	}
	setSelectedDoc(pos);
	curDoc = docs[pos];
	editor.swapDoc(curDoc.doc);
}
	
}