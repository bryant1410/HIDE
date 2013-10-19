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
		addMenuItem("New Project...", "component_projectAccess_new", ProjectAccess.createNewProject, "Ctrl-Shift-N");
		addMenuItem("New File...", "component_fileAccess_new", FileAccess.createNewFile, "Ctrl-N");
		addMenuItem("Open Project...", "component_projectAccess_open", ProjectAccess.openProject, "Ctrl-Shift-O");
		addMenuItem("Close Project...", "component_projectAccess_close", ProjectAccess.closeProject);
		addSeparator();
		addMenuItem("Open File...", "component_fileAccess_open", FileAccess.openFile, "Ctrl-O");
		addMenuItem("Close File", "component_fileAccess_close", FileAccess.closeActiveFile, "Ctrl-W");
		addSeparator();
		addMenuItem("Project Properties", "component_projectAccess_configure", ProjectAccess.configureProject);
		addSeparator();
		addMenuItem("Save", "component_fileAccess_save", FileAccess.saveActiveFile, "Ctrl-S");
		addMenuItem("Save as...", "component_saveAs", FileAccess.saveActiveFileAs, "Ctrl-Shift-S");
		addMenuItem("Save all", "component_saveAll", FileAccess.saveAll);
		addSeparator();
		addMenuItem("Exit", "component_exit", Main.close, "Alt-F4");
		addToDocument();
	}
	
}