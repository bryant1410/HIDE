package haxeproject;
import core.Utils;
import core.Splitter;
import filetree.FileTree;
import js.Browser;
import js.html.TextAreaElement;
import js.Node;
import js.node.Mkdirp;
import mustache.Mustache;
import newprojectdialog.NewProjectDialog;
import openproject.OpenProject;
import projectaccess.Project;
import projectaccess.ProjectAccess;
import projectaccess.ProjectOptions;
import tabmanager.TabManager;

/**
 * ...
 * @author AS3Boyan
 */
class HaxeProject
{
	var code:String;
	var indexPageCode:String;
	
	static var instance:HaxeProject;
	
	public static function get()
	{
		if (instance == null)
		{
			instance = new HaxeProject();
		}
			
		return instance;
	}
	
	//If this plugin is selected as active in HIDE, then HIDE will call this function once on load	
	public function new():Void
	{
			NewProjectDialog.getCategory("Haxe", 1).addItem("Flash Project", createFlashProject);			
			NewProjectDialog.getCategory("Haxe").addItem("JavaScript Project", createJavaScriptProject);
			NewProjectDialog.getCategory("Haxe").addItem("Neko Project", createNekoProject);
			NewProjectDialog.getCategory("Haxe").addItem("PHP Project", createPhpProject);
			NewProjectDialog.getCategory("Haxe").addItem("C++ Project", createCppProject);
			NewProjectDialog.getCategory("Haxe").addItem("Java Project", createJavaProject);
			NewProjectDialog.getCategory("Haxe").addItem("C# Project", createCSharpProject);
			NewProjectDialog.getCategory("Haxe").addItem("Python Project", createPythonProject);
			
			var options:NodeFsFileOptions = { };
			options.encoding = NodeC.UTF8;
			
			var path:String = Node.path.join("core", "templates", "Main.hx");
			
			Node.fs.readFile(path, options, function (error:NodeErr, data:String):Void
			{
				if (error == null) 
				{
					code = data;
				}
				else 
				{
					trace(error);
					Alertify.error("Can't load template " + path);
				}
			}
			);
			
			path = Node.path.join("core", "templates", "index.html");
			
			Node.fs.readFile(path, options, function (error:NodeErr, data:String):Void
			{
				if (error == null) 
				{
					indexPageCode = data;
				}
				else 
				{
					trace(error);
					Alertify.error("Can't load template " + path);
				}
			}
			);
	}
	
	function createPythonProject(data:Dynamic):Void  
	{
		createHaxeProject(data, Project.PYTHON);
	}
	
	function createCSharpProject(data:Dynamic):Void 
	{
		createHaxeProject(data, Project.CSHARP);
	}
	
	function createJavaProject(data:Dynamic):Void
	{
		createHaxeProject(data, Project.JAVA);
	}
	
	function createCppProject(data:Dynamic):Void
	{
		createHaxeProject(data, Project.CPP);
	}
	
	function createPhpProject(data:Dynamic):Void
	{
		createHaxeProject(data, Project.PHP);
	}
	
	function createNekoProject(data:Dynamic):Void
	{
		createHaxeProject(data, Project.NEKO);
	}
	
	function createFlashProject(data:Dynamic):Void
	{
		createHaxeProject(data, Project.FLASH);
	}
	
	function createJavaScriptProject(data:Dynamic):Void
	{
		createHaxeProject(data, Project.JAVASCRIPT);
	}
	
