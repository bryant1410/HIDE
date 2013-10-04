package core;
import haxe.Timer;
import js.Browser;
import jQuery.*;

//Code from Tern bin\includes\js\tern\doc\demo\demo.js
//Ported to Haxe

/**
 * ...
 * @author AS3Boyan
 */
class TabsManager
{

	public static var useWorker:Bool = false;
	public static var server:Dynamic;
	public static var editor:Dynamic;
	public static var docs:Array<Dynamic> = [];
	public static var curDoc:Dynamic;
	
	public function new() 
	{
		
	}
	
	public static function init()
	{
	  new JQuery(Browser.document).on("closeTab",function(event,pos)
		{
			trace('this will close the tab at Pos :'+pos);
	  	});


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
		});
	}
	
	private static function load(file, c:Dynamic) 
	{
	  //var xhr = Browser.createXMLHttpRequest();
	  //xhr.open("get", file, true);
	  //xhr.send();
	  //xhr.onreadystatechange = function(e) {
		//if (xhr.readyState == 4) c(xhr.responseText, xhr.status);
	  //};
	  
	  
	  c(Utils.system_openFile(file), 200);
	}
	
	public static function openFileInNewTab(path:String):Void
	{
		var pos:Int = null;
		
		if (Utils.getOS() == Utils.WINDOWS)
		{
			pos = path.lastIndexOf("\\");
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
		
		load(path, function(body) 
		{
			registerDoc(filename, new CodeMirror.Doc(body, "haxe"),path);
			selectDoc(docs.length - 1);
		});
	}
	
	public static function closeActiveTab():Void
	{
		if (docs.length == 1) return;
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
	
	private static function initEditor() 
	{
		  var keyMap = {
			"Ctrl-I": function(cm) { server.showType(cm); },
			"Ctrl-Space": function(cm) { server.complete(cm); },
			"Alt-.": function(cm) { server.jumpToDef(cm); },
			"Alt-,": function(cm) { server.jumpBack(cm); },
			"Ctrl-Q": function(cm) { server.rename(cm); }
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

		  editor.on("cursorActivity", function(cm) { server.updateArgHints(cm); });


		  registerDoc("Main.hx", editor.getDoc(),'');
		  
		  //registerDoc("test_dep.js", new CodeMirror.Doc(document.getElementById("requirejs_test_dep").firstChild.nodeValue, "javascript"));
		  
		  //We can load files like this:
		  
		  //load("./includes/js/tern/doc/demo/underscore.js", function(body) {
			//registerDoc("underscore.js", new CodeMirror.Doc(body, "javascript"));
		  //});

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

private static function registerDoc(name, doc:CodeMirror.Doc,path) 
{
  server.addDoc(name, doc);
  var data = {name: name, doc: doc,path:path};
  docs.push(data);

  /*
  var docTabs = Browser.document.getElementById("docs");
  var li = docTabs.appendChild(Browser.document.createElement("li"));
  li.appendChild(Browser.document.createTextNode(name));
  */
  var new_doc_pos = new JQuery("#docs").children().length;
  if (new_doc_pos != 0)
  	{
  	new JQuery("#docs").append("<li>"+name+"&nbsp;<span style='position:relative;top:2px;' onclick='$(document).triggerHandler(\"closeTab\",\""+new_doc_pos+"\");'><span class='glyphicon glyphicon-remove-circle'></span></span></li>");		
  	}
  else
  	{
  	new JQuery("#docs").append("<li>"+name+"</li>");			
  	}
  

  if (editor.getDoc() == doc) {
    setSelectedDoc(docs.length - 1);
    curDoc = data;
  }


}

private static function unregisterDoc(doc) 
{
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
  selectDoc(Std.int(Math.max(0, j - 1)));
}

private static function setSelectedDoc(pos) 
{
  var docTabs = Browser.document.getElementById("docs");
  for (i in 0...docTabs.childNodes.length)
	
	if (pos == i)
	{
		untyped docTabs.childNodes[i].className = "selected";
	}
	else
	{
		untyped docTabs.childNodes[i].className = "";
	}
}
	
public static function selectDoc(pos) 
	{
	server.hideDoc(curDoc.name);
	setSelectedDoc(pos);
	curDoc = docs[pos];
	editor.swapDoc(curDoc.doc);
	}
	
}