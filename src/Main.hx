import core.FileAccess;
import core.FileDialog;
import core.ProjectAccess;
import core.TabsManager;
import haxe.ds.StringMap.StringMap;
import haxe.Timer;
import js.Browser;
import js.html.AnchorElement;
import js.html.DivElement;
import js.html.Element;
import js.html.Event;
import js.html.File;
import js.html.InputElement;
import js.html.KeyboardEvent;
import js.html.LabelElement;
import js.html.LIElement;
import js.html.MouseEvent;
import js.html.ScriptElement;
import js.html.UListElement;
import js.html.WheelEvent;
import js.Lib;
import jQuery.*;
import component.*;
import ui.menu.basic.Menu;
import ui.menu.EditMenu;
import ui.menu.FileMenu;
import ui.menu.HelpMenu;
import ui.menu.RunMenu;
import ui.menu.SourceMenu;
import ui.menu.ViewMenu;

class Main {

	static public var session:Session;
	static public var settings:StringMap<String>;
	static private var menus:StringMap<Menu>;	
	
	// the program starts here	
    static public function main():Void {	
		new JQuery(function():Void
			{	
				show();
				init();
				initCorePlugin();
			});
    }
	
	static private function show():Void
	{
		Utils.gui.Window.get().show();
	}

    static public function close():Void {
    	Sys.exit(0);
    }
    
	// the editor will always run this first. 
    static function init()
    {
		Browser.window.onresize = function (e)
		{
			resize();
		}
				
		TabsManager.init();
		
		Browser.window.ondragover = function(e) { e.preventDefault(); e.stopPropagation(); return false; };
		Browser.window.ondrop = function(e:Dynamic) 
		{
			e.preventDefault();
			e.stopPropagation();

			for (i in 0...e.dataTransfer.files.length) 
			{
				TabsManager.openFileInNewTab(e.dataTransfer.files[i].path);
			}

			return false;
		};
		
		Browser.window.onkeyup = function (e:KeyboardEvent)
		{
			if (e.ctrlKey)
			{
				if (!e.shiftKey)
				{
					switch (e.keyCode) 
					{
						//Ctrl-W
						case 87:
							TabsManager.closeActiveTab();
						//Ctrl-0
						case 48:
							new JQuery(".CodeMirror").css("font-size", "11pt");
							new JQuery(".CodeMirror-hint").css("font-size", "11pt");
							new JQuery(".CodeMirror-hints").css("font-size", Std.string(11*0.9) +"pt");
						//Ctrl-'-'
						case 189:
							var font_size:Int = Std.parseInt(new JQuery(".CodeMirror").css("font-size"));
							font_size--;
							setFontSize(font_size);
						//Ctrl-'+'
						case 187:
							var font_size:Int = Std.parseInt(new JQuery(".CodeMirror").css("font-size"));
							font_size++;
							setFontSize(font_size);
						//Ctrl-Tab
						case 9:
							TabsManager.showNextTab();
							e.preventDefault(); 
							e.stopPropagation(); 
						//Ctrl-O
						case 79:
							FileAccess.openFile();
						//Ctrl-S
						case 83:
							FileAccess.saveActiveFile();
						default:
							
					}			
				}
				else
				{
					switch (e.keyCode) 
					{
						//Ctrl-Shift-0
						case 48:
							Utils.window.zoomLevel = 0;
						//Ctrl-Shift-'-'
						case 189:
							Utils.zoomOut();
						//Ctrl-Shift-'+'
						case 187:
							Utils.zoomIn();
						//Ctrl-Shift-Tab
						case 9:
							TabsManager.showPreviousTab();
							e.preventDefault(); 
							e.stopPropagation(); 
						//Ctrl-Shift-O
						case 79:
							ProjectAccess.openProject();
						//Ctrl-Shift-S
						case 83:
							//Save as...
						//Ctrl-Shift-T
						case 'T'.code:
							TabsManager.applyRandomTheme();
						case _:
							
					}		
				}
				//trace(e.keyCode);
			}
			else
			{
				if (e.keyCode == 13 && e.shiftKey && e.altKey)
				{
					Utils.toggleFullscreen();
				}
			}
		};
		
		Browser.document.onmousewheel = function(e:WheelEvent)
		{
			if (e.altKey)
			{
				if (e.wheelDeltaY < 0)
				{
					var font_size:Int = Std.parseInt(new JQuery(".CodeMirror").css("font-size"));
					font_size--;
					setFontSize(font_size);
					e.preventDefault(); 
					e.stopPropagation(); 
				}
				else if (e.wheelDeltaY > 0)
				{
					var font_size:Int = Std.parseInt(new JQuery(".CodeMirror").css("font-size"));
					font_size++;
					setFontSize(font_size);
					e.preventDefault(); 
					e.stopPropagation(); 
				}
			}
		};
		
		// var session are used for storing vital information regarding the current usage
		session = new Session();
		
		// var settings are predefined variables for the IDE.
		settings = new StringMap();
		
		FileDialog.init();
		
		var haxeCompletionServer = js.Node.require('child_process').spawn("haxe", ["--wait", "6001"]);

		haxeCompletionServer.stderr.setEncoding('utf8');
		haxeCompletionServer.stderr.on('data', function (data) {
			var str:String = data.toString();
			var lines = str.split("\n");
			trace("ERROR: " + lines.join(""));
		});
		
		haxeCompletionServer.on('close', function (code) {
			trace('haxeCompletionServer process exit code ' + code);
		});
		
		//var haxeCompilerClient = js.Node.require('child_process').spawn("haxe", ["--connect", "6001", "--cwd", "..","HaxeEditor2.hxml"]);
		//
		//haxeCompilerClient.stdout.setEncoding('utf8');
		//haxeCompilerClient.stdout.on('data', function (data) {
			//var str:String = data.toString();
			//var lines = str.split("\n");
			//trace("OUTPUT: " + lines.join(""));
		//});
		//
		//haxeCompilerClient.stderr.setEncoding('utf8');
		//haxeCompilerClient.stderr.on('data', function (data) {
			//var str:String = data.toString();
			//var lines = str.split("\n");
			//trace("ERROR: " + lines.join(""));
		//});
//
		//haxeCompilerClient.on('close', function (code) {
			//trace('haxeCompilerClient process exit code ' + code);
		//});
		
		
		//new TernAddon();
		
		var tree:UListElement = cast(Browser.document.getElementById("tree"), UListElement);
		
		var rootTreeElement:LIElement = createDirectoryElement("HIDE");		
		
		tree.appendChild(rootTreeElement);
		
		readDir("../", rootTreeElement);
    }
	
