import haxe.ds.StringMap.StringMap;
import js.Lib;
import jQuery.*;
import component.*;
//import component.ProjectAccess;
class Main {

	static public var session:Session;
	static public var editors:StringMap<Array<Dynamic>>;
	static public var tabs:Array<String>;
	static public var settings:StringMap<String>;
	
	// the program starts here	
    static public function main():Void {
		new JQuery(function():Void
			{
				init();
				initCorePlugin();
			});
    }
    
    
	// the editor will always run this first. 
    static function init()
    {
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
		FileAccess.init();
		ProjectAccess.init();
    }

    
    
}
