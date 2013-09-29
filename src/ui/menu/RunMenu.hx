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
		addMenuItem("Run Project", "component_run_project", null);
		addMenuItem("Build Project", "component_build_project", null);
		addToDocument();
	}
	
}