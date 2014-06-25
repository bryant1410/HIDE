package parser;
import core.Completion;
import core.HaxeHelper;
import core.Hotkeys;
import core.ProcessHelper;
import core.Utils;
import dialogs.BrowseDirectoryDialog;
import dialogs.DialogManager;
import dialogs.ModalDialog;
import haxe.ds.StringMap.StringMap;
import js.Browser;
import js.Node;
import js.node.Walkdir;
import openflproject.OpenFLTools;
import projectaccess.Project;
import projectaccess.ProjectAccess;
import watchers.LocaleWatcher;
import watchers.SettingsWatcher;
import parser.ClassParser.FileData;

/**
 * ...
 * @author 
 */
class ClasspathWalker
{
	public var pathToHaxeStd:String;
	public var pathToHaxe:String;
    
	static var instance:ClasspathWalker;
	
	public static function get()
	{
		if (instance == null)
		{
			instance = new ClasspathWalker();
		}
			
		return instance;
	}
	
	public function new():Void 
	{		
		var localStorage2 = Browser.getLocalStorage();
		
		var paths:Array<String> = [Node.process.env.HAXEPATH, Node.process.env.HAXE_STD_PATH, Node.process.env.HAXE_HOME];
		
		if (localStorage2 != null) 
		{
			var path = localStorage2.getItem("pathToHaxe");
			paths.insert(0, path);
		}
		
		switch (Utils.os) 
		{
			case Utils.WINDOWS:
				paths.push("C:/HaxeToolkit/haxe");
			case Utils.LINUX, Utils.MAC:
				paths.push("/usr/lib/haxe");
			default:
				
		}
		
		for (envVar in paths)
		{
			if (envVar != null) 
			{
				pathToHaxeStd = getHaxeStdFolder(envVar);
				
				if (pathToHaxeStd != null) 
				{
					pathToHaxe = envVar;
					localStorage2.setItem("pathToHaxe", pathToHaxe);
					break;
				}
			}
		}
		
		if (pathToHaxeStd == null) 
		{
			showHaxeDirectoryDialog();
		}
		else 
		{
			parseClasspath(pathToHaxeStd, true);
		}
	}
	
	public function showHaxeDirectoryDialog()
	{
		var localStorage2 = Browser.getLocalStorage();
		
		var currentLocation = "";
		
		var pathToHaxe2 = localStorage2.getItem("pathToHaxe");
		
		if (pathToHaxe2 != null) 
		{
			currentLocation = pathToHaxe2;
		}
		
		DialogManager.showBrowseFolderDialog("Please specify path to Haxe compiler(parent folder of std): ", function (path:String):Void 
		{
			pathToHaxeStd = getHaxeStdFolder(path);
			
			if (pathToHaxeStd != null)
			{
				parseClasspath(pathToHaxeStd, true);
				pathToHaxe = path;
				localStorage2.setItem("pathToHaxe", pathToHaxe);
				DialogManager.hide();
			}
			else 
			{
				Alertify.error(LocaleWatcher.getStringSync("Can't find 'std' folder in specified path"));
			}
		}, currentLocation, "Download Haxe", "http://haxe.org/download");
	}
	
	function getHaxeStdFolder(path:String):String
	{
		var pathToStd:String = null;
		
		var fileName = "haxe";
		
		switch (Utils.os)
		{
			case Utils.WINDOWS:
				fileName += ".exe";
			default:

		}
		
		if (Node.fs.existsSync(Node.path.join(path, fileName)))
		{
			if (Node.fs.existsSync(path)) 
			{
				if (Node.fs.existsSync(Node.path.join(path, "Std.hx"))) 
				{
					pathToStd = path;
				}
				else 
				{
					path = Node.path.join(path, "std");

					if (Node.fs.existsSync(path))
					{
						pathToStd = getHaxeStdFolder(path);
					}
				}
			}
		}
		
		return pathToStd;
	}

	public function parseProjectArguments():Void 
	{
		ClassParser.classCompletions = new StringMap();
		ClassParser.filesList = [];
		
		ClassParser.topLevelClassList = [];
		ClassParser.importsList = [];
		
		if (ProjectAccess.path != null) 
		{
			var project = ProjectAccess.currentProject;
			
			switch (project.type) 
			{
				case Project.HAXE, Project.HXML:
					var path:String;
					
					if (project.type == Project.HAXE) 
					{
						path = Node.path.join(ProjectAccess.path, project.targetData[project.target].pathToHxml);
					}
					else 
					{
						path = Node.path.join(ProjectAccess.path, project.main);
					}
					
					var options:js.Node.NodeFsFileOptions = { };
					options.encoding = NodeC.UTF8;
					
					var data:String = Node.fs.readFileSync(path, options);
					getClasspaths(data.split("\n"));
				case Project.OPENFL:
					OpenFLTools.getParams(ProjectAccess.path, project.openFLTarget, function (stdout:String):Void 
					{
						getClasspaths(stdout.split("\n"));
					});
				default:
					
			}
		}
		
		walkProjectDirectory(ProjectAccess.path);
	}
        
    function getFileDirectory(relativePath:String):String
	{
        var directory:String = "";
        
        if (relativePath.indexOf("/") != -1)
        {
            directory = relativePath.substring(0, relativePath.lastIndexOf("/"));
        }
        else if (relativePath.indexOf("\\") != -1)
        {
            directory = relativePath.substring(0, relativePath.lastIndexOf("\\"));
        }
            
        return directory;
    }
	