	public static function createDirectoryElement(text:String):LIElement
	{
		var directoryElement:LIElement = Browser.document.createLIElement();
		
		var a:AnchorElement = Browser.document.createAnchorElement();
		a.className = "tree-toggler nav-header";
		a.href = "#";
		
		var span = Browser.document.createSpanElement();
		span.className = "glyphicon glyphicon-folder-open";
		a.appendChild(span);
		
		span = Browser.document.createSpanElement();
		span.textContent = text;
		span.style.marginLeft = "5px";
		a.appendChild(span);
		
		//var textNode = Browser.document.createTextNode(text);
		//a.appendChild(textNode);
		
		a.onclick = function (e:MouseEvent):Void
		{
			new JQuery(directoryElement).children('ul.tree').toggle(300);
			Main.resize();
		};
		
		//var label:LabelElement = Browser.document.createLabelElement();
		//label.className = "tree-toggler nav-header";
		//label.textContent = text;
		
		directoryElement.appendChild(a);
		
		var ul:UListElement = Browser.document.createUListElement();
		ul.className = "nav nav-list tree";
		
		directoryElement.appendChild(ul);
		
		return directoryElement;
	}
	
	public static function readDir(path:String, topElement:LIElement):Void
	{				
		Utils.fs.readdir(path, function (error:js.Node.NodeErr, files:Array<String>):Void
		{			
			var foldersCount:Int = 0;
			
			for (file in files)
			{
				var filePath:String = Utils.path.join(path, file);
				
				Utils.fs.stat(filePath, function (error:js.Node.NodeErr, stat:js.Node.NodeStat)
				{					
					if (stat.isFile())
					{
						var li:LIElement = Browser.document.createLIElement();
						
						var a:AnchorElement = Browser.document.createAnchorElement();
						a.href = "#";
						a.textContent = file;
						a.title = filePath;
						a.onclick = function (e):Void
						{
							TabsManager.openFileInNewTab(filePath);
						};
						
						if (StringTools.endsWith(file, ".hx"))
						{
							a.style.fontWeight = "bold";
						}
						else if (StringTools.endsWith(file, ".hxml"))
						{
							a.style.fontWeight = "bold";
							a.style.color = "gray";
						}
						else
						{
							a.style.color = "gray";
						}
						
						li.appendChild(a);
						
						var ul:UListElement = cast(topElement.getElementsByTagName("ul")[0], UListElement);
						ul.appendChild(li);
					}
					else
					{
						if (!StringTools.startsWith(file, "."))
						{
							var ul:UListElement = cast(topElement.getElementsByTagName("ul")[0], UListElement);
							
							var directoryElement:LIElement = createDirectoryElement(file);
							
							//Lazy loading
							directoryElement.onclick = function (e):Void
							{
								if (directoryElement.getElementsByTagName("ul")[0].childNodes.length == 0)
								{
									readDir(filePath, directoryElement);
									e.stopPropagation();
									e.preventDefault();
									directoryElement.onclick = null;
								}
							}
							
							ul.appendChild(directoryElement);
							ul.insertBefore(directoryElement, ul.childNodes[foldersCount]);
							foldersCount++;
						}
					}
				}
				);
			}
			
			new JQuery(topElement).children('ul.tree').show(300);
		}
		);
	}
    
