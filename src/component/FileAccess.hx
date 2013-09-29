package component;
import jQuery.*;
	
class FileAccess
{
	static public function init()
	{
		// draw ui
		ui();
			
		// register/hook some events
		event_component_fileAccess_new();
		event_component_fileAccess_open();
		event_component_fileAccess_save();
		event_component_fileAccess_close();
	}// end init
	
	
	
	static function ui()
	{
		var retStr = ["<li class='dropdown'>",
		"<a href='#' class='dropdown-toggle' data-toggle='dropdown'>File</a>",
		"<ul class='dropdown-menu'>",
		"<li class='dropdown-header'>File Management</li>",
		"<li><a onclick='$(document).triggerHandler(\"component_fileAccess_new\");'>New</a></li>",
		"<li><a onclick='$(document).triggerHandler(\"component_fileAccess_open\");'>Open</a></li>",
		"<li><a onclick='$(document).triggerHandler(\"component_fileAccess_save\");'>Save</a></li>",
		"<li><a onclick='$(document).triggerHandler(\"component_fileAccess_close\");'>Close</a></li>",
		"</ul>",
		"</li>"].join("\n"); // a fancy way to combine string. a norm in javascript.
		
		new JQuery("#position-navbar").append(retStr); // this position is defined in the HTML.
	}// end ui
	
	
	
	static function event_component_fileAccess_new()
	{
		new JQuery(js.Browser.document).on("component_fileAccess_new",function()
			{
				if (Main.session.current_project_xml == "")
				{
					trace ("open project first");
				}
				else
				{
					trace ("create a new file");
				}
			
			});// end JQuery.on
	}// end event_component_fileAccess_new
	
	
	
	static function event_component_fileAccess_open()
	{
		new JQuery(js.Browser.document).on("component_fileAccess_open",function()
		{
			if (Main.session.current_project_xml == "")
			{
				trace ("open project first");
			}
			else
			{
				trace ("open a file");
			}
				
		});// end JQuery.on
	}// end event_component_fileAccess_open

	
	
	static function event_component_fileAccess_save()
	{
		new JQuery(js.Browser.document).on("component_fileAccess_save",function()
		{
			if (Main.session.current_project_xml == "")
			{
				trace ("open project first");
			}
			else
			{
				trace ("save active file");
			}
				
		});// end JQuery.on
	}// end event_component_fileAccess_save

	
	
	static function event_component_fileAccess_close()
	{
		new JQuery(js.Browser.document).on("component_fileAccess_close",function()
		{
			if (Main.session.current_project_xml == "")
			{
				trace ("open project first");
			}
			else
			{
				trace ("close active file");
			}
				
		});// end JQuery.on
	}// end event_component_fileAccess_close		
}
