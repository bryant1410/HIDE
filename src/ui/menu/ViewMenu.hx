package ui.menu;
import ui.menu.basic.Menu;

/**
 * ...
 * @author AS3Boyan
 */
class ViewMenu extends Menu
{

	public function new() 
	{
		super("View");
		createUI();
	}
	
	function createUI()
	{
		addMenuItem("Toggle Fullscreen", "component_toggle_fullscreen", Utils.toggleFullscreen);
		addToDocument();
	}
	
}