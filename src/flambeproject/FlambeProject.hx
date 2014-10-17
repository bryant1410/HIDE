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
		FlambeAlert.creteCSS();
		
		NewProjectDialog.getCategory(FlambeConstants.CATEGORY_NAME, FlambeConstants.CATEGORY_POSITION).addItem(FlambeConstants.CATEGORY_ITEM_1, createFlambeProject);
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
		//project.buildActionCommand = ["haxelib", "run", "lime", "build", '"%path%"', project.openFLTarget, "--connect", "5000"].join(" ");//??
		project.runActionType = Project.COMMAND;
		//project.runActionText = ["haxelib", "run", "lime", "run", '"%path%"', project.openFLTarget].join(" ");//??
		
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
			//OpenProject.openProject.bind(path);
			OpenProject.openProject(path);
			//open main file
			var pathToSrc:String = Node.path.join(__data.projectLocation, __data.projectName, "src");
			
			var pathToMain = Node.path.join(pathToSrc, FlambeConstants.DEAFULT_PACK, "Main.hx");
			var tabManagerInstance = TabManager.get();
			tabManagerInstance.openFileInNewTab(pathToMain,true,onCompleteOpenProject);		
		}		
		ProjectAccess.currentProject.main = FlambeConstants.DEAFULT_PACK + "/Main.hx";
		ProjectAccess.save(onOpenProjectHadler);			
	}	
	
	function onCompleteOpenProject(__code:String) 
	{
		Alertify.success("OpenProjectCompleted");
		FlambeHeaderMenu.get().create();
	}
	
}