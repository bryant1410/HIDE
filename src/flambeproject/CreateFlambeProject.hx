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
 * @author espigah
 * null
 * null
 */
class CreateFlambeProject
{
	public static function createProject(__data:ProjectData, __callback:Dynamic):Void
	{	
		var pathToProject:String = js.Node.path.join(__data.projectLocation, __data.projectName);
		FlambeAlert.action();
		Alertify.log("Running command: flambe new ");
		var processHelper = ProcessHelper.get();
		var localComplete = function (__stdout, __stderr):Void
		 {
			 onNewFlambeComplete(__stdout, __stderr);
			 __callback();
		 }
		processHelper.runProcess("flambe", ["new",pathToProject], __data.projectLocation, localComplete, onNewFlambeFail);			
	}
	private static function onNewFlambeComplete(__stdout, __stderr):Void
	 {
		trace("onNewFlambeComplete");
		parseYaml(function ()
		{
			stdAlert(Alertify.success,__stdout, __stderr);
		});
		
		
	 }
	 private static  function onNewFlambeFail(__code, __stdout, __stderr):Void 
	{
		trace("onNewFlambeFail");
		stdAlert(Alertify.error,__stdout, __stderr);
	}
	private static  function stdAlert( __function:Dynamic, __stdout, __stderr):Void 
	{
		if (__stdout != "") 
		{
			__function("stdout:\n" + __stdout);
		}
		
		if (__stderr != "") 
		{
			__function("stderr:\n" + __stderr);
		}
	}
	
	
	public static function parseYaml(__calback:Dynamic):Void
	{
		var file:String = ProjectAccess.path + "/flambe.yaml";
		var openFileHandle = function (code:String)
		{		
			code = repalceText(code);			
			Node.fs.writeFileSync(file, code, NodeC.UTF8);
			__calback();
		}
		TabManager.get().openFile(file,openFileHandle);	
	}
	
	static private function repalceText(code:String):String 
	{
		var a = Browser.getLocalStorage();
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