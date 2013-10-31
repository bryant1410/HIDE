package core;
import jQuery.*;
import ui.*;
import ui.NewProjectDialog;
import Utils;

class ProjectAccess
{
	public static var currentProject:Project;
	
	public static function createNewProject()
	{
		NewProjectDialog.show();
	}
	
	public static function openProject()
	{		
		FileDialog.openFile(function (path:String):Void
		{
			Utils.system_openFile(path, function (content:String):Void
			{			
				var project:Project;
				
				switch (Utils.path.extname(path)) 
				{
					case ".xml":
						project = new Project();
						project.type = Project.OPENFL;
						project.target = "html5";
						project.main = path;
						OpenFLTools.getParams(Utils.path.dirname(path), project.target, function (params:Array<String>)
						{
							project.args = params;
							saveProject(path, project);
						}
						);
						
						FileTree.load("OpenFLProject");
					case ".hxml":
						project = new Project();
						project.type = Project.HXML;
						project.main = path;
						project.args = content.split("\n");
						
						saveProject(path, project);
					default:
						project = JSON.parse(content);				
				}
				
				currentProject = project;
				Main.updateMenu();
			}
			);
		}
		);
	}

	public static function saveProject(path:String, project:Project):Void
	{
		var pathToProjectFile:String = Utils.path.join(Utils.path.dirname(path), "project.hide");
							
		Utils.fs.exists(pathToProjectFile, function (exists:Bool):Void
		{
			if (!exists)
			{
				Utils.system_saveFile(pathToProjectFile, JSON.stringify(project));
			}
		}
		);
	}
	
	/*
	public static function parseProject()
	{
		trace('parse the project');
		//trace(Main.session.current_project_xml);
		
		// if file is xml, convert to hxml
		var skip = true;
		var test_extension = Main.session.current_project_xml.split(".");
		if (test_extension[1] == "xml") // need to convert to hxml
			{
			exec_str = "openfl display "+session.current_project_xml+" -hxml flash";
			//Utils.exec
			}
		else if (text_extension[1] == "hxml")
			{

			}
		else
			{
			var notify = new Notify();
			notify.type = "error";
			notify.content = "Currently we only support haxe XML and HXML extension.";
			notify.show();			
			}
	}
	*/
	
	public static function configureProject():Void
	{
		trace("configure project");
	}
	
	public static function closeProject():Void
	{
		currentProject = null;			
	}
}