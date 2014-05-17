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
        
        js.Node.fs.exists(pathToTheme, function (exists:Bool)
                         {
                             if (exists)
                             {
                                 continueLoading();
                             }
                             else
                             {
                                 Alertify.log("File " + pathToTheme + " for theme " + SettingsWatcher.settings.theme + " was not found. CSS files in core folder: [" + getListOfCSSFiles().join(",") + "]", "", 10000);
                             }
                         });
	}
    
    static function continueLoading()
    {
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
	
    static function getListOfCSSFiles()
    {
        var files:Array<String> = [];
        
        for (item in js.Node.fs.readdirSync("core"))
        {
            if (js.Node.path.extname(item) == ".css")
            {
                files.push(js.Node.path.basename(item));
            }
        }
        
        return files;
    }
    
	static function updateTheme() 
	{
		new JQuery("#theme").attr("href", SettingsWatcher.settings.theme);
	}
}