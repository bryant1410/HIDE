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
		registerEvents();
	}
	
	function createUI()
	{
		addMenuItem("New", "component_fileAccess_new");
		addMenuItem("Open", "component_fileAccess_open");
		addMenuItem("Save", "component_fileAccess_save");
		addMenuItem("Close", "component_fileAccess_close");
		addToDocument();
	}
	
	function registerEvents()
	{
		new JQuery(js.Browser.document).on("component_fileAccess_new", FileAccess.createNewFile);
		new JQuery(js.Browser.document).on("component_fileAccess_open", FileAccess.openFile);
		new JQuery(js.Browser.document).on("component_fileAccess_save", FileAccess.saveActiveFile);
		new JQuery(js.Browser.document).on("component_fileAccess_close", FileAccess.closeActiveFile);
	}
	
}