package tools.gradle;
import core.Hotkeys;
import menu.Menu;
import flambeproject.HeaderHotkeyPanel;

/**
 * ...
 * @author espigah
 */
class GradleHotkeyPanel extends HeaderHotkeyPanel
{

	public function new(__menu:Menu) 
	{
		super(__menu);
		
	}
	override public function show():Void
    {		
		setupList();
		qickHotkeyPanel.show(GradleConstants.HEADER_MENU_NAME , listGroup, true);		
	}
	override public function setupList():Void
    {
		listGroup.clear();
		var submenu:Submenu = menu.getSubmenu(GradleConstants.HEADER_ITEM_1);
		var items:Array<MenuButtonItem> =	submenu.getItems();	
		var item:MenuButtonItem;
		var length = items.length;
        for (i in 0...length)
		{
			item = items[i];			
			listGroup.addItem(item.menuItem, Std.string((i+1)),item.action);
		}	
	}
	
}