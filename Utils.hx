package ;

import jQuery.JQuery;
import js.Browser;
import js.Node;

/**
 * ...
 * @author AS3Boyan
 */
class Utils
{
	public static var os = Node.require('os');
	public static var fs:js.Node.NodeFS = Node.require("fs");
	public static var path = Node.require("path");
	public static var exec = Node.require('child_process').exec;
	public static var sys = Node.require('sys');
	public static var nwworkingdir:String;

	public function new() 
	{
		
	}
	
	public static function getOS():String
	{
		var os_type:String = os.type();
		
		switch(os_type)
        {
			case "Windows_NT":
				os_type = 'windows';
			case "Linux":
				os_type = 'linux';
        }
		
		return os_type;
    }
	
	public static function capitalize(myString:String)
	{
		return myString.substr(0, 1) + myString.substr(1);
	}
	
	public static function system_openFile(filename)
    {
		return fs.readFileSync(filename,"utf-8");
    }
    
	public static function system_createFile(filename)
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
		
		if (Utils.getOS() == 'windows') {exec_str = "cd /D "+new JQuery('#projectFile').html()+" & openfl display -hxml flash";}
		if (Utils.getOS() == 'linux') { exec_str = "cd " + new JQuery('#projectFile').html() + " ; openfl display -hxml flash"; }
		
		Utils.exec(exec_str,
			function(error, stdout:String,stderr:String){
				var the_error = false;
				if (stderr != "") {the_error = true;}
				if (the_error == true){
					IDE.ide_alert("error","not a valid HaxeFlixel Project File (XML)");
					}
				if (the_error == false) {
					new JQuery('#projectContent').html(stdout);
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
					new JQuery('#projectContent').html(content_push.join(' '));   
					new JQuery(Browser.document).trigger("system_parse_project_complete");
				} // stdout != ""
			});
	
	}
}