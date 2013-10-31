package ui.menu;
import ui.menu.basic.Menu;

/**
 * ...
 * @author AS3Boyan
 */
class DeveloperToolsMenu extends Menu
{

	public function new() 
	{
		super("Developer Tools");
		createUI();
	}
	
	function createUI():Void
	{
		addMenuItem("Open HIDE project", "openHIDEProject", null);
		addMenuItem("Rebuild HIDE(and reload)", "rebuildHIDE", null, "Ctrl-Shift-R");
		addMenuItem("Reload page", "reloadHIDEPage", null);
		addToDocument();
	}
	
}