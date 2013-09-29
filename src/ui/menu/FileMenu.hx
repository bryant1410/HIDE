package ui.menu;
import core.FileAccess;
import jQuery.JQuery;

/**
 * ...
 * @author AS3Boyan
 */
class FileMenu
{

	public function new() 
	{
		createUI();
		registerEvents();
	}
	
	function createUI()
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
	}
	
	function registerEvents()
	{
		new JQuery(js.Browser.document).on("component_fileAccess_new", FileAccess.createNewFile);
		new JQuery(js.Browser.document).on("component_fileAccess_open", FileAccess.openFile);
		new JQuery(js.Browser.document).on("component_fileAccess_save", FileAccess.saveActiveFile);
		new JQuery(js.Browser.document).on("component_fileAccess_close", FileAccess.closeActiveFile);
	}
	
}