package plugin.misterpah;
import jQuery.*;
import js.Browser;
import ui.*;
import Utils;

class ProjectAccess
{
	public var plugin_name:String = "Misterpah ProjectAccess";
	public var plugin_type:String = "Project Access";
	public var plugin_version:String = "1.0";


	public function new()
	{
		//create_ui();
		register_hooks();
	}



	public function register_hooks()
	{
		//new JQuery(js.Browser.document).on("core_file_newFile",new_file);
		new JQuery(js.Browser.document).on("core_project_openProject",open_project);
		new JQuery(js.Browser.document).on("core_project_closeProject",close_project);
		/*
		new JQuery(js.Browser.document).on("plugin_misterpah_projectAccess_completion",function(event,data){
			project_completion(data);
			});
		*/
		//ew JQuery(js.Browser.document).on("core_file_save",save_file);
		//new JQuery(js.Browser.document).on("core_utils_parseProject_complete",close_project);
	}


	private function open_project()
	{
		new ui.FileDialog(openFileHandler);
	}


	private function openFileHandler(path:String):Void
	{
		Main.session['project_xml'] = path;
		Utils.system_parse_project();
		trace(Main.session);
		//new JQuery(js.Browser.document).triggerHandler("plugin_misterpah_projectAccess_openProject_complete");
	}


	private function close_project()
	{
		//var path = Main.session.get("active_file");
		//Main.opened_file_stack.remove(path);
		//Main.session.set("active_file",""); // remove active in editor
		//new JQuery(js.Browser.document).triggerHandler("plugin_misterpah_fileAccess_closeFile_complete");
	}
}