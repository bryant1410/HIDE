package ui.menu;
import ui.menu.basic.Menu;

/**
 * ...
 * @author AS3Boyan
 */
class HelpMenu extends Menu
{

	public function new() 
	{
		super("Help");
		createUI();
	}
	
	function createUI()
	{
		addMenuItem("About", "component_about", null);
		addToDocument();
	}
	
}