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
	public static function createProject(__data:ProjectData):Void
	{	
		var pathToProject:String = js.Node.path.join(__data.projectLocation, __data.projectName);
	
		Alertify.log("Running command: flambe new " + pathToProject);
		var processHelper = ProcessHelper.get();
		
		processHelper.runProcess("flambe", ["new",pathToProject], __data.projectLocation, onNewFlambeComplete, onNewFlambeFail);			
	}
	private static function onNewFlambeComplete(__stdout, __stderr):Void
	 {
		 trace("onNewFlambeComplete");
			if (__stdout != "") 
			{
				Alertify.log("stdout:\n" + __stdout);
			}

			if (__stderr != "") 
			{
				Alertify.log("stderr:\n" + __stderr);
			}
	 }
	 private static  function onNewFlambeFail(__code, __stdout, __stderr):Void 
		{
			trace("onNewFlambeFail");
			if (__stdout != "") 
			{
				Alertify.error("stdout:\n" + __stdout);
			}
			
			if (__stderr != "") 
			{
				Alertify.error("stderr:\n" + __stderr);
			}
		}
}