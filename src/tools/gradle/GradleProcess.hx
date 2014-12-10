package tools.gradle;

import about.Presentation;
import core.ProcessHelper;
import jQuery.JQuery;
import js.Node;
import projectaccess.ProjectAccess;
import tools.gradle.GradleProcess.RunningProcessesControl;
import tools.gradle.GradleTool.Tool;
/**
 * ...
 * @author espigah
 */
class GradleProcess extends Tool
{
	var runningProcessesControl:RunningProcessesControl;
	var buildFileOption:Array<String>;
	public function new() 
	{
		super();
		runningProcessesControl = new RunningProcessesControl();
	}
	
	public function run(?file:String,?params:Array<String>, ?onComplete:String->String->Void, ?onFailed:Int->String->String->Void):Void
	{
	
		var isRunning = runningProcessesControl.check(file, params);		
		if (isRunning == true)
		{
			trace("isRunning->",file,params);
			return ;
		}	
		var key:String = runningProcessesControl.lastKey;
		if (file == null)
		{
			file =  Node.path.join(ProjectAccess.path, gradleTool.config.path,  gradleTool.config.buildFile );
		}
		buildFileOption = [GradleConstants.OPTION_BUILD_FILE,file];
		
		if (params == null)
		{
			params = [];	
		}
		
		params =  buildFileOption.concat(params);
	
		
		function completeHandler(stdout:String, stderr:String):Void
		{			
			runningProcessesControl.stopProcesses(key);
			setOutput(stdout,stderr);
			if (onComplete == null) { return; }			
			onComplete(stdout,stderr);			
		}
		
		function failedHandler(code, stdout, stderr)
		{
			runningProcessesControl.stopProcesses(key);
			setOutput(stdout,stderr,code);
			
			if (onFailed != null)
			{
				onFailed(code, stdout, stderr);
			}
		}
		
		
		var processHelper = ProcessHelper.get();
		//nodeChildProcess =processHelper.runProcessAndPrintOutputToConsole(GradleConstants.NAME, params,ProjectAccess.path,completeHandler );
		processHelper.runProcess(GradleConstants.NAME, params, ProjectAccess.path, completeHandler, failedHandler);
	
	}
	
	function setOutput(?stdout:String="", ?stderr:String="", ?code:Int=-1):Void
	{
		gradleTool.setOutput();
		gradleTool.setOutput("Complete!");
		gradleTool.setOutput(stdout,stderr,code);
	}
}

class RunningProcessesControl
{
	public var lastKey:String;
	var separator:String = "-";//cosnt
	var map:Map<String,Bool>;	
	public function new ()
	{		
		map = new Map<String,Bool>();
	}
	
	public function check(file:String, params:Array<String>):Bool
	{
		lastKey = createKey(file, params);
		if (map.exists(lastKey) == true)
		{
			return map.get(lastKey);
		}
		startProcesses(lastKey);		
		return false;
	}
	public function stopProcesses(key:String) :String
	{
		map.set( key, false);
		return key;
	}
	public function startProcesses(key:String) :String
	{
		map.set( key, true);
		return key;
	}
	function createKey(file:String, params:Array<String>) :String
	{
		var key:String = file ;
		var length = params.length;
		for (i in 0 ... length) 
		{
			key += separator + params[i];
		}
		
		return key;
	}
}

//trace(params);
		//Node.child_process.exec(GradleConstants.NAME+ " tasks --all", params,		
			//function (error, stdout:String, stderr:String):Void
			//{			
				////if (stdout != "")
				////{
					////trace("stdout:\n" + stdout);
				////}
				////
				////if (stderr != "")
				////{
					////trace("stderr:\n" + stderr);
				////}
				//
				//if (error == null)
				//{				
					//onComplete(stdout, stderr);
				//}
				//else if (onFailed != null)
				//{
					//trace(error.code);
					//trace(stdout);
					//trace(stderr);
					//
				//}
			//}
		//);