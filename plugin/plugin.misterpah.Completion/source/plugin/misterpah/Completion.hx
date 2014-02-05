package plugin.misterpah;
import jQuery.*;
import js.Browser;

@:keep @:expose class Completion
{
    static public function main():Void
	{
		var plugin_path = ".."+Utils.path.sep+"plugin"+Utils.path.sep+ Type.getClassName(Completion) +Utils.path.sep+"bin";
		Utils.loadJavascript(plugin_path +"/regex.execAll.js");
		Utils.loadJavascript(plugin_path +"/mkdir.js");
		register_listener();
	}

	static public function register_listener():Void
	{
		Main.message.listen("plugin.misterpah.Editor:handle_getCompletion_complete.build_complete","plugin.misterpah.Completion",build_completion,null);
		Main.message.listen("plugin.misterpah.Completion:static_completion","plugin.misterpah.Completion",static_completion,null);
	}
		
	static public function static_completion():Void
		{
		trace("dumb completion");
		var find_completion = untyped sessionStorage.find_completion;
		var file = "";
		
		if(Utils.fs.existsSync(Main.session.project_folder + Utils.path.sep + "completion") == false)
			{
			untyped make_dir(Main.session.project_folder + Utils.path.sep + "completion");
			}
		
		
		var file_exists = Utils.fs.existsSync(Main.session.project_folder + Utils.path.sep + "completion" + Utils.path.sep +find_completion+".completion");
		if (file_exists)
			{
			file = Utils.system_openFile(Main.session.project_folder + Utils.path.sep + "completion" + Utils.path.sep +find_completion+".completion");
			untyped sessionStorage.static_completion = untyped file;
			Main.message.broadcast("plugin.misterpah.Completion:static_completion.complete","plugin.misterpah.Completion");			
			}
		else
			{
			trace(find_completion);
			trace("no static completion");
			Utils.system_get_completion(untyped sessionStorage.cursor_index);
			}
		}
	

	static public function build_completion():Void
		{
		trace("building completion");
		var find_completion = untyped sessionStorage.find_completion;
		var completion_content = untyped sessionStorage.build_completion;
		Utils.system_createFile(Main.session.project_folder + Utils.path.sep + "completion" + Utils.path.sep +find_completion+".completion");
		Utils.system_saveFile(Main.session.project_folder + Utils.path.sep + "completion" + Utils.path.sep +find_completion+".completion", completion_content);
		haxe.Timer.delay(function () {
			Main.message.broadcast("plugin.misterpah.Completion:static_completion","plugin.misterpah.Completion");
			}, 1000);
		
		}

	static public function depecrated_build_completion():Void
		{
		trace("build completion");
		var txt = Main.file_stack.find(Main.session.active_file)[1];
		var findVar = untyped regex_matchVar(txt);
		var findFunction = untyped regex_matchFunction(txt);
		var findClass = untyped regex_matchClass(txt);
		var findPackage = untyped regex_matchPackage(txt);
		var findImport = untyped regex_matchImport(txt);
		
		var package_name = findPackage[0][1];
		var class_name = untyped $.trim(findClass[0][1]);
		trace(package_name + "."+ class_name +".completion");
		var completion_file_content = untyped [];
		completion_file_content.push(findImport);
		completion_file_content.push(findPackage);
		completion_file_content.push(findClass);
		completion_file_content.push(findVar);
		completion_file_content.push(findFunction);
		var completion_content = untyped JSON.stringify(completion_file_content);
		trace(completion_content);
		//var a = untyped make_dir(Main.session.project_folder + Utils.path.sep + "completion");
		//trace(a);
		Utils.system_createFile(Main.session.project_folder + Utils.path.sep + "completion" + Utils.path.sep +package_name + "."+ class_name +".completion");
		Utils.system_saveFile(Main.session.project_folder + Utils.path.sep + "completion" + Utils.path.sep +package_name + "."+ class_name +".completion" ,completion_content);
		}
}
