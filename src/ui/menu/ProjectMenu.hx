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
	}
	
	function createUI()
	{
		addMenuItem("New", "component_projectAccess_new", ProjectAccess.createNewProject);
		addMenuItem("Open", "component_projectAccess_open", ProjectAccess.openProject);
		addMenuItem("Configure", "component_projectAccess_configure", ProjectAccess.configureProject);
		addMenuItem("Close", "component_projectAccess_close", ProjectAccess.closeProject);
		addToDocument();
	}
	
}