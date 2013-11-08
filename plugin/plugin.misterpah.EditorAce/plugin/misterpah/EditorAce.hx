package plugin.misterpah;

import jQuery.*;

// This is the recommended minimum structure of a HIDE plugin

@:keepSub @:expose class EditorAce
{
	private static var plugin:Map<String,String>;

    private static var editor:Dynamic;

    public static function main()
    {
    	plugin = new Map();
    	plugin.set("name","Ace Editor"); 
    	plugin.set("filename","plugin.misterpah.EditorAce.js");
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

        Utils.loadJavascript("./plugin/support_files/plugin.misterpah/ace/ace.js");
        Utils.loadCss("./plugin/support_files/plugin.misterpah/ace/css/plugin.misterpah.EditorAce.css");

    	create_ui();
        register_hooks();    	
    }

	public static function create_ui()
	{
        new JQuery("#editor_position").append("<div style='margin-top:10px;' id='misterpah_editorAce_tabs_position'><ul class='nav nav-tabs'></ul></div>");
        new JQuery("#editor_position").append("<div id='misterpah_editorAce_editor'></div>");
        editor = untyped ace.edit("misterpah_editorAce_editor");
	}

	public static function register_hooks()
	{
	}
}