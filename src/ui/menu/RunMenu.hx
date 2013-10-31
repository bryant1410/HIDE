package ui.menu;
import ui.menu.basic.Menu;

/**
 * ...
 * @author AS3Boyan
 */
class RunMenu extends Menu
{

	public function new() 
	{
		super("Run");
		createUI();
	}
	
	function createUI()
	{
		addMenuItem("Run Project", "component_run_project", BuildTools.runProject, "F5");
		addMenuItem("Build Project", "component_build_project", BuildTools.buildProject, "F8");
		addToDocument();
	}
	
}