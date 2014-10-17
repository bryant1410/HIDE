package flambeproject;
import bootstrap.ListGroup;
import core.Hotkeys;
import flambeproject.QuickHotkeyPanel;

import js.html.Element;
import menu.Menu;
/**
 * ...
 * @author ...
 */
class HeaderHotkeyPanel 
{
	private var qickHotkeyPanel:QuickHotkeyPanel;
	private var menu:Menu;
	private var listGroup:ListGroup;
	public function new(__menu:Menu) 
	{
		qickHotkeyPanel = QuickHotkeyPanel.get();
		menu = __menu;	
		listGroup = new ListGroup();
	}
	public function show():Void
    {		
		setupList();
		qickHotkeyPanel.show("HeaderHotkeyPanel", listGroup, true);		
	}
	
	function setupList():Void
    {
		listGroup.clear();
		var items:Array<MenuButtonItem> =	menu.getItems();	
		var item:MenuButtonItem;
		var length = items.length - 1;//remove HotkeyPanel
        for (i in 0...length)
		{
			item = items[i];			
			listGroup.addItem(item.menuItem, Std.string((i+1)),Hotkeys.getHotkeyCommandCallback(	item.menuItem			));
		}		
	}
}