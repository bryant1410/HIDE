package watchers;
import completion.SnippetsCompletion;
import js.Node;
import nodejs.webkit.Window;

/**
 * ...
 * @author AS3Boyan
 */
class SnippetsWatcher
{
	var watcher:Dynamic;
	
	static var instance:ThemeWatcher;
	
	public function new() 
	{
		
	}	
	
	public static function get()
	{
		if (instance == null)
		{
			instance = new ThemeWatcher();
		}
			
		return instance;
	}
	
	public function load():Void 
	{
		var pathToFile = Node.path.join(SettingsWatcher.pathToFolder, "snippets.json");
		
		watcher = Watcher.watchFileForUpdates(pathToFile, function ():Void 
		{
			var snippetsCompletion = SnippetsCompletion.get();
			snippetsCompletion.load();
		}, 1000);
		
		Window.get().on("close", function (e) 
		{
			if (watcher != null) 
			{
				watcher.close();
			}
		}
		);
	}
}