package plugin.sample;

import jQuery.*;

// This is the recommended minimum structure of a HIDE plugin

@:keepSub @:expose class Dummy
{
	private static var plugin:Map<String,String>;

    public static function main()
    {
    	plugin = new Map();
    	plugin.set("name","Dummy Plugin"); 
    	plugin.set("filename","plugin.sample.Dummy.js");
    	plugin.set("feature",""); // 
    	plugin.set("listen_event",""); // events listened by this plugin
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
	}
}