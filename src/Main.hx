/*
import core.FileAccess;
import core.FileDialog;
import core.ProjectAccess;
*/
package ;
import haxe.ds.StringMap.StringMap;
import js.Browser;
import js.Lib;
import jQuery.*;
import component.*;
import plugin.*;
import plugin.misterpah.*;

class Main {

	static public var session:Map<String,String>;
	static public var settings:Map<String,String>;
	static public var opened_file_stack:Map<String,Map<String,String>>;
	//static private var menus:StringMap<Menu>;
	
	// the program starts here	
    static public function main():Void 
    {
		new JQuery(function():Void
			{		
			init();
			pluginManager();
			});
    }
	

	// the editor will always run this first. 
    static function init()
    {
		// var session are used for storing vital information regarding the current usage
		session = new Map();
		session.set("project_xml","");
		session.set("project_xml_parameter","");
		session.set("project_folder","");
		session.set("active_file","");

		// var settings are predefined variables for the IDE.
		settings = new Map();
		
		// var opened_file_stack are predifined as variables for all of the opened file.
		opened_file_stack = new Map();
		/*
		var fileObj = new Map();
		fileObj.set("value","black");
		opened_file_stack.set("path/to/the/file/abc.hx",fileObj);
		*/
    }
	
	// this function will manage all of the plugin. including everything regarding HIDE.
    static function pluginManager():Void
    {
		Utils.gui.Window.get().showDevTools();
		new plugin.FileMenu();
		new plugin.misterpah.Editor();
		new plugin.misterpah.FileAccess();
		new plugin.misterpah.ProjectAccess();
		new plugin.misterpah.Keyboardshortcut();
		//initMenu();
		//EditorCMNative.init();
    }
	
    
}

