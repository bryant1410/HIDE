package flambeproject;
import flambeproject.FlambeBuild;
import flambeproject.FlambeConstants;
import flambeproject.FlambeHotkeyPanel;
import js.Browser;
import js.html.DivElement;
import menu.BootstrapMenu;
import menu.Menu;

/**
 * ...
 * @author ...
 */
class FlambeHeaderMenu
{
	static var instance:FlambeHeaderMenu;	
	public static function get()
	{
		if (instance == null)
		{
			instance = new FlambeHeaderMenu();
		}			
		return instance;
	}
	
	public function new():Void
	{
	
	}
	public function create():Void
	{
		destroy();
		var flambeMenu:Menu = BootstrapMenu.getMenu(FlambeConstants.HEADER_NAME);
		var i:Int = 0;
		
		flambeMenu.addMenuItem(FlambeConstants.HEADER_ITEM_1, ++i, FlambeBuild.buildDebugAnRun);
		flambeMenu.addMenuItem(FlambeConstants.HEADER_ITEM_2, ++i, FlambeBuild.buildDebug);
		flambeMenu.addMenuItem(FlambeConstants.HEADER_ITEM_3, ++i, FlambeBuild.runBuild);
		flambeMenu.addMenuItem(FlambeConstants.HEADER_ITEM_4, ++i, FlambeBuild.runServer);
		flambeMenu.addMenuItem(FlambeConstants.HEADER_ITEM_5, ++i, FlambeBuild.openWiki);
		createSubMenu(flambeMenu) ;		
		
		flambeMenu.addMenuItem(FlambeConstants.HEADER_ITEM_7, ++i, new FlambeHotkeyPanel(flambeMenu).show,FlambeConstants.HOTKEY_SHORTCUT);
		
	}
	
	function createSubMenu(menu:Menu):Submenu
	{
		var i:Int = 0;
		var submenu:Submenu = menu.addSubmenu(FlambeConstants.HEADER_ITEM_6);		
		submenu.addMenuCheckItem(FlambeConstants.TARGET_FLASH,++i,	FlambeBuild.activeFlash);
		submenu.addMenuCheckItem(FlambeConstants.TARGET_HTML,++i,	FlambeBuild.activeHtml);
		submenu.addMenuCheckItem(FlambeConstants.TARGET_FIREFOX,++i,	FlambeBuild.activeFirefox);
		submenu.addMenuCheckItem(FlambeConstants.TARGET_ANDROID,++i,	FlambeBuild.activeAndroid);	
		return submenu;
	}
	
	public function destroy():Void
	{
		BootstrapMenu.removeMenu(FlambeConstants.HEADER_NAME);
	}
}