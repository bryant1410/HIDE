package flambeproject;
import core.HaxeHelper;
import core.ProcessHelper;
import core.RunProject;
import flambeproject.FlambeConstants;
import haxe.Timer;
import jQuery.JQuery;
import js.Browser;
import js.html.Element;
import js.Node;
import js.Node.NodeChildProcess;
import menu.Menu.MenuButtonItem;
import menu.Menu.MenuCheckItem;
import projectaccess.ProjectAccess;

/**
 * ...
 * @author ...
 */
class FlambeBuild
{
	public static var enableFlashTarget:Bool=false;
	public static var enabledHtmlTarget:Bool=false;
	public static var enabledFirefoxTarget:Bool=false;
	public static var enabledAndroidTarget:Bool = false;
	
	static var lastAction:Dynamic;
	static var retriesMax:Int = FlambeConstants.RETRIES;
	static var serverNodeChildProcess:NodeChildProcess;
	
	static var output:Element;
	
	static public function buildDebug():Void
	{		
		FlambeAlert.action();	
		runFlambeProcess([FlambeConstants.COMMAND_BUILD, "--debug"]);
		lastAction = buildDebug;
	}
	
	
	static public function runBuild():Void
	{
		FlambeAlert.action();		
		runFlambeProcess([FlambeConstants.COMMAND_RUN, "--debug", "--no-build"]);		
		lastAction = runBuild;
	}
	
	static public function runServer():Void
	{
		output = Browser.document.getElementById('output');
		output.click();
		output.innerText = "Running...";
		FlambeAlert.action();	
		
		var processHelper:ProcessHelper = ProcessHelper.get();			
		
		if (serverNodeChildProcess != null)
		{
			serverNodeChildProcess.stderr.destroy();
			serverNodeChildProcess.stderr.destroy();
			serverNodeChildProcess.kill();
		}
		
		
		//serverNodeChildProcess = processHelper.runPersistentProcess(
		serverNodeChildProcess = Node.child_process.spawn(
		'cmd.exe',
		['/s','/C',FlambeConstants.LIB,FlambeConstants.COMMAND_SERVER],
		{cwd:ProjectAccess.path}
		);
		
		serverNodeChildProcess.stdout.setEncoding(NodeC.UTF8);
		serverNodeChildProcess.stderr.setEncoding(NodeC.UTF8);
		
		
		serverNodeChildProcess.stdout.on("data",
		function (data:String) {
			if (data.indexOf("Serving on") != -1)
			{
				stdAlert(Alertify.success, Std.string(data), "");
			}
			else
			{
				trace("Server ->", Std.string(data));
			}			
		});
		
		serverNodeChildProcess.stderr.on("data",
		function (data) {			
			stdAlert(Alertify.error, "", data);
		});
		
		
		serverNodeChildProcess.on("close",
		function (data) {
			Alertify.error("Server close:" + data);
			output.innerText += "Server close:" + data;
		});
		
		lastAction = runServer;
	}
	
	static public function buildDebugAnRun() 
	{
			/*var processHelper = ProcessHelper.get();
		var run = function (__stdout, __stderr):Void
		{
			runFlambeProcess([FlambeConstants.COMMAND_RUN, "--debug", "--no-build"]);		
		}
		runFlambeProcess([FlambeConstants.COMMAND_BUILD,"--debug"], run);*/
		runFlambeProcess([FlambeConstants.COMMAND_RUN, "--debug"]);
		lastAction = buildDebugAnRun;
	}		
	//___________________________________________________________________________
	//main process
	//___________________________________________________________________________
	static public function runFlambeProcess(params:Array<String>, ?onComplete:String->String->Void, ?onFailed:Int->String->String->Void):NodeChildProcess
	{
		output = Browser.document.getElementById('output');
		output.click();
		new JQuery("#buildStatus").fadeOut(250);
		trace("Pre", params);
		if (enableFlashTarget==true)
		{
			params.insert(1,"flash");
		}
		if (enabledHtmlTarget==true)
		{
			params.insert(1,"html");
		}
		if (enabledFirefoxTarget==true)
		{
			params.insert(1,"firefox");				
		}
		
		if (enabledAndroidTarget==true)
		{
			params.insert(1,"android");				
		}			
		trace("Pos", params);
		var processHelper:ProcessHelper = ProcessHelper.get();			
		return processHelper.runProcess(
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
		HIDE.openPageInNewWindow(null, "https://github.com/markknol/flambe-guide/wiki/", { toolbar:false } );
	}
	//___________________________________________________________________________
	//targets
	//___________________________________________________________________________
	static public function activeFirefox(menuItem:MenuCheckItem):Void 
	{
		enabledFirefoxTarget = menuItem.checked;
	}
	
	static public function activeHtml(menuItem:MenuCheckItem):Void
	{
		enabledHtmlTarget = menuItem.checked;
	}
	
	static public function activeFlash(menuItem:MenuCheckItem):Void 
	{
		enableFlashTarget = menuItem.checked;
	}
	
	static public function activeAndroid(menuItem:MenuCheckItem):Void 
	{
		enabledAndroidTarget = menuItem.checked;
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
		output.innerText = "";
		if (__stdout.length > 0 ) 
		{	
			successResultAlert(__function,__stdout);
		}
		
		if (__stderr.length > 0) 
		{	
			errorResultAlert(__function, __stderr);
		}		 
		//_______________________________________________________unknown error//try agan
		if (__stdout.length == 0 && __stderr.length == 0)
		{			
			unknownErrorResultAlert(__function);			
		}		
	}	
	
	static private function successResultAlert(alertFunction:Dynamic, stdout:String) 
	{
		//Alertify.success(stdout);			
		new JQuery("#buildStatus").fadeIn(250);
		retriesMax = FlambeConstants.RETRIES;
			
		output.innerText += "Success:\n\t" + stdout;
		
		alertFunction(stdout);
	}
	
	static private function errorResultAlert(alertFunction:Dynamic, stderr:String) 
	{
		alertFunction("Error:\n" + stderr);		
		//_______________________________________________________start server
		if (stderr.indexOf("Development server not found") != -1)
		{
			output.innerText = "Run Server\n";
			var delay:Timer = new Timer(300);
			delay.run = function ()
			{
				delay.stop();
				runServer();
			}
		}
		retriesMax = FlambeConstants.RETRIES;
		output.innerText += "Error:\n\t" + stderr;
	}
	
	static private function unknownErrorResultAlert(alertFunction:Dynamic) 
	{
		output.innerText =  "Error:\n\t" + "unknown error";
		alertFunction("Error:\n" + "unknown error");
		if (lastAction != null)
		{
			retriesMax--;
			if (retriesMax > 0)
			{
				output.innerText += "\nTrying again!"+"("+retriesMax+")";
				var delay:Timer = new Timer(300);
				delay.run = function ()
				{
					delay.stop();
					lastAction();
				}
			}
			else
			{
				lastAction = null;
				retriesMax = FlambeConstants.RETRIES;
			}
		}
	}
	
	static private function syncYamlTarget(target:String) 
	{
		target = target.toUpperCase();
		
		enableFlashTarget = target == FlambeConstants.TARGET_FLASH;
		enabledFirefoxTarget = target == FlambeConstants.TARGET_FIREFOX;
		enabledHtmlTarget = target == FlambeConstants.TARGET_HTML;
		enabledAndroidTarget = target == FlambeConstants.TARGET_ANDROID;
	}	
}
