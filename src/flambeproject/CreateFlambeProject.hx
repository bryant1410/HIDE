package flambeproject;
import core.HaxeHelper;
import core.ProcessHelper;
import js.Node;
import newprojectdialog.NewProjectDialog.ProjectData;

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
	
		Alertify.log("Running command: flambe new " + pathToProject);
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
		stdAlert(Alertify.success,__stdout, __stderr);
		FlambeHeaderMenu.get().create();
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
	
}