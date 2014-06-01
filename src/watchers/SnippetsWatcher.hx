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
	static var watcher:Dynamic;
	
	public static function load():Void 
	{
		var pathToFile = Node.path.join(SettingsWatcher.pathToFolder, "snippets.json");
		
		watcher = Watcher.watchFileForUpdates(pathToFile, function ():Void 
		{
			SnippetsCompletion.load();
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