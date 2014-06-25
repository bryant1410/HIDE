package core;
import projectaccess.ProjectOptions;
import build.CommandPreprocessor;
import build.Hxml;
import cm.Editor;
import js.Browser;
import js.html.TextAreaElement;
import js.Node;
import menu.BootstrapMenu;
import nodejs.webkit.Shell;
import nodejs.webkit.Window;
import openproject.OpenProject;
import projectaccess.Project;
import projectaccess.ProjectAccess;
import tabmanager.TabManager;
import tjson.TJSON;
import watchers.LocaleWatcher;

/**
 * ...
 * @author AS3Boyan
 */
class RunProject
{	
	static var runProcess:NodeChildProcess;
	
	public static function cleanProject() 
	{
		if (ProjectAccess.path != null) 
		{
			var project = ProjectAccess.currentProject;
			
			switch (project.type) 
			{
				case Project.HAXE:
					var pathToHxml:String = Node.path.join(ProjectAccess.path, project.targetData[project.target].pathToHxml);
				case Project.OPENFL:
					runProcess = killRunningProcessAndRunNew("haxelib", ["run", "lime", "clean", project.openFLTarget], ProjectAccess.path);
				case Project.HXML:
					var pathToHxml:String = Node.path.join(ProjectAccess.path, project.main);
				default:
					
			}
		}
		else 
		{
			Alertify.error("Open or create project first");
		}
	}
	
	/*
	* Set current document as build file(if it's hxml)
	*/
	public static function setHxmlAsProjectBuildFile(?pathToHxml:String):Bool
	{
		var success:Bool = false;
		
		var path:String = pathToHxml;
		
		var tabManagerInstance = TabManager.get();
		
		if (path == null)
		{
			path = tabManagerInstance.getCurrentDocumentPath();
		}

		var extname:String = js.Node.path.extname(path);
		var isHxml:Bool = (extname == ".hxml");
		
		if (isHxml) 
		{
			var noproject:Bool = ProjectAccess.path == null;
			
			var pathToProject = Node.path.basename(path);
			
			var project:Project = ProjectAccess.currentProject;
			project.type = Project.HXML;
			
			if (noproject)
			{
				project.main = pathToProject;
				ProjectAccess.path = Node.path.dirname(path);
			}
			else
			{
				project.main = Node.path.relative(ProjectAccess.path, path);
			}
			
			ProjectAccess.save(function ():Void 
			{
				if (noproject) 
				{
					OpenProject.openProject(Node.path.join(ProjectAccess.path, "project.hide"));
				}
			}
			);
			
			Alertify.success(LocaleWatcher.getStringSync("Done"));
			success = true;
		}
		else 
		{
			Alertify.error(LocaleWatcher.getStringSync("Currently selected document is not a hxml file"));
		}
			
		return success;
	}
	
	public static function runProject():Void
	{		
		buildProject(null, function ()
		{	
			var project = ProjectAccess.currentProject;
			
			var runActionType;
			var runActionText;
			
			switch (project.type) 
			{
				case Project.HAXE:
					var targetData:TargetData = project.targetData[project.target];
					
					runActionType = targetData.runActionType;
					runActionText = targetData.runActionText;
				default:
					runActionType = project.runActionType;
					runActionText = project.runActionText;
			}
			
			switch (runActionType) 
			{
				case Project.URL:
					var url:String = runActionText;
					
					if (isValidCommand(url)) 
					{
						Shell.openExternal(url);
					}
				case Project.FILE:
					var path:String = runActionText;
					
					if (isValidCommand(path)) 
					{
						js.Node.fs.exists(path, function (exists:Bool)
						{
							if (!exists)
							{
								path = js.Node.path.join(ProjectAccess.path, path);
							}
							
							Shell.openItem(path);
						}
						);
					}
				case Project.COMMAND:
					var command:String = runActionText;
					
					if (isValidCommand(command))
					{
						var params:Array<String> = CommandPreprocessor.preprocess(command, ProjectAccess.path).split(" ");
						
						var process:String = params.shift();
						
						var cwd:String = ProjectAccess.path;
						
						runProcess = killRunningProcessAndRunNew(process, params, cwd);
						
						var window:Window = Window.get();
		
						window.on("close", function (e)
						{
							killRunProcess();
							window.close();
						}
						);
					}
				default:
					
			}
		}
		);
	}
	