	function getClasspaths(data:Array<String>)
	{
		var classpaths:Array<String> = [];
		
		for (arg in parseArg(data, "-cp")) 
		{
			var classpath:String = Node.path.resolve(ProjectAccess.path, arg);
			classpaths.push(classpath);
		}
		
		for (path in classpaths) 
		{
			parseClasspath(path);
		}
		
		var libs:Array<String> = parseArg(data, "-lib");
		
		processHaxelibs(libs, parseClasspath);
	}
	
	function processHaxelibs(libs:Array<String>, onPath:String->Bool->Void):Void 
	{		
		for (arg in libs) 
		{
			var processHelper = ProcessHelper.get();
			 
			processHelper.runProcess("haxelib", ["path", arg], null, function (stdout:String, stderr:String):Void 
			{
				for (path in stdout.split("\n")) 
				{
					if (path.indexOf(Node.path.sep) != -1) 
					{
						path = StringTools.trim(path);
						path = Node.path.normalize(path);
						
						Node.fs.exists(path, function (exists:Bool)
						{
							if (exists) 
							{
								onPath(path, false);
							}
						}
						);
					}
				}
			}
			);
		}
	}
	
	private function parseArg(args:Array<String>, type:String):Array<String>
	{
		var result:Array<String> = [];
		
		for (arg in args)
		{
			arg = StringTools.trim(arg);
			
			if (StringTools.startsWith(arg, type)) 
			{
				result.push(arg.substr(type.length + 1));
			}
		}
		
		return result;
	}
	
	function parseClasspath(path:String, ?std:Bool = false):Void
	{        
        if (Main.sync)
        {
            for (pathToFile in Walkdir.walkSync(path))
            {
                var stat = js.Node.fs.lstatSync(pathToFile);
                
                if (stat.isFile())
                {
               		processFile(pathToFile, std);    
                }
            }
        }
        else
        {
            var emitter = Walkdir.walk(path, {});
		
            emitter.on("file", function (pathToFile, stat):Void 
            {
                processFile(pathToFile, std);
            }
            );

            emitter.on("error", function (pathToFile:String, stat):Void 
            {
                trace(pathToFile);
            }
            );
        }
	}
	
    function processFile(path:String, std:Bool)
    {
        addFile(path, std);

        var options:NodeFsFileOptions = { };
       	options.encoding = NodeC.UTF8;
            
        if (Node.path.extname(path) == ".hx") 
        {
            Node.fs.readFile(path, options, function (error:NodeErr, data:String):Void 
            {
                if (error == null) 
                {
                    ClassParser.processFile(data, path, std);
                }
            }
            );
        }
    }

	function getFileIndex(pathToFile:String, list:Array<FileData>):Int
	{
        var index:Int = -1;
            
        for (i in 0...list.length)
        {
            if (list[i].path == pathToFile)
            {
                index = i;
                break;
            }
        }
            
        return index;
    }

	public function addFile(path:String, ?std:Bool = false)
	{
        var relativePath:String;
        var list:Array<FileData>;
        
		var completionInstance = Completion.get();
		
		if (!SettingsWatcher.isItemInIgnoreList(path) && !ProjectAccess.isItemInIgnoreList(path)) 
		{            
            if (std)
            {
                list = ClassParser.haxeStdFileList;
            }
            else
            {
                list = ClassParser.filesList;
            }
                
            if (ProjectAccess.path != null && (core.Utils.os == core.Utils.WINDOWS || !std))
            {
                relativePath = Node.path.relative(ProjectAccess.path, path);

                if (getFileIndex(relativePath, list) == -1)
                {
                    list.push({path: relativePath, directory: getFileDirectory(relativePath), displayText: completionInstance.processDisplayText(relativePath), filename: js.Node.path.basename(relativePath)});
                }
            }
            else if (getFileIndex(path, list) == -1)
            {
                list.push({path: path, directory: getFileDirectory(path), displayText: completionInstance.processDisplayText(path), filename: Node.path.basename(path)});
            }            
		}
	}
	
	public function removeFile(path:String)
	{
		var relativePath;
		
        var index:Int = -1;
        
        for (list in [ClassParser.haxeStdFileList, ClassParser.filesList])
        {
			if (ProjectAccess.path != null) 
            {
                relativePath = Node.path.relative(ProjectAccess.path, path);

                index = getFileIndex(relativePath, list);

                if (index != -1)
                {
                    list.remove(list[index]);    
                }
            }

            index = getFileIndex(path, list);

            if (index != -1)
            {
                list.remove(list[index]);    
            }
        }
	}
	
	function walkProjectDirectory(path:String):Void 
	{
        if (Main.sync)
        {
			Walkdir.walkSync(path, {}, function (path:String, stat:js.Node.NodeStat)
                            {
                                if (stat.isFile())
                                {
                                    addFile(path);
                                }
                            }
                            );
        }
        else
        {
            var emitter = Walkdir.walk(path, {});

            var options:NodeFsFileOptions = { };
            options.encoding = NodeC.UTF8;

            emitter.on("file", function (path, stat):Void 
            {			
                addFile(path);
            }
            );

            emitter.on("error", function (path:String, stat):Void 
            {
                trace(path);
            }
            );
        }
	}
	
}