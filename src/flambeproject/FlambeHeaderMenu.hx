package flambeproject;
import flambeproject.FlambeBuild;
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

	private static inline var MENU_NAME:String = "Flambe";
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
		var flambeMenu:Menu = BootstrapMenu.getMenu(MENU_NAME);
		var i:Int = 0;
		
		flambeMenu.addMenuItem("build and run", ++i, FlambeBuild.buildDebugAnRun);
		flambeMenu.addMenuItem("build", ++i, FlambeBuild.buildDebug);
		flambeMenu.addMenuItem("run", ++i, FlambeBuild.runBuild);
		flambeMenu.addMenuItem("Run server", ++i, FlambeBuild.runServer);
		flambeMenu.addMenuItem("Wiki", ++i, FlambeBuild.openWiki);
	}
	public function destroy():Void
	{
		BootstrapMenu.removeMenu(MENU_NAME);
	}
}