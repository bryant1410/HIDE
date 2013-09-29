package ui.menu;
import core.FileAccess;
import jQuery.JQuery;

/**
 * ...
 * @author AS3Boyan
 */
class FileMenu extends Menu
{

	public function new() 
	{
		super("File", "File Management");
		createUI();
	}
	
	function createUI()
	{
		addMenuItem("New", "component_fileAccess_new", FileAccess.createNewFile);
		addMenuItem("Open", "component_fileAccess_open", FileAccess.openFile);
		addMenuItem("Save", "component_fileAccess_save", FileAccess.saveActiveFile);
		addMenuItem("Close", "component_fileAccess_close", FileAccess.closeActiveFile);
		addToDocument();
	}
	
}