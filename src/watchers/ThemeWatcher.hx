package watchers;
import haxe.Timer;
import jQuery.JQuery;
import js.node.Watchr;
import nodejs.webkit.Window;

/**
 * ...
 * @author AS3Boyan
 */
class ThemeWatcher
{
	static var watcher:Dynamic;
	static var listenerAdded:Bool = false;
    static var pathToTheme:String;
	
	public static function load() 
	{		
        pathToTheme = js.Node.path.join("core", SettingsWatcher.settings.theme);
        
		updateTheme();
		
		if (watcher != null) 
		{
			watcher.close();
		}
		
		watcher = Watcher.watchFileForUpdates(pathToTheme, function ():Void 
		{
			updateTheme();
		}, 1000);
		
		if (!listenerAdded) 
		{
			Window.get().on("close", function (e) 
			{
				if (watcher != null) 
				{
					watcher.close();
				}
			}
			);
			
			listenerAdded = true;
		}
	}
	
	static function updateTheme() 
	{
		new JQuery("#theme").attr("href", SettingsWatcher.settings.theme);
	}
}