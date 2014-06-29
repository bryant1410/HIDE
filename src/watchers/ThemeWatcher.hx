package watchers;
import cm.Editor;
import js.Node.NodeFsFileOptions;
import js.html.LinkElement;
import js.Browser;
import js.Node;
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
	var watcher:Dynamic;
	var listenerAdded:Bool = false;
    var pathToTheme:String;
	var currentTheme:String;
	
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
	
	public function load() 
	{		
        pathToTheme = Node.path.join("core", SettingsWatcher.settings.theme);
        
        Node.fs.exists(pathToTheme, function (exists:Bool)
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
    
    function continueLoading()
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
	
    function getListOfCSSFiles()
    {
        var files:Array<String> = [];
        
        for (item in Node.fs.readdirSync("core"))
        {
            if (Node.path.extname(item) == ".css")
            {
                files.push(Node.path.basename(item));
            }
        }
        
        return files;
    }
    
	function updateTheme(?type:String) 
	{
		var theme = SettingsWatcher.settings.theme;
		new JQuery("#theme").attr("href", theme);
		
		if (currentTheme != null && currentTheme != theme)
		{
			var ereg = ~/\/\* *codeEditorTheme *= *([^ \*]*) *\*\//g;
		
			var options:NodeFsFileOptions = {};
			options.encoding = NodeC.UTF8;

			var data = Node.fs.readFileSync(Node.path.join("core", theme), options);

			if (ereg.match(data))
			{
				var codeEditorTheme = ereg.matched(1);
				Editor.setTheme(codeEditorTheme);
			}
		}
			
		currentTheme = theme;
	}
}