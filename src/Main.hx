import js.Lib;
import jQuery.*;
import component.*;
//import component.ProjectAccess;
class Main {

	static public var session:Map<String,String>;
	static public var editors:Map<String,Array<Dynamic>>;
	static public var tabs:Array<String>;
	static public var settings:Map<String,String>;
	
	
	
	// the program starts here	
    static public function main():Void {
		new JQuery(function():Void
			{
			init();
			editor_basic_plugin();
			
			});
    }
    
    
	// the editor will always run this first. 
    static function init()
    {
		// var session are used for storing vital information regarding the current usage
		session = new Map();
		session.set('current_project_xml', '') ;
		session.set('current_project_folder', "");
		session.set('current_active_file', "");
		
		// var editors are used to store multiple file's informations. It's key must be the file's name (including the path).
		editors = new Map();
		
		// var tabs are variable to populate the tabs.
		tabs = [];
		
		// var settings are predefined variables for the IDE.
		settings = new Map();		
    }
    
    

    static function editor_basic_plugin()
    {
		FileAccess.init();
		ProjectAccess.init();
    }

    
    
}
