package component;
import jQuery.*;
import ui.*;
	
class ProjectAccess
{
	static public function init()
	{
		// draw ui
		ui();
		
		// register/hook some events
		event_component_projectAccess_new();
		event_component_projectAccess_open();
		event_component_projectAccess_configure();
		event_component_projectAccess_close();
	}// end init
	
	
	
	static function ui()
	{
		var retStr = ["<li class='dropdown'>",
		"<a href='#' class='dropdown-toggle' data-toggle='dropdown'>Project</a>",
		"<ul class='dropdown-menu'>",
		"<li class='dropdown-header'>Project Management</li>",
		"<li><a onclick='$(document).triggerHandler(\"component_projectAccess_new\");'>New</a></li>",
		"<li><a onclick='$(document).triggerHandler(\"component_projectAccess_open\");'>Open</a></li>",
		"<li><a onclick='$(document).triggerHandler(\"component_projectAccess_configure\");'>Configure</a></li>",
		"<li><a onclick='$(document).triggerHandler(\"component_projectAccess_close\");'>Close</a></li>",
		"</ul>",
		"</li>"].join("\n"); 
		
		new JQuery("#position-navbar").append(retStr);			
	}// end ui
		
	
	
	static function event_component_projectAccess_new()
	{
		new JQuery(js.Browser.document).on("component_projectAccess_new",function()
			{
				trace ("create a new project");
				
				// this is how to notify the user
				var notify = new Notify();
				notify.type = "error";
				notify.content = "Just to test notify!";
				notify.show();
				
				
				// this is how to open a model
				var modal = new Modal();
				modal.id='projectAccess_new';
				modal.title= 'New Project';
				modal.content = 'this is just a sample';
				modal.ok_text = "Create";
				modal.cancel_text = "Cancel";
				modal.show();
				new JQuery("#projectAccess_new .button_ok").on("click",function()
															   {
																   trace("you've clicked the OK button");
															   });
				
			});// end JQuery.on
	}// end event_component_projectAccess_new
	
	
	
	static function event_component_projectAccess_open()
	{
		new JQuery(js.Browser.document).on("component_projectAccess_open",function()
			{
				trace ("open a project");   
			});// end JQuery.on
	}// end event_component_projectAccess_open	
	
	
	
	static function event_component_projectAccess_configure()
	{
		new JQuery(js.Browser.document).on("component_projectAccess_configure",function()
			{
				trace ("configure project");			   
			});// end JQuery.on
	}// end event_component_projectAccess_configure	
	
	
	
	static function event_component_projectAccess_close()
	{
		new JQuery(js.Browser.document).on("component_projectAccess_close",function()
			{
				trace ("close project");										   
			});// end JQuery.on
	}// end event_component_projectAccess_close
}