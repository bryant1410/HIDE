package ;

import jQuery.JQuery;
import js.Browser;
import js.Node;
import ui.*;
/**
 * ...
 * @author AS3Boyan
 */
class Utils
{
	public static var os = Node.require('os');
	public static var fs:js.Node.NodeFS = Node.require("fs");
	public static var path:js.Node.NodePath = Node.require("path");
	public static var exec = Node.require('child_process').exec;
	public static var sys = Node.require('sys');
	public static var nwworkingdir:String;
	
	public static var gui = Node.require("nw.gui");
	public static var window:Dynamic = gui.Window.get();
	
	inline public static var WINDOWS:Int = 0;
	inline public static var LINUX:Int = 1;
	inline public static var OTHER:Int = 2;

	public function new() 
	{
		
	}
	
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
	
	public static function toggleFullscreen():Void
	{
		Utils.window.toggleFullscreen();
	}
	
	public static function zoomIn():Void
	{
		Utils.window.zoomLevel = Utils.window.zoomLevel + 1;
	}
	
	public static function zoomOut():Void
	{
		Utils.window.zoomLevel = Utils.window.zoomLevel - 1;
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
		fs.openSync(filename,"wx");
	}

	public static function system_saveFile(filename, content)
    {
		fs.writeFileSync(filename, content);
		trace("SYSTEM: file saved "+filename);
    }
    
	public static function system_parse_project()
    {
		var exec_str = "";

		var filename = Main.session.current_project_xml;
	    var projectFolder = filename.split(path.sep);
	    projectFolder.pop();
	    //trace(projectFolder);
	    Main.session.current_project_folder = projectFolder.join(path.sep);		
		
		if (Utils.getOS() == Utils.WINDOWS) {exec_str = "cd /D "+ Main.session.current_project_folder +" & openfl display -hxml flash";}
		if (Utils.getOS() == Utils.LINUX) { exec_str = "cd " + Main.session.current_project_folder + " ; openfl display -hxml flash"; }
		trace(exec_str);

		Utils.exec(exec_str,
			function(error, stdout:String,stderr:String){
				var the_error = false;
				if (stderr != "") {the_error = true;}
				if (the_error == true){
					//IDE.ide_alert("error","not a valid HaxeFlixel Project File (XML)");
					var notify = new Notify();
					notify.type = "error";
					notify.content = "not a valid HaxeFlixel Project File (XML)";
					notify.show();						
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
			        Main.session.current_project_xml_parameter = content_push.join(' ');					
			        trace(Main.session.current_project_xml_parameter);
					//new JQuery('#projectContent').html(content_push.join(' '));   
					new JQuery(Browser.document).trigger("projectAccess_parseProject_complete");
				} // stdout != ""
			});
	
	}
}