package ui.menu;
import core.ProjectAccess;
import jQuery.JQuery;

/**
 * ...
 * @author AS3Boyan
 */
class ProjectMenu
{

	public function new() 
	{
		createUI();
		registerEvents();
	}
	
	function createUI()
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
	}
	
	function registerEvents()
	{
		new JQuery(js.Browser.document).on("component_projectAccess_new", ProjectAccess.createNewProject);
		new JQuery(js.Browser.document).on("component_projectAccess_open", ProjectAccess.openProject);
		new JQuery(js.Browser.document).on("component_projectAccess_configure", ProjectAccess.configureProject);
		new JQuery(js.Browser.document).on("component_projectAccess_close", ProjectAccess.closeProject);
	}
	
}