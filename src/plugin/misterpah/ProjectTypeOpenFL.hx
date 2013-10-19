package plugin.misterpah;

import jQuery.*;

class ProjectTypeOpenFL
{

	private var parameter_wrap:Array<Dynamic>;

	public function new()
	{
		var parameter:Map<String,String> = new Map();
		// parameter 1 is Project Type's name

		parameter.set("plugin_name","OpenFL");
		parameter.set("plugin_description","OpenFL is a software development kit that provides an environment for building fast, native games and applications for iOS, Android, BlackBerry, Windows, Mac, Linux, Flash and HTML5.");
		parameter.set("plugin_help","change project_name to your project name.");
		parameter.set("plugin_image","./plugin/misterpah/img/openfl.png");
		parameter.set("plugin_execute","openfl create project");
		parameter.set("plugin_extraParam","project_name");

		parameter_wrap = new Array();
		parameter_wrap.push(parameter);

		//create_ui();
		register_hook();
	}

	private function register_hook()
	{
		new JQuery(js.Browser.document).triggerHandler("core_project_registerNewTypeProject",parameter_wrap);		
	}


}