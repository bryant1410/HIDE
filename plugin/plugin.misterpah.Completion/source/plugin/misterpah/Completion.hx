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
		Utils.loadJavascript(plugin_path +"/jquery.xml2json.js");
		register_listener();
	}

	static public function register_listener():Void
	{
		Main.message.listen("plugin.misterpah.Completion:static_completion","plugin.misterpah.Completion",static_completion,null);
		Main.message.listen("plugin.misterpah.Completion:dynamic_completion","plugin.misterpah.Completion",dynamic_completion,null);
    }
		
	static public function dynamic_completion():Void
		{
		Utils.system_get_completion(untyped sessionStorage.cursor_index,function(stderr){build_completion(stderr,'dynamic');});
		}
		
	static public function static_completion():Void
		{
		trace("check for static completion");
		var find_completion = untyped sessionStorage.find_completion;
		var file = "";
		
		if(Utils.fs.existsSync(Main.session.project_folder  + Utils.path.sep + "completion") == false)
			{
			untyped make_dir(Main.session.project_folder + Utils.path.sep + "completion");
			}
		
		
		var file_exists = Utils.fs.existsSync(Main.session.project_folder + Utils.path.sep + "completion" + Utils.path.sep +find_completion+".completion");
		if (file_exists)
			{
			trace("static completion found");
			trace("fetching static completion");
			file = Utils.system_openFile(Main.session.project_folder + Utils.path.sep + "completion" + Utils.path.sep +find_completion+".completion");
			untyped sessionStorage.static_completion = untyped file;
			trace("fetching completed");
			trace("invoke display completion");
			Main.message.broadcast("plugin.misterpah.Completion:static_completion.complete","plugin.misterpah.Completion");			
			}
		else
			{
			trace("no static completion found");
			trace("Generating static completion.");
			Utils.system_get_completion(untyped sessionStorage.cursor_index,function(stderr){build_completion(stderr,'static');});
			}
		}
		
		
		
	static public function build_completion(data:String,completion_type:String = "static"):Void
		{
        var completion_array:Dynamic = untyped $.xml2json(data);
        var completion_list = new Array();
        var compile_completion = new Array();
        if (completion_type == "static")
        	{
			if (Std.is(completion_array,String))
		    	{
		    	var single_completion = new Array();
		    	single_completion.push("--single completion--");
		        single_completion.push(completion_array);
		    	
		    	for (each in 0...single_completion.length)
		    		{
		    		var cur_item = new Array();
		    		cur_item.push(single_completion[each]);
		    		compile_completion.push(cur_item);
		    		}		        
		        
		        //wrap_single_completion.push(single_completion);
		        untyped sessionStorage.build_completion = untyped JSON.stringify(compile_completion);
		        save_completion();
		        }
		    else
		        {
		        for (each in 0...completion_array.i.length)
		        	{
		        	var cur_item = new Array();
		        	cur_item.push(completion_array.i[each].n);
		        	compile_completion.push(cur_item);
		        	}
		        untyped sessionStorage.build_completion = untyped JSON.stringify(compile_completion);
				//Main.message.broadcast("plugin.misterpah.Editor:build_completion.complete","plugin.misterpah.Editor");
				save_completion();
				//return untyped sessionStorage.build_completion;
		        }        
		    }
		else if (completion_type == "dynamic")
			{
			untyped sessionStorage.static_completion = untyped JSON.stringify(completion_array);
			trace(untyped sessionStorage.static_completion);
			Main.message.broadcast("plugin.misterpah.Editor:build_completion.complete.dynamic","plugin.misterpah.Editor");
			}
		}
	

	static public function save_completion():Void
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

}
