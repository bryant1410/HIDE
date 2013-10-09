import core.FileAccess;
import core.FileDialog;
import core.ProjectAccess;
import core.TabsManager;
import haxe.ds.StringMap.StringMap;
import haxe.Timer;
import js.Browser;
import js.html.DivElement;
import js.html.Element;
import js.html.Event;
import js.html.File;
import js.html.InputElement;
import js.html.KeyboardEvent;
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
		
		//var input_element:InputElement = Browser.document.createInputElement();
		//input_element.id = "ProjectAccess_openFile_file";
		//input_element.type = "file";
		
		//Browser.document.appendChild(input_element);
		
		//var gui = js.Node.require('nw.gui');
//
		// Create an empty menu
		//var menu = untyped __js__("new gui.Menu();");
		//
		//menu.append(untyped __js__("new gui.MenuItem({ label: 'Close' })"));
		//menu.append(untyped __js__("new gui.MenuItem({ label: 'Close All' })"));
		//menu.append(untyped __js__("new gui.MenuItem({ label: 'Close Others' })"));
		//
		//Browser.document.getElementById("docs").addEventListener('contextmenu', function(ev:Event) { 
		  //ev.preventDefault();
		  //menu.popup(ev.x, ev.y);
		  //return false;
		//});
		
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
		
		var haxeCompilerClient = js.Node.require('child_process').spawn("haxe", ["--connect", "6001", "--cwd", "..","HaxeEditor2.hxml"]);
		
		haxeCompilerClient.stdout.setEncoding('utf8');
		haxeCompilerClient.stdout.on('data', function (data) {
			var str:String = data.toString();
			var lines = str.split("\n");
			trace("OUTPUT: " + lines.join(""));
		});
		
		haxeCompilerClient.stderr.setEncoding('utf8');
		haxeCompilerClient.stderr.on('data', function (data) {
			var str:String = data.toString();
			var lines = str.split("\n");
			trace("ERROR: " + lines.join(""));
		});

		haxeCompilerClient.on('close', function (code) {
			trace('haxeCompilerClient process exit code ' + code);
		});
    }
    
	public static function resize():Void
	{
		var ul1:Element = Browser.document.getElementById("docs");
		new JQuery(".CodeMirror").css("height", Std.string(Browser.window.innerHeight - 58 - ul1.clientHeight));
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
