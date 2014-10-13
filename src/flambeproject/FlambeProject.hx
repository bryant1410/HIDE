package flambeproject;
import core.FileDialog;
import core.ProcessHelper;
import core.Splitter;
import filetree.FileTree;
import flambeproject.CreateFlambeProject;
import haxe.Template;
import haxe.Timer;
import js.Browser;
import js.html.CSSRule;
import js.html.CSSStyleSheet;
import js.html.StyleSheet;
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
		var cssStyleSheet = Browser.document.createElement("style");
		cssStyleSheet.innerText = ".alertify-log-doing {	color: #0eb5b5;		background: #a0dede;		border: 1px solid #c6e9e9;	}";
		Browser.document.head.appendChild(cssStyleSheet);
		NewProjectDialog.getCategory("Flambe", 3).addItem("Flambe Project", createFlambeProject);
		FlambeHeaderMenu.get().destroy();
	}
	
	public function createFlambeProject(data:ProjectData):Void
	{			
		setupData(data);
		runNewFlambe(data,
		function()
		{
			openProject(data);
		});		
		
	}
	
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
		project.buildActionCommand = ["haxelib", "run", "lime", "build", '"%path%"', project.openFLTarget, "--connect", "5000"].join(" ");//??
		project.runActionType = Project.COMMAND;
		project.runActionText = ["haxelib", "run", "lime", "run", '"%path%"', project.openFLTarget].join(" ");//??
		
		ProjectAccess.currentProject = project;		
	}
	
	function runNewFlambe(__data:ProjectData, __callback:Dynamic) 
	{
		CreateFlambeProject.createProject(__data,__callback);		
	}
	
	function openProject(__data:ProjectData) 
	{
		var path:String = js.Node.path.join(ProjectAccess.path, "project.hide");
		var onOpenProjectHadler = function ():Void
		{			
			OpenProject.openProject.bind(path);
			//open main file
			var pathToSrc:String = Node.path.join(__data.projectLocation, __data.projectName, "src");
			var pathToMain = Node.path.join(pathToSrc, "urgame", "Main.hx");
			var tabManagerInstance = TabManager.get();
			tabManagerInstance.openFileInNewTab(pathToMain);
		}
			
	
		ProjectAccess.save(onOpenProjectHadler);	
		
	}	
}