	function createHaxeProject(data:Dynamic, target:Int):Void
	{
		var pathToSrc:String = Node.path.join(data.projectLocation, data.projectName, "src");
		
		Mkdirp.mkdirp(pathToSrc, function (err:Dynamic, made:String):Void
		{
			var pathToProject:String  = data.projectLocation;
			
			if (data.createDirectory)
			{
				pathToProject = Node.path.join(pathToProject, data.projectName);
			}
			
			var pathToMain:String;
			
			pathToMain = Node.path.join(pathToProject, "src", "Main.hx");
			
			js.Node.fs.writeFile(pathToMain, code, function (error:js.Node.NodeErr):Void
			{
				if (error != null)
				{
					Alertify.error("Write file error" + error);
				}
				
				js.Node.fs.exists(pathToMain, function (exists:Bool):Void
				{
					if (exists)
					{
						var tabManagerInstance = TabManager.get();
						tabManagerInstance.openFileInNewTab(pathToMain);
					}
					else 
					{
						trace(pathToMain + " file was not generated");
					}
				}
				);
			}
			);
			
			var project:Project = new Project();
			project.name = data.projectName;
			project.projectPackage = data.projectPackage;
			project.company = data.projectCompany;
			project.license = data.projectLicense;
			project.url = data.projectURL;
			project.type = Project.HAXE;
			project.target = target;
			ProjectAccess.path = pathToProject;
			
			var filenames = ["flash", "javascript", "neko", "php", "cpp", "java", "csharp", "python"];
			
			var pathToProjectTemplates = Node.path.join("core", "templates", "project");
			
			for (i in 0...filenames.length) 
			{
				var targetData:TargetData = { };
				targetData.pathToHxml = filenames[i] + ".hxml";
				
				var options:NodeFsFileOptions = { };
				options.encoding = NodeC.UTF8;
				
				var templateCode:String = Node.fs.readFileSync(Node.path.join(pathToProjectTemplates, targetData.pathToHxml), options);
				
				var pathToFile:String;
				
				switch (i)
				{
					case Project.FLASH:
						pathToFile = "bin/" + project.name + ".swf";
						targetData.runActionType = Project.FILE;
						targetData.runActionText = pathToFile;
					case Project.JAVASCRIPT:
						pathToFile = "bin/" +  project.name + ".js";
						
						targetData.runActionType = Project.FILE;
						targetData.runActionText = Node.path.join("bin", "index.html");
					case Project.NEKO:
						pathToFile  = "bin/" + project.name + ".n";
						
						targetData.runActionType = Project.COMMAND;
						targetData.runActionText = "neko " + pathToFile;
					case Project.PHP:
						pathToFile = "bin/" + project.name + ".php";
					case Project.CPP:
						pathToFile = "bin";
						
						targetData.runActionType = Project.COMMAND;
						targetData.runActionText = "bin/" + "Main" + "-debug";
                        
                        if (Utils.os == Utils.WINDOWS)
                        {
                            targetData.runActionText += ".exe";
                        }
					case Project.JAVA:
						pathToFile = "bin/" + project.name + ".jar";
					case Project.CSHARP:
						pathToFile = "bin/" + project.name + ".exe";
					case Project.PYTHON:
						pathToFile = "bin/" + project.name + ".py";
						
						targetData.runActionType = Project.COMMAND;
						targetData.runActionText = "python " + pathToFile;
					default:
						throw "Path to file is null";
				}
				
				templateCode = Mustache.render(templateCode, { file: pathToFile } );
				Node.fs.writeFileSync(Node.path.join(pathToProject, targetData.pathToHxml), templateCode, NodeC.UTF8);
				
				project.targetData.push(targetData);
			}
			
			Node.fs.mkdir(Node.path.join(pathToProject, "bin"), null, function (error:NodeErr):Void 
			{
				if (error == null) 
				{
					//JavaScript template from "templates/index.html"
					var updatedPageCode:String = Mustache.render(indexPageCode, { title: project.name, script: project.name + ".js" } );
					var pathToWebPage:String = Node.path.join(pathToProject, "bin", "index.html");
					
					Node.fs.writeFile(pathToWebPage, updatedPageCode, NodeC.UTF8, function (error:js.Node.NodeErr):Void
					{
						if (error != null) 
						{
							trace(error);
							Alertify.error("Generate web page error: " + error);
						}
					}
					);
				}
				else 
				{
					Alertify.error("Folder creation error: " + error);
				}
			});
			
			var path:String = js.Node.path.join(pathToProject, "project.hide");
			ProjectAccess.currentProject = project;
			ProjectAccess.save(OpenProject.openProject.bind(path));
		}
		);
	}
	
}