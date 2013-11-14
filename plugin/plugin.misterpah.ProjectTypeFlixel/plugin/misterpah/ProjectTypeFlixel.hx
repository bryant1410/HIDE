package plugin.misterpah;

import jQuery.*;

// This is the recommended minimum structure of a HIDE plugin

@:keepSub @:expose class ProjectTypeFlixel
{
	private static var plugin:Map<String,String>;

    public static function main()
    {
    	plugin = new Map();
    	plugin.set("name","Project Type Flixel"); 
    	plugin.set("filename","plugin.misterpah.ProjectTypeFlixel.js");
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

        parameter.set("plugin_name","Flixel");
        parameter.set("plugin_description","HaxeFlixel is a 2D game framework built with OpenFL and Haxe that delivers cross platform games, completely free for personal and commercial use.");
        parameter.set("plugin_help","change <i>project_name</i> in <b>optional parameter</b> to your project name.");
        parameter.set("plugin_image","./plugin/support_files/plugin.misterpah/img/flixel.png");
        parameter.set("plugin_execute","haxelib run flixel new");
        parameter.set("plugin_extraParam","-name project_name");

        var parameter_wrap = new Array();
        parameter_wrap.push(parameter);        

        //trace(parameter_wrap);

        new JQuery(js.Browser.document).triggerHandler("core_project_registerNewTypeProject",parameter_wrap);   // why wrap? it's much simpler to get the data later
	}
}