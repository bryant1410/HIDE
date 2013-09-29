package ui.menu;
import ui.menu.basic.Menu;

/**
 * ...
 * @author AS3Boyan
 */
class EditMenu extends Menu
{

	public function new() 
	{
		super("Edit");
		createUI();
	}
	
	function createUI()
	{
		addMenuItem("Undo", "component_undo", null);
		addMenuItem("Redo", "component_redo", null);
		addSeparator();
		addMenuItem("Cut", "component_cut", null);
		addMenuItem("Copy", "component_copy", null);
		addMenuItem("Paste", "component_paste", null);
		addMenuItem("Delete", "component_delete", null);
		addMenuItem("Select All", "component_select_all", null);
		addSeparator();
		addMenuItem("Find...", "component_find", null);
		addMenuItem("Replace...", "component_replace", null);
		addToDocument();
	}
	
}