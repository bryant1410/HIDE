package flambeproject;
import core.Hotkeys;
import menu.Menu;

/**
 * ...
 * @author ...
 */
class FlambeHotkeyPanel extends HeaderHotkeyPanel
{

	public function new(__menu:Menu) 
	{
		super(__menu);
		
	}
	override public function show():Void
    {		
		setupList();
		qickHotkeyPanel.show("Flambe", listGroup, true);		
	}
	override public function setupList():Void
    {
		listGroup.clear();
		var items:Array<MenuButtonItem> =	menu.getItems();	
		var item:MenuButtonItem;
		var length = items.length - 2;//remove HotkeyPanel and wiki options
        for (i in 0...length)
		{
			item = items[i];			
			listGroup.addItem(item.menuItem, Std.string((i+1)),Hotkeys.getHotkeyCommandCallback(	item.menuItem			));
		}	
	}
	
}