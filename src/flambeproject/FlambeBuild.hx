package flambeproject;
import core.ProcessHelper;
import flambeproject.FlambeConstants;
import projectaccess.ProjectAccess;

/**
 * ...
 * @author ...
 */
class FlambeBuild
{

	static public function buildDebug():Void
	{		
		FlambeAlert.action();
		runFlambeProcess([FlambeConstants.COMMAND_BUILD,"--debug"]);
	}
	static public function runBuild():Void
	{
		FlambeAlert.action();
		runFlambeProcess([FlambeConstants.COMMAND_RUN,"--debug", "--no-build"]);
	}
	static public function runServer():Void
	{
		FlambeAlert.action();	
		runFlambeProcess([FlambeConstants.COMMAND_SERVER]);
	}

	static public function buildDebugAnRun() 
	{
		FlambeAlert.action();
		var processHelper = ProcessHelper.get();
		var run = function (__stdout, __stderr):Void
		{
			runFlambeProcess([FlambeConstants.COMMAND_RUN,"--debug", "--no-build"]);
		}
		runFlambeProcess([FlambeConstants.COMMAND_BUILD,"--debug"], run);
	}	
	//___________________________________________________________________________
	//main process
	//___________________________________________________________________________
	static public function runFlambeProcess(params:Array<String>, ?onComplete:String->String->Void, ?onFailed:Int->String->String->Void) 
	{
		var processHelper = ProcessHelper.get();		
		processHelper.runProcess(
		FlambeConstants.LIB,
		params,
		ProjectAccess.path,
		onComplete == null ? onProcessComplete : onComplete ,
		onFailed == null ? onProcessFail : onFailed 
		);
	}
	//___________________________________________________________________________
	//docs
	//___________________________________________________________________________
	static public function openWiki():Void
	{
		FlambeAlert.action();
		HIDE.openPageInNewWindow.bind(null, "https://github.com/markknol/flambe-guide/wiki/", { toolbar:false } );
	}
	//___________________________________________________________________________
	//feedback
	//___________________________________________________________________________
	private static function onProcessComplete(__stdout:String, __stderr:String):Void
	 {
		stdAlert(Alertify.success,__stdout, __stderr);
	 }
	 private static  function onProcessFail(__code, __stdout:String, __stderr:String):Void 
	{		
		stdAlert(Alertify.error,__stdout, __stderr);
	}
	
	private static  function stdAlert( __function:Dynamic, __stdout:String, __stderr:String):Void 
	{
		if (__stdout != "") 
		{
			if (__stdout.indexOf("Serving on") != -1)
			{
				Alertify.success(__stdout);
				
			}
			else
			{
				__function("stdout:\n" + __stdout);
			}
			
		}
		
		if (__stderr != "") 
		{
			__function("stderr:\n" + __stderr);
		}
	}
	
}