package;

import jQuery.*;
import js.Browser;
import js.Node;
import core.ui.*;

@:keep @:expose class Utils
{
	public static var os = Node.os;
	public static var fs:js.Node.NodeFS = Node.fs;
	public static var path = Node.path;
	public static var exec = Node.childProcess.exec;
	public static var sys = Node.require('sys');
	public static var nwworkingdir:String;
	
	public static var gui = Node.require("nw.gui");
	public static var window:Dynamic = gui.Window.get();
	
	public inline static var WINDOWS:Int = 0;
	public inline static var LINUX:Int = 1;
	public inline static var OTHER:Int = 2;

	public static function getOS():Int
	{
		var os_type:Int = null;
		switch(os.type())
        {
			case "Windows_NT":
				os_type = WINDOWS;
			case "Linux":
				os_type = LINUX;
			case _:
				os_type = OTHER;
        }
		return os_type;
    }	
	
	/*
	public static function plugin_path(className:Dynamic):String
	{
		return "../plugin/" + Type.getClassName(className) +"/bin";
	}
	*/	

	public static function repair_path(path:String):String
	{
		//trace(os.type());
		if (getOS() == WINDOWS)
		{
			path = StringTools.replace(path,"\\", "\\\\");		
		}
		else
		{
			//path = path;		
		}
		//trace(path);
		return path;
	}
	
    private static function system_dirContent(path:String):Array<String>
    {
    	return fs.readdirSync(path);
    }

	/*
    public static function register_plugin(plugin_credentials:Map<String,String>)
    {
 		//new JQuery(js.Browser.document).triggerHandler("core_register_plugin",[plugin_credentials]);
		Main.message.broadcast("utils","register_plugin().complete");
    }
    */


    public static function list_plugin():Array<String>
    {
    	var returnList = new Array<String>();
    	var list = Utils.system_dirContent("../plugin");
    	for (each in list)
		{
			if (each.indexOf("plugin") == 0)
			{
				returnList.push(each);
			}
		}
    	return returnList;
    }


    // needed because STATIC wont generate/call unused HX
    public static function init_ui()
    {
    	new ui.Notify();
		new ui.FileDialog();
    	new ui.ModalDialog();
    }

	
	public static function capitalize(myString:String):String
	{
		return myString.substr(0, 1) + myString.substr(1);
	}
	
	
	public static function system_openFile(filename:String):String
    {
		var ret = fs.readFileSync(filename,"utf-8");
		return ret;
    }
    
	public static function system_createFile(filename:String):Void
	{
		fs.openSync(filename,"a+");
	}

	public static function system_saveFile(filename:String, content:String):Void
    {
		fs.writeFileSync(filename, content);
		trace("SYSTEM: file saved "+filename);
    }
    

	public static function loadJavascript(script:String):Void
	{
		JQueryStatic.ajaxSetup({async:false});
		JQueryStatic.getScript(script);
		JQueryStatic.ajaxSetup({async:true});
	}

	public static function loadCss(css:String):Void
	{
		new JQuery("head").append("<link rel='stylesheet' type='text/css' href='"+css+"'/>");
	}
    
    
	public static function system_get_HIDE_path()
	{
		var location = untyped js.Browser.window.location.pathname;
		//trace(StringTools.startsWith(location,Utils.path.sep));
		return location;
	}


	public static function system_get_completion(position:Int,callback:Dynamic)
	{
		var exec_str = "";
		var join_str = "";
		var join_str_cd = "";

		var path = Main.session.active_file;

		if (getOS() == LINUX)
		{
			join_str = " ; ";
			join_str_cd = "";
		}
		if (getOS() == WINDOWS)
		{
			join_str = " & ";
			join_str_cd = " /D ";
		}		

		var exec_str = "cd " + join_str_cd +'"' + Main.session.project_folder+'"' + join_str + "haxe --connect 30003 "+ Main.session.project_xml_parameter + " --display " +'"'+ path +'"'+ "@"+ position;
		trace("fetching completion.");
		return Utils.exec(exec_str,
			{},
			function(error, stdout:String, stderr:String)
			{
				//trace(error);trace(stdout);trace(stderr);
				if (error == null)
				{
					trace("completion found.");
					callback(stderr);
				}
				
			});
		
	}	


	public static function system_create_project(exec_str:String)
	{
		var join_str = "";
		var join_str_cd = "";
		var default_folder = "";

		switch (Utils.getOS()) 
		{
			case Utils.LINUX:
				join_str = " ; ";
				join_str_cd = "";
				default_folder = "~/HIDE";
			case Utils.WINDOWS:
				join_str = " & ";
				join_str_cd = " /D ";
				default_folder = "C:/HIDE";
			default:
				
		}		

		Utils.exec("cd "+ join_str_cd + default_folder + join_str + exec_str, {}, function (error,stdout,stderr)
			{
				//trace(error);
				//trace(stdout);
				//trace(stderr);
			});
	}




	public static function system_parse_project()
    {
		var exec_str = "";

		var filename = Main.session.project_xml;

		var temp = filename.split(".");
		var filename_ext = temp.pop();



	    var projectFolder = filename.split(path.sep);
	    projectFolder.pop();
	    Main.session.project_folder = projectFolder.join(path.sep);		
		if (filename_ext == "xml")
		{
			switch (Utils.getOS()) 
			{
				case Utils.WINDOWS:
					exec_str = "cd /D " + '"'+ Main.session.project_folder +'"'+" & lime display -hxml flash";
				case Utils.LINUX:
					exec_str = "cd " +'"'+ Main.session.project_folder +'"'+ " ; lime display -hxml flash";
				default:
					
			}
		}
		else if (filename_ext == "hxml")
		{
			switch (Utils.getOS()) 
			{
				case Utils.WINDOWS:
					exec_str = "cd /D "+'"'+ Main.session.project_folder +'"'+" & type "+'"'+ filename+'"';
				case Utils.LINUX:
					exec_str = "cd " +'"'+ Main.session.project_folder +'"'+ " ; cat "+'"'+filename+'"';
				default:
					
			}							
		}
		trace(exec_str);

		Utils.exec(exec_str,
			{},
			function(error, stdout:String,stderr:String){
				
				var the_error = false;
				if (stderr != "") {the_error = true;}
				if (the_error == true)
				{
					trace(error);trace(stdout);trace(stderr);
					var notify = new ui.Notify();
					notify.type = "error";
					notify.content = "not a valid Haxe Project File ( XML / HXML )";
					notify.show();	
					Main.session.project_xml = "";					
				}
				else
				{
					//new JQuery('#projectContent').html(stdout);
					var content_push:Array<String> = new Array();
					var content:Array<String> = stdout.split("\n");
					var i = 0;
					for (i in 0...content.length)
					{
						var cur = content[i];
						
						for (arg in ['-lib', '-cp', '-main', '-D']) 
						{
							if (cur.indexOf(arg) == 0) // starts with
							{
								content_push.push(cur);
								break;
							}
						}                       
					}
			        Main.session.project_xml_parameter = content_push.join(' ');					
			        //trace(Main.session.project_xml_parameter);
					if (Main.session.project_xml_parameter != "")
					{
						Main.message.broadcast("core:utils.system_parse_project.complete","core:utils");
					}
				} // stdout != ""
			});
	
	}       

}
