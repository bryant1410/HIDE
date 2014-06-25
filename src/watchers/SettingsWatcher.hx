package watchers;
import nodejs.webkit.App;
import js.Node.NodeFsFileOptions;
import core.Utils;
import filetree.FileTree;
import haxe.Timer;
import js.Node;
import js.node.Watchr;
import nodejs.webkit.Window;
import projectaccess.ProjectAccess;
import tjson.TJSON;

typedef Settings = {
	var theme:String;
	var locale:String;
	var ignore:Array<String>;
	var indentWithTabs:Bool;
	var indentSize:Int;
}

/**
 * ...
 * @author 
 */
class SettingsWatcher
{
	public static var settings:Settings;
	public static var watcher:Dynamic;
    
    static var pathToSettings:String;
	public static var pathToFolder:String;
	
	public static function load():Void 
	{		
		var pathToConfigFolder:String = Node.path.join("core", "config");
		
// 		switch (Utils.os)
// 		{
// 			case Utils.WINDOWS:
// 				pathToFolder = Node.process.env.APPDATA;
// 			default:
// 				pathToFolder = Node.process.env.HOME;
// 		}
		
		pathToFolder = App.dataPath;
		
		if (pathToFolder != null)
		{
			pathToFolder = Node.path.join(pathToFolder, ".HIDE");
			if (!Node.fs.existsSync(pathToFolder))
			{
				Node.fs.mkdirSync(pathToFolder);
			}
			
			var configFiles = Node.fs.readdirSync(pathToConfigFolder);
			var files = Node.fs.readdirSync(pathToFolder);
			
			var options:NodeFsFileOptions = {};
			options.encoding = NodeC.UTF8;
			
			var content:String;
			
			var pathToFile:String = null;
			
			for (file in configFiles)
			{
				if (files.indexOf(file) == -1)
				{
					pathToFile = Node.path.join(pathToConfigFolder, file);
					content = Node.fs.readFileSync(pathToFile, options);
					pathToFile = Node.path.join(pathToFolder, file);
					Node.fs.writeFileSync(pathToFile, content, NodeC.UTF8);
				}
			}
		}
		else
		{
			pathToFolder = pathToConfigFolder;
		}
		
        pathToSettings = Node.path.join(pathToFolder, "settings.json");
        
		watcher = Watcher.watchFileForUpdates(pathToSettings, parse, 3000);
		
		parse();
		
		Window.get().on("close", function (e) 
		{
			if (watcher != null) 
			{
				watcher.close();
			}
		}
		);
	}
	
	static function parse():Void 
	{		
		var options:NodeFsFileOptions = { };
		options.encoding = NodeC.UTF8;
		
		var data:String = Node.fs.readFileSync(pathToSettings, options);
		settings = TJSON.parse(data);
		
		ThemeWatcher.load();
		LocaleWatcher.load();
		
		if (ProjectAccess.path != null) 
		{
			var fileTree = FileTree.get();
			fileTree.load();
		}
	}
	
	public static function isItemInIgnoreList(path:String):Bool
	{
		var ignored:Bool = false;
		
		var ereg:EReg;
		
		for (item in SettingsWatcher.settings.ignore) 
		{
			ereg = new EReg(item, "");
			
			if (ereg.match(path)) 
			{
				ignored = true;
				break;
			}
		}
		
		return ignored;
	}
}