package plugin.misterpah;
import jQuery.*;
import js.Browser;
import ui.*;
import Utils;

class FileAccess
{
	public var plugin_name:String = "Misterpah FileAccess";
	public var plugin_type:String = "File Access";
	public var plugin_version:String = "1.0";


	public function new()
	{
		//create_ui();
		register_hooks();
	}



	public function register_hooks()
	{
		new JQuery(js.Browser.document).on("core_file_newFile",new_file);
		new JQuery(js.Browser.document).on("core_file_openFile",open_file);
		new JQuery(js.Browser.document).on("core_file_save",save_file);
		new JQuery(js.Browser.document).on("core_file_close",close_file);
	}


	private function new_file()
	{
		trace("new_file bebeh");
	}


	private function open_file()
	{
		new ui.FileDialog(openFileHandler);
	}


	private function openFileHandler(path:String):Void
	{
		if (Main.opened_file_stack[path] == null)
		{
			var content = Utils.system_openFile(path);
			var fileObj = new Map();
			fileObj.set("content",content);

			var filename_split = path.split(Utils.path.sep);
			var className = filename_split[filename_split.length-1].split('.')[0];

			fileObj.set("className",className);
			Main.opened_file_stack.set(path,fileObj);
			Main.session.set("active_file",path);

			new JQuery(js.Browser.document).triggerHandler("plugin_misterpah_fileAccess_openFile_complete");
		}
	}

	private function save_file()
	{
		var path = Main.session.get("active_file");
		var file_obj = Main.opened_file_stack[path];
		//trace(path);
		//trace(file_obj['content']);
		Utils.system_saveFile(path,file_obj['content']);
	}

	private function close_file()
	{
		var path = Main.session.get("active_file");
		Main.opened_file_stack.remove(path);
		//Main.session.set("active_file",""); // remove active in editor
		new JQuery(js.Browser.document).triggerHandler("plugin_misterpah_fileAccess_closeFile_complete");
	}
}