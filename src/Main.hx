import core.FileAccess;
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
import js.html.UListElement;
import js.html.WheelEvent;
import js.Lib;
import jQuery.*;
import component.*;
import ui.menu.EditMenu;
import ui.menu.FileMenu;
import ui.menu.HelpMenu;
import ui.menu.RunMenu;
import ui.menu.SourceMenu;
import ui.menu.ViewMenu;


class Main {

	static public var session:Session;
	//static public var editors:StringMap<Dynamic>;
	//static public var tabs:Array<String>;
	static public var settings:StringMap<String>;
	//static public var cm:CodeMirror;
	
	// the program starts here	
    static public function main():Void {
		new JQuery(function():Void
			{				
				init();
				initCorePlugin();
				show();
			});
    }
	
	static private function show() 
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
		
		// var editors are used to store multiple file's informations. It's key must be the file's name (including the path).
		//editors = new StringMap();
		
		// var tabs are variable to populate the tabs.
		//tabs = [];
		
		// var settings are predefined variables for the IDE.
		settings = new StringMap();
    }
    
	public  static function resize():Void
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
		
		//var sample_code:String = 
		//
		//[
		//"import haxe.ds.StringMap.StringMap;",
		//"import js.html.File;",
		//"import js.Lib;",
		//"import jQuery.*;",
		//"import component.*;",
		//"import ui.menu.EditMenu;",
		//"import ui.menu.FileMenu;",
		//"import ui.menu.HelpMenu;",
		//"import ui.menu.RunMenu;",
		//"import ui.menu.SourceMenu;",
		//"",
		//"class Main {",
		//"",
		//"	static public var session:Session;",
		//"	static public var editors:StringMap<Array<Dynamic>>;",
		//"	static public var tabs:Array<String>;",
		//"	static public var settings:StringMap<String>;",
		//"",	
		//"	// the program starts here",
		//"	static public function main():Void {",
		//"		new JQuery(function():Void",
		//"			{",
		//"				init();",
		//"				initCorePlugin();",
		//"			});",
		//"	}",
		//"}"
		//].join("\n");
		
		//cm = CodeMirror.fromTextArea(js.Browser.document.getElementById("the_only_textarea_for_tabs_content"), {	
					//lineNumbers:true, 
					//indentUnit:4,
					//matchBrackets:true
					//}); 
		//
		//cm.setValue(sample_code);


		//createTextArea("tab1", sample_code);
		//createTextArea("tab2");
		//createTextArea("tab3");
		//
		//new JQuery("#tabs_position").append("<li><a href=\"#tab1\" data-toggle=\"tab\">Tab1</a></li>");
		//new JQuery("#tabs_position").append("<li><a href=\"#tab2\" data-toggle=\"tab\">Tab2</a></li>");
		//new JQuery("#tabs_position").append("<li><a href=\"#tab3\" data-toggle=\"tab\">Tab3</a></li>");
		
		//new JQuery( ".CodeMirror" ).css(["position: absolute", "top: 0", "left: 0", "right: 0", "bottom: 0", "width: \"100%\"", "height: \"100%\""]);
		//new JQuery( "#tab3" ).css(["position: absolute", "top: 0", "left: 0", "right: 0", "bottom: 0", "width: \"100%\"", "height: \"100%\""]);
		//new JQuery( "#tabs_position" ).css(["position: absolute", "top: 0", "left: 0", "right: 0", "bottom: 0", "width: \"100%\"", "height: \"100%\""]);
		
		//new JQuery(".CodeMirror").css("position", "relative");
		//new JQuery(".CodeMirror").css("top", "0");
		//new JQuery(".CodeMirror").css("left", "0");
		//new JQuery(".CodeMirror").css("right", "0");
		//new JQuery(".CodeMirror").css("bottom", "0");
		//new JQuery(".CodeMirror").css("width", "100%");
		//new JQuery(".CodeMirror").css("height", "100%");
				
		//trace(new JQuery("#tabs_content_position").css("height"));
				
				//.CodeMirror 
		  //position: absolute;
		  //top: 0;
		  //left: 0;
		  //right: 0;
		  //bottom: 0;
		//}
		
		//new JQuery('a[data-toggle="tab"]').on('shown.bs.tab', function (e:Dynamic) {
			//new JQuery('.CodeMirror').each(function(i, el){
				//untyped el.CodeMirror.refresh();
			//});
		//});
		//
		//untyped new JQuery('#tabs_position li:eq(2) a').tab('show');
		
		//new Completion();
    }
	
	//static function createTextArea(id:String, ?code:String):Void
	//{
		//if (code == null) code = "";
		//
		//var editor_str = 
		//[
		//"<div class=\"tab-pane\" id=\"" + id + "\">",
		//"<textarea id=\"" + id + "_textarea" +  "\">" + code + "</textarea>",
		//"<script>",
		//"CodeMirror.commands.autocomplete = function(cm) {",
		//"	CodeMirror.showHint(cm, CodeMirror.hint.haxe);",
		//"};",
		//"var editor = CodeMirror.fromTextArea(document.getElementById(\"" + id + "_textarea" + "\"), {",
		//"  lineNumbers: true, ",
		//"  indentUnit: 4, ",
		//"  matchBrackets: true, ",
		//"  extraKeys: {\"Ctrl-Space\": \"autocomplete\"}",
		//"});",
		//"</script>",
		//"</div>",
		//].join("\n");
		//
		//new JQuery("#tabs_content_position").append(editor_str);
	//}
	
	static private function initMenu() 
	{
		new FileMenu();
		new EditMenu();
		new ViewMenu();
		new SourceMenu();
		new RunMenu();
		new HelpMenu();
	}

    
    
}
