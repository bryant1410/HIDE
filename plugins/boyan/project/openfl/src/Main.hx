package ;

/**
 * ...
 * @author AS3Boyan
 */
class Main
{
	public static var name:String = "boyan.project.openfl";
	public static var dependencies:Array<String> = ["boyan.bootstrap.new-project-dialog"];
	
	//If this plugin is selected as active in HIDE, then HIDE will call this function once on load	
	public static function main():Void
	{
		HIDE.waitForDependentPluginsToBeLoaded(name, dependencies, function ():Void
		{
			NewProjectDialog.getCategory("OpenFL", 2).addItem("OpenFL Project", createOpenFLProject, false);
			NewProjectDialog.getCategory("OpenFL").addItem("OpenFL Extension", createOpenFLExtension, false);
			
			var samples: Array<String> = [
			"ActuateExample",
			"AddingAnimation",
			"AddingText",
			"DisplayingABitmap",
			"HandlingKeyboardEvents",
			"HandlingMouseEvent",
			"HerokuShaders",
			"PiratePig",
			"PlayingSound",
			"SimpleBox2D",
			"SimpleOpenGLView",
			];
			
			for (sample in samples)
			{
				NewProjectDialog.getCategory("OpenFL").getCategory("Samples").addItem(sample, function (data:Dynamic):Void
				{
					createOpenFLProject([sample]);
				}
				, false, true);
			}
		}
		);
		
		//Notify HIDE that plugin is ready for use, so plugins that depend on this plugin can start load themselves		
		HIDE.notifyLoadingComplete(name);
	}
	
	public static function createOpenFLProject(data:Dynamic):Void
	{	
		var str:String = "";
		
		if (data.projectPackage != "")
		{
			str = data.projectPackage + ".";
		}
		
		var params:Array<String> = ["project", str + data.projectName.value];
		
		if (data.projectCompany != "")
		{
			params.push(data.projectCompany);
		}
		
		CreateOpenFLProject.createOpenFLProject(params);
	}
	
	public static function createOpenFLExtension(data:Dynamic):Void
	{
		CreateOpenFLProject.createOpenFLProject(["extension", data.projectName]);
	}
	
}