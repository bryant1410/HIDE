package plugin.misterpah;
import jQuery.*;
import js.Browser;
import ui.*;
import Utils;

// This is the recommended minimum structure of a HIDE plugin

@:keepSub @:expose class ProjectAccess
{
	private static var plugin:Map<String,String>;

    public static function main()
    {
    	plugin = new Map();
    	plugin.set("name","misterpah ProjectAccess"); 
    	plugin.set("filename","plugin.misterpah.ProjectAccess.js");
    	plugin.set("feature","Open Project"); // 
    	plugin.set("listen_event","core_project_openProject,core_project_closeProject"); // events listened by this plugin
    	plugin.set("trigger_event",""); // events triggered by this plugin
    	plugin.set("version","0.1");
    	plugin.set("required",""); // other file required by this plugin

    	
        new JQuery(js.Browser.document).on(plugin.get('filename')+'.init',init);
    	Utils.register_plugin(plugin);
        
    }

    public static function init()
    {
        trace(plugin.get("filename")+" started");
    	create_ui();
        register_hooks();    	
    }

	public static function create_ui()
	{
	}


	public static function register_hooks()
	{
        new JQuery(js.Browser.document).on("core_project_openProject",open_project);
        new JQuery(js.Browser.document).on("core_project_closeProject",close_project);        
        new JQuery(js.Browser.document).on("plugin_misterpah_projectAccess_openProject_handler",openFileHandler);        
	}

    private static function open_project()
    {
        new ui.FileDialog("plugin_misterpah_projectAccess_openProject_handler");
    }


    private static function openFileHandler(event,path:String):Void
    {
        Main.session.project_xml = path;
        Utils.system_parse_project();
        trace(Main.session);
        //new JQuery(js.Browser.document).triggerHandler("plugin_misterpah_projectAccess_openProject_complete");
    }


    private static function close_project()
    {
        //var path = Main.session.get("active_file");
        //Main.opened_file_stack.remove(path);
        //Main.session.set("active_file",""); // remove active in editor
        //new JQuery(js.Browser.document).triggerHandler("plugin_misterpah_fileAccess_closeFile_complete");
    }
  
}