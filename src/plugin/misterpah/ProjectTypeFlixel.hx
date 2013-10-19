package plugin.misterpah;

import jQuery.*;

class ProjectTypeFlixel
{

	private var parameter_wrap:Array<Dynamic>;

	public function new()
	{
		var parameter:Map<String,String> = new Map();
		// parameter 1 is Project Type's name

		parameter.set("plugin_name","Flixel");
		parameter.set("plugin_description","HaxeFlixel is a 2D game framework built with OpenFL and Haxe that delivers cross platform games, completely free for personal and commercial use.");
		parameter.set("plugin_help","change <i>project_name</i> in <b>optional parameter</b> to your project name.");
		parameter.set("plugin_image","./plugin/misterpah/img/flixel.png");
		parameter.set("plugin_execute","haxelib run flixel new");
		parameter.set("plugin_extraParam","-name project_name");

		parameter_wrap = new Array();
		parameter_wrap.push(parameter);

		//create_ui();
		register_hook();
	}

	private function register_hook()
	{
		new JQuery(js.Browser.document).triggerHandler("core_project_registerNewTypeProject",parameter_wrap);	// why wrap? it's much simpler to get the data later
	}


}