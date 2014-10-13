package flambeproject;
import core.ProcessHelper;
import projectaccess.ProjectAccess;

/**
 * ...
 * @author ...
 */
class FlambeBuild
{

	static public function buildDebug():Void
	{
		Alertify.log("Doing..", "doing");
		var processHelper = ProcessHelper.get();
		
		processHelper.runProcess("flambe", ["build ","--debug"], ProjectAccess.path, onProcessComplete, onProcessFail);
	}
	static public function runBuild():Void
	{
		Alertify.log("Doing..", "doing");
		var processHelper = ProcessHelper.get();
		
		processHelper.runProcess("flambe", ["run ","--debug", "--no-build"], ProjectAccess.path, onProcessComplete, onProcessFail);
	}
	static public function runServer():Void
	{
		Alertify.log("Doing..", "doing");	
		var processHelper = ProcessHelper.get();		
		processHelper.runProcess("flambe", ["serve "], ProjectAccess.path, onProcessComplete, onProcessFail);
	}
	
	static public function buildDebugAnRun() 
	{
		Alertify.log("Doing..", "doing");
		var processHelper = ProcessHelper.get();
		var run = function (__stdout, __stderr):Void
		{
			processHelper.runProcess("flambe", ["run ","--debug", "--no-build"], ProjectAccess.path, onProcessComplete, onProcessFail);
		}
		processHelper.runProcess("flambe", ["build ","--debug"], ProjectAccess.path, run, onProcessFail);
	}	
	//___________________________________________________________________________
	//docs
	//___________________________________________________________________________
	static public function openWiki():Void
	{
		Alertify.log("Doing..", "doing");
		 HIDE.openPageInNewWindow.bind(null, "https://github.com/markknol/flambe-guide/wiki/", { toolbar:false } );
	}
//___________________________________________________________________________
//feedback
//___________________________________________________________________________
	private static function onProcessComplete(__stdout, __stderr):Void
	 {
		stdAlert(Alertify.success,__stdout, __stderr);
	 }
	 private static  function onProcessFail(__code, __stdout, __stderr):Void 
	{		
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