	public static function resize():Void
	{
		var ul1:Element = Browser.document.getElementById("docs");
		new JQuery(".CodeMirror").css("height", Std.string(Browser.window.innerHeight - 58 - ul1.clientHeight));
		new JQuery("#tree_well").css("height", Std.string(Browser.window.innerHeight - 58));
		new JQuery("#demospace").css("width", Std.string(Browser.window.innerWidth - 250));
	}
	
	static function setFontSize(font_size:Int):Void
	{
		new JQuery(".CodeMirror").css("font-size", Std.string(font_size) + "px");
		new JQuery(".CodeMirror-hint").css("font-size", Std.string(font_size - 2) + "px");
		new JQuery(".CodeMirror-hints").css("font-size", Std.string(font_size - 2) + "px");
	}
	
    static function initCorePlugin():Void
    {
		initMenu();
    }
	
	private static function initMenu() 
	{
		menus = new StringMap();
		
		menus.set("file", new FileMenu());
		menus.set("edit", new EditMenu());
		menus.set("view", new ViewMenu());
		menus.set("source", new SourceMenu());
		menus.set("run", new RunMenu());
		menus.set("help", new HelpMenu());
		
		Timer.delay(updateMenu, 100);
	}

    public static function updateMenu():Void
	{
		var disabled_menu_items:Array<Array<Int>> = new Array();
		
		for (i in 0...3)
		{
			disabled_menu_items.push(new Array());
		}
		
		if (TabsManager.docs.length == 0)
		{
			disabled_menu_items[0].push(6);
			disabled_menu_items[0].push(10);
			disabled_menu_items[0].push(11);
			disabled_menu_items[0].push(12);
			
			disabled_menu_items[1].push(0);
			disabled_menu_items[1].push(1);
			disabled_menu_items[1].push(3);
			disabled_menu_items[1].push(4);
			disabled_menu_items[1].push(5);
			disabled_menu_items[1].push(6);
			disabled_menu_items[1].push(7);
			disabled_menu_items[1].push(9);
			disabled_menu_items[1].push(10);
		}
		
		if (session.current_project_xml == "")
		{
			disabled_menu_items[0].push(3);
			disabled_menu_items[0].push(8);
			disabled_menu_items[2].push(0);
			disabled_menu_items[2].push(1);
		}
		
		menus.get("file").setDisabled(disabled_menu_items[0]);
		menus.get("edit").setDisabled(disabled_menu_items[1]);
		menus.get("run").setDisabled(disabled_menu_items[2]);
	}
    
}
