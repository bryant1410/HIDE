package ui.menu;
import core.ProjectAccess;
import jQuery.JQuery;

/**
 * ...
 * @author AS3Boyan
 */
class ProjectMenu extends Menu
{

	public function new() 
	{
		super("Project", "Project Management");
		
		createUI();
		registerEvents();
	}
	
	function createUI()
	{
		addMenuItem("New", "component_projectAccess_new");
		addMenuItem("Open", "component_projectAccess_open");
		addMenuItem("Configure", "component_projectAccess_configure");
		addMenuItem("Close", "component_projectAccess_close");
		addToDocument();
	}
	
	function registerEvents()
	{
		new JQuery(js.Browser.document).on("component_projectAccess_new", ProjectAccess.createNewProject);
		new JQuery(js.Browser.document).on("component_projectAccess_open", ProjectAccess.openProject);
		new JQuery(js.Browser.document).on("component_projectAccess_configure", ProjectAccess.configureProject);
		new JQuery(js.Browser.document).on("component_projectAccess_close", ProjectAccess.closeProject);
	}
	
}