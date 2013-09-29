package ui.menu;
import core.FileAccess;
import core.ProjectAccess;
import jQuery.JQuery;
import ui.menu.basic.Menu;

/**
 * ...
 * @author AS3Boyan
 */
class FileMenu extends Menu
{

	public function new() 
	{
		super("File");
		createUI();
	}
	
	function createUI()
	{
		addMenuItem("New Project...", "component_projectAccess_new", ProjectAccess.createNewProject);
		addMenuItem("New File...", "component_fileAccess_new", FileAccess.createNewFile);
		addMenuItem("Open Project...", "component_projectAccess_open", ProjectAccess.openProject);
		addMenuItem("Close Project...", "component_projectAccess_close", ProjectAccess.closeProject);
		addSeparator();
		addMenuItem("Open File...", "component_fileAccess_open", FileAccess.openFile);
		addMenuItem("Close File", "component_fileAccess_close", FileAccess.closeActiveFile);
		addSeparator();
		addMenuItem("Project Properties", "component_projectAccess_configure", ProjectAccess.configureProject);
		addSeparator();
		addMenuItem("Save", "component_fileAccess_save", FileAccess.saveActiveFile);
		addMenuItem("Save as...", "component_saveAs", null);
		addMenuItem("Save all", "component_saveAll", null);
		addSeparator();
		addMenuItem("Exit", "component_exit", null);
		addToDocument();
	}
	
}