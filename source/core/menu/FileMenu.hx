package menu;
import jQuery.*;
import ui.Menu;

/**
 * ...
 * @author AS3Boyan
 */
class FileMenu extends Menu
{

	public function new() 
	{
		super("File");
		create_ui();
		//register_hooks();
	}
	
	function create_ui()
	{
		addMenuItem("New Project...", "core_project_newProject", null, "Ctrl-Shift-N");
		addMenuItem("Open Project...", "core_project_openProject",null, "Ctrl-Shift-O");
		//addMenuItem("Project Properties", "core_project_projectProperties", null);
		addMenuItem("Close Project...", "core_project_closeProject", null);
		addSeparator();
		addMenuItem("New File...", "core_file_newFile", null, "Ctrl-N");
		addMenuItem("Open File...", "core_file_openFile", null, "Ctrl-O");
		addMenuItem("Save", "core_file_save", null, "Ctrl-S");
		//addMenuItem("Save as...", "core_file_saveAs", null, "Ctrl-Shift-S");
		//addMenuItem("Save all", "core_file_saveAll", null);
		addMenuItem("Close File", "core_file_close", null, "Ctrl-W");
		addSeparator();
		addMenuItem("Exit", "core_exit", function(){untyped window.close();}, "Alt-F4");
		addToDocument();
	}
	
}