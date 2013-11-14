package menu;
import jQuery.*;
import ui.Menu;

/**
 * ...
 * @author Misterpah
 */
class CompileMenu extends Menu
{

	public function new() 
	{
		super("Compile");
		create_ui();
		//register_hooks();
	}
	
	function create_ui()
	{
		addMenuItem("Flash", "core_compileTo_flash", Utils.system_compile_flash, "F5");
		addToDocument();
	}
	
}