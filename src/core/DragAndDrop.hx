package core;
import filetree.FileTree;
import js.Browser;
import openproject.OpenProject;

/**
 * ...
 * @author AS3Boyan
 */
class DragAndDrop
{	
	//If this plugin is selected as active in HIDE, then HIDE will call this function once on load	
	public static function prepare():Void
	{		
		Browser.window.addEventListener("dragover", function(e) 
		{
			e.preventDefault();
			e.stopPropagation();
			return false;
		}
		);
		
		Browser.window.addEventListener("drop", function(e:Dynamic) 
		{
			e.preventDefault();
			e.stopPropagation();
			
			for (i in 0...e.dataTransfer.files.length) 
			{
				var path:String = e.dataTransfer.files[i].path;
				js.Node.fs.stat(path, function (err, stats:js.Node.NodeStat)
				{
					var success = OpenProject.openProject(path);
					
					if (!success)
					{
						var filetreeInstance = FileTree.get();
						filetreeInstance.load(js.Node.path.basename(path), path);
					}
				}
				);
				
				
			}

			return false;
		}
		);
	}
	
}