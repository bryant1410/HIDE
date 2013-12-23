package;

import jQuery.*;
import js.Browser;
import js.Node;
import core.ui.*;

@:keep @:expose class Utils
{
	public static var os = Node.require('os');
	public static var fs:js.Node.NodeFS = Node.require("fs");
	public static var path = Node.require("path");
	public static var exec = Node.require('child_process').exec;
	public static var sys = Node.require('sys');
	public static var nwworkingdir:String;
	
	public static var gui = Node.require("nw.gui");
	public static var window:Dynamic = gui.Window.get();
	
	public static var WINDOWS:Int = 0;
	public static var LINUX:Int = 1;
	public static var OTHER:Int = 2;

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

    private static function system_dirContent(path:String)
    {
    	return fs.readdirSync(path);
    }

    public static function register_plugin(plugin_credentials:Map<String,String>)
    {
 		//new JQuery(js.Browser.document).triggerHandler("core_register_plugin",[plugin_credentials]);
		Main.message.broadcast("utils","register_plugin().complete");
    }


    public static function list_plugin()
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

	
	public static function capitalize(myString:String)
	{
		return myString.substr(0, 1) + myString.substr(1);
	}
	
	public static function system_openFile(filename:String)
    {
		return fs.readFileSync(filename,"utf-8");
    }
    
	public static function system_createFile(filename:String)
	{
		fs.openSync(filename,"a+");
	}

	public static function system_saveFile(filename, content)
    {
		fs.writeFileSync(filename, content);
		trace("SYSTEM: file saved "+filename);
    }
    

	public static function loadJavascript(script:String)
	{
		JQueryStatic.ajaxSetup({async:false});
		JQueryStatic.getScript(script);
		JQueryStatic.ajaxSetup({async:true});
	}

	public static function loadCss(css)
	{
		new JQuery("head").append("<link rel='stylesheet' type='text/css' href='"+css+"'/>");
	}
    
    
	public static function system_get_HIDE_path()
		{
			var location = untyped js.Browser.window.location.pathname;
			trace(StringTools.startsWith(location,Utils.path.sep));
			return location;
			
		}
		
    public static function system_get_hxparse()
    {
		/*
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

		var exec_str = "cd " + join_str_cd + Main.session.project_folder+join_str + "haxe "+ Main.session.project_xml_parameter + " --display " + path + "@"+ position;

		//trace(exec_str);

		Utils.exec(exec_str,
			function(error,stdout:String,stderr:String){
				//trace (error);
				//trace (stdout);
				//trace (stderr);
				//var the_error = false;
				//if (stderr != ""){the_error = true;}
				if (error == null)
					{
					//new JQuery(Browser.document).triggerHandler("core:utils.getCompletion_complete",[stderr]);
					Main.message.broadcast("utils","system_get_hxparse().complete");
					}
				
				});

		*/
    }

	public static function system_get_completion(position:Int)
	{
		var exec_str = "";
		var join_str = "";
		var join_str_cd = "";

		var path = Main.session.active_file;
		//var file_obj = Main.file_stack.find(path);

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

		var exec_str = "cd " + join_str_cd + Main.session.project_folder+join_str + "haxe "+ Main.session.project_xml_parameter + " --display " + path + "@"+ position;

		//trace(exec_str);

		Utils.exec(exec_str,
			function(error,stdout:String,stderr:String){
				//trace (error);
				//trace (stdout);
				//trace (stderr);
				//var the_error = false;
				//if (stderr != ""){the_error = true;}
				if (error == null)
					{
					//Main.message.broadcast("core:utils.system_get_completion.complete","core");
					new JQuery(Browser.document).triggerHandler("core:utils.system_get_completion.complete",[stderr]);
					}
				
				});

	}


	public static function system_create_project(exec_str:String)
	{
		var join_str = "";
		var join_str_cd = "";
		var default_folder = "";

		if (getOS() == LINUX)
			{
			join_str = " ; ";
			join_str_cd = "";
			default_folder = "~/HIDE";
			}
		if (getOS() == WINDOWS)
			{
			join_str = " & ";
			join_str_cd = " /D ";
			default_folder = "C:/HIDE";
			}		

		Utils.exec("cd "+ join_str_cd + default_folder + join_str + exec_str, function (error,stdout,stderr)
			{
				//trace(error);
				//trace(stdout);
				//trace(stderr);
			});
	}


	public static function system_compile_flash()
	{
		var join_str = "";
		var join_str_cd = "";
		var default_folder = "";

		if (getOS() == LINUX)
			{
			join_str = " ; ";
			join_str_cd = "";
			default_folder = "~/HIDE";
			}
		if (getOS() == WINDOWS)
			{
			join_str = " & ";
			join_str_cd = " /D ";
			default_folder = "C:/HIDE";
			}		

		var exec_str = "openfl test flash";
		Utils.exec("cd "+ join_str_cd + Main.session.project_folder + join_str + exec_str, function (error,stdout,stderr)
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
	    //trace(projectFolder);
	    Main.session.project_folder = projectFolder.join(path.sep);		
		if (filename_ext == "xml")
			{
			if (Utils.getOS() == Utils.WINDOWS) {exec_str = "cd /D "+ Main.session.project_folder +" & openfl display -hxml flash";}
			if (Utils.getOS() == Utils.LINUX) { exec_str = "cd " + Main.session.project_folder + " ; openfl display -hxml flash"; }			
			}
		if (filename_ext == "hxml")
			{
			if (Utils.getOS() == Utils.WINDOWS) {exec_str = "cd /D "+ Main.session.project_folder +" & type "+ filename;}
			if (Utils.getOS() == Utils.LINUX) { exec_str = "cd " + Main.session.project_folder + " ; cat "+filename; }							
			}
		trace(exec_str);

		Utils.exec(exec_str,
			function(error, stdout:String,stderr:String){
				var the_error = false;
				if (stderr != "") {the_error = true;}
				if (the_error == true){
					var notify = new ui.Notify();
					notify.type = "error";
					notify.content = "not a valid Haxe Project File ( XML / HXML )";
					notify.show();	
					Main.session.project_xml = "";					
					}
				if (the_error == false) {
					//new JQuery('#projectContent').html(stdout);
					var content_push:Array<String> = new Array();
					var content:Array<String> = stdout.split("\n");
					var i = 0;
					for (i in 0...content.length)
						{
						var cur = content[i];
						if (cur.indexOf('-lib') == 0) // starts with
							{
							content_push.push(cur);
							}
						else if (cur.indexOf('-cp') == 0) 
							{
							content_push.push(cur);
							}
						else if (cur.indexOf('-main') == 0) 
							{
							content_push.push(cur);
							}                        
						else if (cur.indexOf('-D') == 0) 
							{
							content_push.push(cur);
							}                        
						}
			        Main.session.project_xml_parameter = content_push.join(' ');					
			        trace(Main.session.project_xml_parameter);
					//new JQuery('#projectContent').html(content_push.join(' '));   
					//new JQuery(Browser.document).triggerHandler("core_utils_parseProject_complete");
					Main.message.broadcast("utils","system_parse_project().complete");
				} // stdout != ""
			});
	
	}    

}