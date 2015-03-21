package tools.gradle;
import haxe.Timer;
import js.Browser;
import js.html.audio.AudioProcessingEvent;
import js.html.TextAreaElement;
import js.Node;


import tools.gradle.GradleConstants;
import projectaccess.ProjectAccess;
import projectaccess.ProjectOptions;
/**
 * ...
 * @author espigah
 */
class GradleTool
{
	
	public function new(forceSingleton:ForceSingleton) 	{			}
	//________________________________________________________________________________________________________________________
	//
	//________________________________________________________________________________________________________________________
	static var instance:GradleTool;	
	public static function get():GradleTool
	{
		if (instance == null)
		{			
			instance = new GradleTool(new ForceSingleton());
			instance.startTools();
		}			
		return instance;
	}
	
	//________________________________________________________________________________________________________________________
	//
	//________________________________________________________________________________________________________________________
	public var process:GradleProcess;
	public var headerMenu:GradleHeaderMenu;
	public var config:GradleConfig;
	public var tasks:GradleTasks;
	var tab:GraldeTab;
	function startTools():Void 
	{
		process = new GradleProcess();
		headerMenu = new GradleHeaderMenu();
		config = new GradleConfig();
		tasks = new GradleTasks();
		tab = new GraldeTab();
		
	}		
	//________________________________________________________________________________________________________________________
	//
	//________________________________________________________________________________________________________________________
	public function setup():Void
	{
		tab.setup();
		searchBuildFile();
	}
	
	public function searchBuildFile():Void
	{
		var t = new Timer(500);
		t.run = function ()
		{
			if (ProjectAccess.path == null )			{				return;			}
			
			var fileName:String = getFileName();
			var fileExist:Bool = Node.fs.existsSync(fileName);
			if (fileExist == false)
			{
				fileExist = searchOnDefaultFolder();
			}
			
			if (fileExist)
			{
				//Node.fs.watchFile(fileName, {},function (curr:NodeStat, prev:NodeStat):Void {
				//trace('the current mtime is: ' + curr.mtime);
				//trace('the previous mtime was: ' + prev.mtime);
				//});
				ready();
			}
		
			t.stop();
		}		
	}
	
	function getFileName() :String
	{
		config.buildFile  = if (config.buildFile != "")
		{
			if (StringTools.endsWith(config.buildFile, GradleConstants.EXTENSION)==false)
			{
				config.buildFile += GradleConstants.EXTENSION;
			}
			config.buildFile ;
		}
		else
		{
			GradleConstants.DEFAULT_BUILD_FILE + GradleConstants.EXTENSION;
		}
		
		config.path = if (config.path != "")
		{
			config.path;
		}
		else
		{
			"";
		}
		
		var buildFIle = Node.path.join(ProjectAccess.path, config.path,  config.buildFile);		
		return buildFIle;
	}
	
	function searchOnDefaultFolder():Bool
	{
		config.path = GradleConstants.DEFAULT_PATH;
		config.buildFile = GradleConstants.DEFAULT_BUILD_FILE + GradleConstants.EXTENSION;
		var buildFile = Node.path.join(ProjectAccess.path, config.path,  config.buildFile);
		return Node.fs.existsSync(buildFile);	
	}
	
	function ready() 
	{
		tab.show();
		tasks.setup();
	}
	//________________________________________________________________________________________________________________________
	//
	//________________________________________________________________________________________________________________________
	public function setupHeaderMenu():Void
	{		
		headerMenu.create();
		setOutput();
		setOutput("Have a look at menu!");
	}
	
	public function getTaskList() :Array<String>
	{
		return tasks.otherTasks;
	}
	
	public function getSetupTaskList() :Array<String> 
	{
		return tasks.setupTasks;
	}
	
	public function getHelpTaskList() :Array<String>
	{
		return tasks.helpTasks;
	}
	
	public function executeTask(?file:String,?params:Array<String>, ?onComplete:String->String->Void, ?onFailed:Int->String->String->Void) 
	{
		tab.text = ""; // clear
		tab.text = "Running..."; // clear
		process.run(file, params, onComplete, onFailed);	
	}
	
	public function setOutput(?stdout:String="", ?stderr:String="", ?code:Int=-1) 
	{		
		if (stderr != "" || code != -1)
		{
			tab.text = "Error:"+stderr; // clear
			tab.text = "ErrorCode:"+code; // clear
		}
		else
		{
			tab.text = stdout; // clear
		}
		
	}
	//________________________________________________________________________________________________________________________
	//
	//________________________________________________________________________________________________________________________
	public function destroy():Void
	{
		tasks.destroy();
		tab.destroy();
		headerMenu.destroy();
	}
}


class Tool
{
	var gradleTool:GradleTool;
	public function new() 
	{
		gradleTool = GradleTool.get();
	}
}

class ForceSingleton
{
	@:allow(tools.gradle.GradleTool)
	private function new() 
	{
		
	}
}