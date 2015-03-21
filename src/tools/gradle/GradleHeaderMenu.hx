package tools.gradle;

import menu.BootstrapMenu;
import menu.Menu;
import tools.gradle.GradleTool.Tool;
/**
 * ...
 * @author espigah
 */
class GradleHeaderMenu extends Tool
{

	public function new() 
	{
		super();
	}
	
	public function create():Void
	{
		destroy();
		var menu:Menu = BootstrapMenu.getMenu(GradleConstants.HEADER_MENU_NAME);		
		var i:Int = 0;		
		
		setupFirstMenu(menu);
		setupSecondMenu(menu);
		setupThirdMenu(menu);
		menu.addMenuItem(GradleConstants.HEADER_ITEM_4, ++i, new GradleHotkeyPanel(menu).show, GradleConstants.HOTKEY_SHORTCUT);		
	} 
	
	function setupFirstMenu(menu:Menu):Void
	{
		
		var submenu:Submenu = menu.addSubmenu(GradleConstants.HEADER_ITEM_1);		
		var list:Array<String> = gradleTool.getTaskList();	
	
		createSubmenuItens(submenu,list);
	}
	
	function setupSecondMenu(menu:Menu):Void
	{
		var submenu:Submenu = menu.addSubmenu(GradleConstants.HEADER_ITEM_2);
		var list:Array<String> = gradleTool.getSetupTaskList();
		createSubmenuItens(submenu,list);
	}
	
	function setupThirdMenu(menu:Menu):Void
	{
		var submenu:Submenu = menu.addSubmenu(GradleConstants.HEADER_ITEM_3);
		var list:Array<String> = gradleTool.getHelpTaskList();
		createSubmenuItens(submenu,list);
	}
	
	function createSubmenuItens(submenu:Submenu, list:Array<String>):Void
	{
		var length:Int = list.length;
		for (i in 0...length) 
		{
			var commandName:String = list[i];
			submenu.addMenuItem(commandName, i, function ()
			{			
				gradleTool.executeTask([commandName]);
			});
		}
	}
	
	public function destroy():Void
	{
		BootstrapMenu.removeMenu(GradleConstants.HEADER_MENU_NAME);
	}
}