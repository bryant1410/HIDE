package tools.gradle;
import core.ProcessHelper;
import haxe.Utf8;
import tools.gradle.GradleTool.Tool;
/**
 * ...
 * @author espigah
 */
@:allow(tools.gradle.GradleTool) 
class GradleTasks extends Tool
{
	
	var setupTasks:Array<String>;	
	var helpTasks:Array<String>;
	var otherTasks:Array<String>;
	public function new() 
	{
		super();
		destroy();
	}
	
	public function destroy():Void
	{
		setupTasks = [];
		helpTasks = [];
		otherTasks = [];
	}
	
	public function setup():Void
	{
		searchTasks();			
	}
	
	function searchTasks():Void 
	{
		gradleTool.executeTask([GradleConstants.OPTION_TASKS], onSearchTasksHandler);	
	}
	
	function onSearchTasksHandler(stdout:String, stderr:String):Void
	{
//		trace("onSearchTasksHandler",stdout);
		if (stdout == "")		{ return ; }
		
		populateLists(stdout);
		gradleTool.setupHeaderMenu();
	}
	
	function populateLists(stdout:String) 
	{
		if (setupTasks.length > 0)
		{
			return;
		}
		var lines = stdout.split("\n");
		var l = lines.length;	
		var isSetupTasks:Bool = false;
		var isHelpTasks :Bool = false;
		var isOtherTasks:Bool = false;
		for (i in 5...l) 
		{	
			var value:String = lines[i];					
			
			if (value.length == 1)
			{
				continue;
			}

			//if (value.indexOf("All tasks runnable from root project") != -1)
			//{					
				//continue;
			//}
			
			if (value.indexOf("----------") != -1)
			{					
				continue;
			}
			
			if (value.indexOf("BUILD SUCCESSFUL") != -1)
			{					
				break;
			}
			
			if ( (value.indexOf("Build Setup tasks") != -1))
			{
				isSetupTasks = true;
				continue;
			}
			
			if (value.indexOf("Help tasks") != -1)		
			{
				isHelpTasks = true;
				continue;
			}
			//if (value.indexOf("Other tasks") != -1)
			//{
				//isOtherTasks = true;
				//continue;
			//}
			//
			var indexSeparator = value.indexOf(" - ");				
			if (indexSeparator != -1)
			{
				value = value.substring(0, indexSeparator);
			}
			
			if (value.indexOf(" ") != -1)		
			{					
				continue;
			}
			
			if (isOtherTasks == true)
			{
				otherTasks[otherTasks.length] = value;
			}
			else
			if (isHelpTasks == true)
			{
				helpTasks[helpTasks.length] = value;
				if (value == "tasks")
				{
					isOtherTasks = true;
				}
			}
			else
			if (isSetupTasks == true)
			{
				setupTasks[setupTasks.length] = value;
			}
		}	
	}
	
}