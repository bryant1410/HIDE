package flambeproject;
import core.ProcessHelper;
import core.Splitter;
import filetree.FileTree;
import flambeproject.CreateFlambeProject;
import haxe.Template;
import js.Browser;
import js.html.TextAreaElement;
import js.Node;
import newprojectdialog.NewProjectDialog;
import openproject.OpenProject;
import projectaccess.Project;
import projectaccess.ProjectAccess;
import projectaccess.ProjectOptions;
import tabmanager.TabManager;
/**
 * @author espigah
 * null
 * null
 */
class FlambeProject
{
	static var instance:FlambeProject;
	
	public static function get()
	{
		if (instance == null)
		{
			instance = new FlambeProject();
		}
			
		return instance;
	}
	
	public function new():Void
	{
		NewProjectDialog.getCategory("Flambe", 3).addItem("Flambe Project", createFlambeProject);		
	}
	
	public function createFlambeProject(data:ProjectData):Void
	{	
		//var params:Array<String>;
		//
			//var str:String = "";
		//
			//if (data.projectPackage != "")
			//{
				//str = data.projectPackage + ".";
			//}
			
			//params = ["openfl:project", "\"" + str + data.projectName + "\""];
			
// 			if (data.projectCompany != "")
// 			{
// 				params.push("\"" + data.projectCompany + "\"");
// 			}
		
		
		setupData(data);
		runNewFlambe(data);
		//createTemplate(data);
		
	}
	
	function runNewFlambe(__data:ProjectData) 
	{
		CreateFlambeProject.createProject(__data);
		
		//processHelper.runPersistentPr"
			
	}
	
	
// 		CreateFlambeProject.createProject(params, data.projectLocation, function ()
// 		{	
// 			var pathToProject:String = js.Node.path.join(data.projectLocation, data.projectName);
			
// 			createProject(data);
			
// 			var tabManagerInstance = TabManager.get();
// 			tabManagerInstance.openFileInNewTab(js.Node.path.join(pathToProject, "Source", "Main.hx"));
// 		}
// 		);
	
	function setupData(__data:ProjectData):Void
	{
		var pathToProject:String = js.Node.path.join(__data.projectLocation, __data.projectName);
			
		var project:Project = new Project();
		project.name = __data.projectName;
		project.projectPackage = __data.projectPackage;
		project.company = __data.projectCompany;
		project.license = __data.projectLicense;
		project.url = __data.projectURL;
		project.type = Project.FLAMBE;
		project.target = Project.FLAMBE;
		ProjectAccess.path = pathToProject;
		project.buildActionCommand = ["haxelib", "run", "lime", "build", '"%path%"', project.openFLTarget, "--connect", "5000"].join(" ");
		project.runActionType = Project.COMMAND;
		project.runActionText = ["haxelib", "run", "lime", "run", '"%path%"', project.openFLTarget].join(" ");
		
		//ProjectAccess.currentProject = project;
		//
		//
		//
		//ProjectAccess.save(function ():Void 
		//{
			//var path:String = js.Node.path.join(pathToProject, "project.hide");
			//OpenProject.openProject(path);
		//}
		//);
	}
	function createTemplate(__data:ProjectData) 
	{
		var pathToProjectTemplates = Node.path.join("core", "templates", "project");
		createYamlFile(pathToProjectTemplates,__data);
	}

	function createYamlFile(__pathToProjectTemplates:String,__data:ProjectData):Void 
	{		
		var options:NodeFsFileOptions = { };
		
		var temapltePath:String = "flambe/";
		var targetFile:String = "flambe.yaml";
		options.encoding = NodeC.UTF8;
		var templateCode:String = Node.fs.readFileSync(Node.path.join(__pathToProjectTemplates+"/"+temapltePath, targetFile), options);
		var pathToFile:String;
		var templateCode = new Template(templateCode).execute( { file: "bin/" + ProjectAccess.currentProject.name + ".swf", pack: __data.projectPackage, dev_name:"teste" } );
		
		var pathJoins:String = Node.path.join(__data.projectLocation+"\\"+__data.projectName, targetFile);
		trace(__data, templateCode, pathJoins );
		Node.fs.writeFileSync(pathJoins, templateCode, NodeC.UTF8);
		
	}
}