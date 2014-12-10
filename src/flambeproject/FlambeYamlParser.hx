package flambeproject;
import core.HaxeHelper;
import core.ProcessHelper;
import js.Browser;
import js.Node;
import newprojectdialog.NewProjectDialog.ProjectData;
import projectaccess.Project;
import projectaccess.ProjectAccess;
import tabmanager.TabManager;


/**
 * ...
 * @author espigah
 */
class FlambeYamlParser
{
	static var instance:FlambeYamlParser;
	var yamlFile:String;
	var haxeFlagList:Array<String>;
	var validLines:Array<String>;
	public var mainFile:String;
	public static function get():FlambeYamlParser
	{
		if (instance == null)
		{
			instance = new FlambeYamlParser();
		}
			
		return instance;
	}
	
	public function new():Void
	{
		haxeFlagList = [];
		yamlFile = "";
	}	
	
	public function openFile(?calback:Dynamic->Bool):Void
	{
		
		var file:String = ProjectAccess.path + "/flambe.yaml";
		var exist:Bool = Node.fs.existsSync(file);
		if (exist == false)
		{
			calback(false);
			return ;
		}
		var openFileHandle = function (file:String)
		{	
			yamlFile = file;
			yamlFile = setStorageText(yamlFile);
			getValidLines(file);
			getHaxeFlags();
			getMainFile();
			
			if (calback != null)
			{calback(true);}
		}		
		TabManager.get().openFile(file,openFileHandle);	
	}
	
	function getValidLines(file:String) 
	{
		validLines = [];
		var lines = file.split("\n");
		var currentLine:String;
		var length:Int = lines.length;
		for (i in 0...length) 
		{
			currentLine = lines[i];		
			if (currentLine.length <=  1 || currentLine.charAt(0) == "#")
			{
				continue;
			}
			validLines[validLines.length] = currentLine;
		}
	}
	
	
	function getMainFile():Void
	{
		var lines = validLines;
		var currentLine:String;
		var length:Int = lines.length;
		for (i in 0...length) 
		{
			currentLine = lines[i];				
			var indexOf = currentLine.indexOf( "main:");
			if (indexOf == -1)
			{
				continue;
			}
			
			mainFile = StringTools.replace(currentLine, "main: ", "");
			mainFile = StringTools.trim(mainFile);
			break;
		}
	}
	
	
	function getHaxeFlags():Void
	{
		haxeFlagList = [];
		var lines = validLines;
		var currentLine:String;
		var length:Int = lines.length;
		for (i in 0...length) 
		{
			currentLine = lines[i];				
			var indexOf = currentLine.indexOf( "haxe_flags");
			if (indexOf == -1)
			{
				continue;
			}	
			haxeFlagList.push(StringTools.replace(currentLine, "haxe_flags:", ""));
		}
	}
	
	private function setStorageText(code:String):String 
	{	
		//ar a = Browser.getLocalStorage();
		var devNameValue:String = Browser.getLocalStorage().getItem(FlambePage.FILD_DEV_NAME);
		var gameNameValue:String = Browser.getLocalStorage().getItem(FlambePage.FILD_GAME_NAME);
		var gameIdValue:String = Browser.getLocalStorage().getItem(FlambePage.FILD_GAME_ID);
		var platformValue:String = Browser.getLocalStorage().getItem(FlambePage.FILD_PLATFORM);
		
		if (devNameValue !=null && devNameValue != "")
		{
			code = StringTools.replace(code, "name: Your Company Name", "name: " + devNameValue);
		}
		if ( gameNameValue !=null &&  gameNameValue != "")
		{
			code = StringTools.replace(code, "name: Your Game", "name: " + gameNameValue);
		}
		if (gameIdValue !=null && gameIdValue != "")
		{
				code = StringTools.replace(code, "id: com.yourdomain.yourgame", "id: " + gameIdValue);
		}
		if (platformValue !=null && platformValue != "")
		{
			code = StringTools.replace(code, "default_platform: flash", "default_platform: " + platformValue);
		}			
		return code;
	}
}