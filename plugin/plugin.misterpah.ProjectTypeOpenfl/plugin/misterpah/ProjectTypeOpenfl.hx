package plugin.misterpah;

import jQuery.*;

// This is the recommended minimum structure of a HIDE plugin

@:keepSub @:expose class ProjectTypeOpenfl
{
	private static var plugin:Map<String,String>;

    public static function main()
    {
    	plugin = new Map();
    	plugin.set("name","Project Type OpenFL"); 
    	plugin.set("filename","plugin.misterpah.ProjectTypeOpenfl.js");
    	plugin.set("feature",""); // 
    	plugin.set("listen_event",""); // events listened by this plugin
    	plugin.set("trigger_event","core_project_registerNewTypeProject"); // events triggered by this plugin
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
        var parameter:Map<String,String> = new Map();
        // parameter 1 is Project Type's name

        parameter.set("plugin_name","OpenFL");
        parameter.set("plugin_description","OpenFL is a software development kit that provides an environment for building fast, native games and applications for iOS, Android, BlackBerry, Windows, Mac, Linux, Flash and HTML5.");
        parameter.set("plugin_help","change project_name to your project name.");
        parameter.set("plugin_image","./plugin/support_files/plugin.misterpah/img/openfl.png");
        parameter.set("plugin_execute","openfl create project");
        parameter.set("plugin_extraParam","project_name");

        var parameter_wrap = new Array();
        parameter_wrap.push(parameter);        

        //trace(parameter_wrap);

        new JQuery(js.Browser.document).triggerHandler("core_project_registerNewTypeProject",parameter_wrap);   // why wrap? it's much simpler to get the data later
	}
}