	static function killRunningProcessAndRunNew(process:String, params:Array<String>, cwd:String):NodeChildProcess 
	{
		killRunProcess();
		var processHelper = ProcessHelper.get();
		return processHelper.runPersistentProcess(process, params, cwd, null, true);
	}
	
	static function killRunProcess():Void
	{
		trace(runProcess);
		
		if (runProcess != null) 
		{
			trace("kill");
			runProcess.kill();
		}
	}
	
	static function isValidCommand(command:String):Bool
	{
		var valid = false;
		
		if (command != null && StringTools.trim(command) != "")  
		{
			valid = true;
		}
		
		return valid;
	}
	
	public static function buildProject(?pathToProject:String, ?onComplete:Dynamic):Void
	{		
		var project:Project;
		
		if (pathToProject != null) 
		{
			var options:NodeFsFileOptions = { };
			options.encoding = NodeC.UTF8;
			
			var data:String = Node.fs.readFileSync(pathToProject, options);
			project = TJSON.parse(data);
			
			pathToProject = Node.path.dirname(pathToProject);
		}
		else 
		{
			project = ProjectAccess.currentProject;
			pathToProject = ProjectAccess.path;
		}
		
		buildSpecifiedProject(project, pathToProject, onComplete);
	}
	
	static function buildSpecifiedProject(project:Project, pathToProject:String,  onComplete:Dynamic)
	{
		var tabManagerInstance = TabManager.get();
		var projectOptions = ProjectOptions.get();
		var processHelper = ProcessHelper.get();
		
		if (pathToProject == null)
		{
			Alertify.error(LocaleWatcher.getStringSync("Please open or create project first!"));
		}
		else 
		{
			tabManagerInstance.saveAll(function ()
			{
				var path:String = tabManagerInstance.getCurrentDocumentPath();
				var extname:String = Node.path.extname(path);
				var buildHxml:Bool = (extname == ".hxml");
				
				var dirname:String = Node.path.dirname(path);
				var filename:String = Node.path.basename(path);
				
				if (buildHxml || project.type == Project.HXML || project.type == Project.HAXE)
				{
					var hxmlData:String;
					
					if (!buildHxml) 
					{
						dirname = pathToProject;
						
						switch (project.type) 
						{
							case Project.HXML:
								filename = project.main;
							case Project.HAXE:
								filename = project.targetData[project.target].pathToHxml;
							default:
								
						}
						
						var options:NodeFsFileOptions = { };
						options.encoding = NodeC.UTF8;
						
						Node.fs.readFile(Node.path.join(dirname, filename), options, function (err:js.NodeErr, data:String):Void
						{
							if (err == null) 
							{
								hxmlData = data;
								Hxml.checkHxml(dirname, filename, hxmlData, onComplete);
							}
							else 
							{
								trace(err);
							}
						}
						);
					}
					else 
					{
						hxmlData = Editor.editor.getValue();	
						Hxml.checkHxml(dirname, filename, hxmlData, onComplete);
					}
				}
				else
				{
					projectOptions.updateOpenFLBuildCommand();
					
					var command:String = project.buildActionCommand;
					command = CommandPreprocessor.preprocess(command, pathToProject);
					
					//if (project.type == Project.HAXE)
					//{
						//command = [command].concat(project.args).join(" ");
					//}
					
					var params:Array<String> = CommandPreprocessor.preprocess(command, pathToProject).split(" ");
					var process:String = params.shift();
					
					var cwd = ProjectAccess.path;
					
					processHelper.runProcessAndPrintOutputToConsole(process, params, cwd, onComplete);			
				}
			}
			);
		}
	}
	
	
}
