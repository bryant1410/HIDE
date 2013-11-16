package plugin.misterpah;

import jQuery.*;
import js.html.KeyboardEvent;  

// This is the recommended minimum structure of a HIDE plugin

@:keepSub @:expose class BuildHxml
{
	private static var plugin:Map<String,String>;

    public static function main()
    {
    	plugin = new Map();
    	plugin.set("name","Build HXML"); 
    	plugin.set("filename","plugin.misterpah.BuildHxml.js");
    	plugin.set("feature","Build HXML"); // 
    	plugin.set("listen_event","plugin_misterpah_BuildHxml"); // events listened by this plugin
    	plugin.set("trigger_event","plugin_misterpah_BuildHxml"); // events triggered by this plugin
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
        Main.compilemenu.addMenuItem("to Project configuration", "plugin_misterpah_BuildHxml", null, "F8");
	}


	public static function register_hooks()
	{
      new JQuery(js.Browser.document).on("plugin_misterpah_BuildHxml",hook_BuildHxml);
      
      js.Browser.window.addEventListener("keyup", function (e:KeyboardEvent){
        // F8
        if (e.keyCode == 119) 
        {
          hook_BuildHxml('','');
        }
      });
	}
  
  
  	private static function hook_BuildHxml(event,data)
    {
      //trace("seek project configuration");
      var filename = Main.session.project_xml;
      var filename_split = filename.split(".");
      var ext = filename_split.pop();
      var join_str = '';
      var join_str_cd = '';
      if (ext == "hxml")
      {
        trace("hxml");
		if (Utils.getOS() == Utils.LINUX)
			{
			join_str = " ; ";
			join_str_cd = "";
			}
		if (Utils.getOS() == Utils.WINDOWS)
			{
			join_str = " & ";
			join_str_cd = " /D ";
			}		

		var exec_str = "cd " + join_str_cd + Main.session.project_folder+join_str + "haxe " + filename;
        Utils.exec(exec_str,function(error,stdout,stderr){ trace(error); trace(stdout); trace(stderr); });
      }
      else
      {
        trace("BuildHxml plugin only build HXML Project.");
        if (ext == "")
          {
            var notify = new ui.Notify();
            notify.type = "error";
            notify.content = "No project loaded !";
            notify.show();
          }
        else
          {
            var notify = new ui.Notify();
            notify.type = "error";
            notify.content = "BuildHxml plugin only build HXML Project.";
            notify.show();                    
          }
      }
    }
}