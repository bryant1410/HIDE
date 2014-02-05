package;
import haxe.Timer;
import core.*;

class PluginData
{
	public var actualName:String;
	public var author:String;
	public var configuration:Dynamic;
	public var dependency:Array<String>;
	public var name:String;
	public var website:String;
}

@:keep @:expose class Main 
{
	static public var session:Session;
	static public var message:Message;
	static public var file_stack:FileObject;
	
    static public var plugin_index:Array<String>;
    static public var plugin_package:Array<PluginData>;
    static public var default_plugin:Array<String>;
    static public var plugin_activated:Array<String>;
	
	// HIDE execution starts here.
	static public function main():Void
	{
		session = new Session();
		file_stack = new FileObject();
		message = new Message();
		plugin_index = new Array();
		plugin_package = new Array();
		plugin_activated = new Array();	
		//Utils.gui.Window.get().showDevTools();
		Utils.gui.Window.get();
		Utils.init_ui();
		//var a = new ui.Menu("Test");
		//a.addItem("menu item","utils,haha():complete");
		//a.addSeperator();
		//a.show();
		new menu.FileMenu();
		new menu.HelpMenu();
		//new menu.EditMenu();
		//new menu.CompileMenu();
		
		plugin_index = Utils.list_plugin();
		checkPluginPackage();
		executePlugin();
	}
	
	
	
	// package.json in each plugin folder will describe the plugin to HIDE.
	static private function checkPluginPackage():Void
	{
		for (i in 0...plugin_index.length)
		{
			var package_json_content = Utils.system_openFile("../plugin/" + plugin_index[i] + "/bin/package.json");
			var package_json = JSON.parse(package_json_content);
			trace(package_json);
			plugin_package.push(package_json);
		}
	}
		
	// handles all the dependencies, loading. 
	static private function executePlugin():Void
	{
		var pending_plugin = new Array();
		for (each in plugin_package)
		{
			//trace(each.actualName);
			//trace(each.dependency);
			if (each.dependency.length == 0)
			{
				Utils.loadJavascript("../plugin/"+each.actualName+"/bin/plugin.js");
				plugin_activated.push(each.actualName);
				trace ("execute "+each.actualName);
			}
			else
			{
				pending_plugin.push(each);
			}
		}
		
		while (pending_plugin.length > 0)
		{
			var current_pending_plugin = pending_plugin.shift();
			var loaded:Array<Int> = new Array();
			var depends:Array<String> = current_pending_plugin.dependency;
			
			for (each in depends)
			{
				var position = Lambda.indexOf(plugin_activated, each);
				loaded.push(position);
			}
				
				
			// if -1 is returned, it means there are no unloaded plugin
			var all_dependency_loaded = Lambda.indexOf(loaded, -1);
			
			
			if (all_dependency_loaded != -1)
			{
				// there are one or more dependencies not loaded
				pending_plugin.push(current_pending_plugin);
			}
			else
			{
				Utils.loadJavascript("../plugin/"+current_pending_plugin.actualName+"/bin/plugin.js");
				plugin_activated.push(current_pending_plugin.actualName);
				trace ("execute "+current_pending_plugin.actualName);
			}
		}
			// end while
	}
}
