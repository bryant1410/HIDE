package plugin.misterpah;
import jQuery.*;
import js.Browser;

@:keep @:expose class Compiler
{
    static public function main():Void
    {
		register_listener();
    }

	static public function register_listener():Void
	{
		Main.message.listen("plugin.misterpah.ProjectTree:compile_Hxml","plugin.misterpah.Compiler",compile_native_hxml,null);
		Main.message.listen("plugin.misterpah.ProjectTree:compile_Flash","plugin.misterpah.Compiler",compile_flash_lime,null);
		Main.message.listen("plugin.misterpah.ProjectTree:compile_Neko","plugin.misterpah.Compiler",compile_neko_lime,null);
		Main.message.listen("plugin.misterpah.ProjectTree:compile_Html5","plugin.misterpah.Compiler",compile_html5_lime,null);
		Main.message.listen("plugin.misterpah.ProjectTree:compile_Android","plugin.misterpah.Compiler",compile_android_lime,null);		
	}
	
	static public function compile_native_hxml():Void
	{
		trace("compiling to Native (Hxml)");
		
		var exec_str = "";
		if (Utils.getOS() == Utils.WINDOWS) {exec_str = "cd /D "+ "'"+ Main.session.project_folder+"'" +" & haxe "+ "'"+ Main.session.project_xml +"'";}
		if (Utils.getOS() == Utils.LINUX) { exec_str = "cd " +"'"+ Main.session.project_folder + "'"+ " ; haxe "+"'"+Main.session.project_xml+"'"; }			
		
		Utils.exec(exec_str, function (error,stdout,stderr)
			{
				if (stderr != "")
				{
					untyped localStorage.showError = "true";
					untyped localStorage.compile_error_status = stdout;
					untyped localStorage.compile_error_error = stderr;
					Utils.gui.Window.open("./console/console.html",{title:"HIDE console",position: 'center',toolbar:false,focus:true});
				}
				if (stderr == "")
				{
					untyped localStorage.showError = "false";
				}				
				trace(error);
				trace(stdout);
				trace(stderr);
			});	
	}
	
	static public function compile_flash_lime():Void
	{
	trace("compiling to Flash (Lime)");
	
	var exec_str="";
	if (Utils.getOS() == Utils.WINDOWS) {exec_str = "cd /D "+"'"+ Main.session.project_folder +"'"+" & lime test flash";}
	if (Utils.getOS() == Utils.LINUX) { exec_str = "cd " +"'"+ Main.session.project_folder +"'"+ " ; lime test flash"; }			
	
	Utils.exec(exec_str, function (error,stdout,stderr)
		{
			if (stderr != "")
			{
				untyped localStorage.showError = "true";
				untyped localStorage.compile_error_status = stdout;
				untyped localStorage.compile_error_error = stderr;
				Utils.gui.Window.open("./console/console.html",{title:"HIDE console",position: 'center',toolbar:false,focus:true});
			}
			if (stderr == "")
			{
				untyped localStorage.showError = "false";
			}
			trace(error);
			trace(stdout);
			trace(stderr);
		});		
	}
	
	
static public function compile_neko_lime():Void
	{
	trace("compiling to Neko (Lime)");
	
	var exec_str="";
	if (Utils.getOS() == Utils.WINDOWS) {exec_str = "cd /D "+"'"+ Main.session.project_folder +"'"+" & lime test neko";}
	if (Utils.getOS() == Utils.LINUX) { exec_str = "cd " +"'"+ Main.session.project_folder +"'"+ " ; lime test neko"; }			
	
	Utils.exec(exec_str, function (error,stdout,stderr)
		{
			if (stderr != "")
			{
				untyped localStorage.showError = "true";
				untyped localStorage.compile_error_status = stdout;
				untyped localStorage.compile_error_error = stderr;
				Utils.gui.Window.open("./console/console.html",{title:"HIDE console",position: 'center',toolbar:false,focus:true});
			}
			if (stderr == "")
			{
				untyped localStorage.showError = "false";
			}
			trace(error);
			trace(stdout);
			trace(stderr);
		});		
	}	
	
	
static public function compile_html5_lime():Void
	{
	trace("compiling to HTML5 (Lime)");
	
	var exec_str="";
	if (Utils.getOS() == Utils.WINDOWS) {exec_str = "cd /D "+"'"+ Main.session.project_folder +"'"+" & lime test html5";}
	if (Utils.getOS() == Utils.LINUX) { exec_str = "cd " +"'"+ Main.session.project_folder +"'"+ " ; lime test html5"; }			
	
	Utils.exec(exec_str, function (error,stdout,stderr)
		{
			if (stderr != "")
			{
				untyped localStorage.showError = "true";
				untyped localStorage.compile_error_status = stdout;
				untyped localStorage.compile_error_error = stderr;
				Utils.gui.Window.open("./console/console.html",{title:"HIDE console",position: 'center',toolbar:false,focus:true});
			}
			if (stderr == "")
			{
				untyped localStorage.showError = "false";
			}
			trace(error);
			trace(stdout);
			trace(stderr);
		});		
	}		
	
	
static public function compile_android_lime():Void
	{
	trace("compiling to Android (Lime)");
	
	var exec_str="";
	if (Utils.getOS() == Utils.WINDOWS) {exec_str = "cd /D "+"'"+ Main.session.project_folder +"'"+" & lime test android";}
	if (Utils.getOS() == Utils.LINUX) { exec_str = "cd " +"'"+ Main.session.project_folder +"'"+ " ; lime test android"; }			
	
	Utils.exec(exec_str, function (error,stdout,stderr)
		{
			if (stderr != "")
			{
				untyped localStorage.showError = "true";
				untyped localStorage.compile_error_status = stdout;
				untyped localStorage.compile_error_error = stderr;
				Utils.gui.Window.open("./console/console.html",{title:"HIDE console",position: 'center',toolbar:false,focus:true});
			}
			if (stderr == "")
			{
				untyped localStorage.showError = "false";
			}
			trace(error);
			trace(stdout);
			trace(stderr);
		});		
	}	
}
