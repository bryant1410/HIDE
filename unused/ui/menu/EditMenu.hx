package ui.menu;
import core.TabsManager;
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
		addMenuItem("Undo", "component_undo", 
		function () 
		{
			if (TabsManager.curDoc != null)
			{
				TabsManager.curDoc.doc.undo();
			}
		}, "Ctrl-Z");
		addMenuItem("Redo", "component_redo", 
		function () 
		{
			if (TabsManager.curDoc != null)
			{
				TabsManager.curDoc.doc.redo();
			}
		}, "Ctrl-Y");
		addSeparator();
		addMenuItem("Cut", "component_cut", null, "Ctrl-X");
		addMenuItem("Copy", "component_copy", null, "Ctrl-C");
		addMenuItem("Paste", "component_paste", null, "Ctrl-V");
		addMenuItem("Delete", "component_delete", null);
		addMenuItem("Select All", "component_select_all", null, "Ctrl-A");
		addSeparator();
		addMenuItem("Find...", "component_find", null, "Ctrl-F");
		addMenuItem("Replace...", "component_replace", null, "Ctrl-H");
		addToDocument();
	}
	
}