import core.TabsManager;
import haxe.ds.StringMap.StringMap;
import js.html.DivElement;
import js.html.File;
import js.Lib;
import jQuery.*;
import component.*;
import ui.menu.EditMenu;
import ui.menu.FileMenu;
import ui.menu.HelpMenu;
import ui.menu.RunMenu;
import ui.menu.SourceMenu;


class Main {

	static public var session:Session;
	static public var editors:StringMap<Dynamic>;
	static public var tabs:Array<String>;
	static public var settings:StringMap<String>;
	static public var cm:CodeMirror;
	
	// the program starts here	
    static public function main():Void {
		new JQuery(function():Void
			{
				init();
				initCorePlugin();
			});
    }

    static public function close():Void {
    	Sys.exit(0);
    }
    
    
	// the editor will always run this first. 
    static function init()
    {		
		TabsManager.init();
		
		// var session are used for storing vital information regarding the current usage
		session = new Session();
		
		// var editors are used to store multiple file's informations. It's key must be the file's name (including the path).
		editors = new StringMap();
		
		// var tabs are variable to populate the tabs.
		tabs = [];
		
		// var settings are predefined variables for the IDE.
		settings = new StringMap();
    }
    
    static function initCorePlugin()
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
		new SourceMenu();
		new RunMenu();
		new HelpMenu();
	}

    
    
}
