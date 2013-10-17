package ui.menu;
import ui.menu.basic.Menu;

/**
 * ...
 * @author AS3Boyan
 */
class SourceMenu extends Menu
{

	public function new() 
	{
		super("Source");
		createUI();
	}
	
	function createUI()
	{
		addMenuItem("Format", "component_format", null);
		addMenuItem("Toggle Comment", "component_toggle_comment", null);
		addToDocument();
	}
	
}