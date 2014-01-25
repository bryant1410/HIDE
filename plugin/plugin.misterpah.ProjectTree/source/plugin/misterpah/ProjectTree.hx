package plugin.misterpah;
import jQuery.*;
import js.Browser;

@:keep @:expose class ProjectTree
{
	static private var project_content:Dynamic;
    static public function main():Void
    {
	init();
	register_listener();
    }
	
	static private function init()
	{
	var path = "../plugin/" + Type.getClassName(ProjectTree) +"/bin";
	}
	
	
	static public function register_listener():Void
	{
	Main.message.listen("plugin.misterpah.ProjectAccess:open_project.complete","plugin.misterpah.ProjectTree",open_tree,null);
	Main.message.listen("plugin.misterpah.ProjectAccess:close_project.complete","plugin.misterpah.ProjectTree",close_tree,null);
	}
	
	static public function projectTree_openFolder(folder_to_open:String,relativeToCurrentFolder:Bool=true):Void
	{
		if (relativeToCurrentFolder == false)
			{
			var path_content = scan_folder(folder_to_open);
			new JQuery("#sidr-projectTree").append("<div style='background:#2154ac;margin:10px;border:none;' class='well'></div>");
			for (each in path_content)
				{
				var filename = each[0];
				var isFile = each[1];
				if (isFile == true)
					{
					var currentFile = untyped sessionStorage.projectTreeCurrentFolder + Utils.path.sep + each[0];
					currentFile = untyped Utils.repair_path(currentFile);
					new JQuery("#projectTree").append("<a href='#' class='file' onclick='plugin.misterpah.FileAccess.openFileHandler(\""+currentFile+"\")'>"+filename+"</a><br/>");
					}
				else
					{
					new JQuery("#projectTree").append("<a href='#' class='folder' onclick='plugin.misterpah.ProjectTree.projectTree_openFolder(\""+filename+"\")'>["+filename+"]</a><br/>");
					}
				}
			}
		else
			{
			
			}
	}	
	
	static public function compile_message()
	{
	var target:String = untyped $("#ProjectTree_compileTarget").val();
	Main.message.broadcast("plugin.misterpah.ProjectTree:compile_"+target,"plugin.misterpah.ProjectTree");
	}
	
    static public function open_tree():Void
    {
		trace("open tree");

		untyped sessionStorage.projectTreeCurrentFolder = Main.session.project_folder;
		projectTree_openFolder( Main.session.project_folder,false);

		
var compileTo:String = [
'<div style="padding-left:0px;padding-right:0px;padding-top:4px;" class="col-xs-4">',
'Target :',
'</div>',
'<div style="padding-left:0px;padding-right:0px" class="col-xs-8">',
'<select class="form-control" id="ProjectTree_compileTarget">',
'<option>Hxml</option>',
'<option>Flash</option>',
'</select>',
'</div><br/>',
'<button type="button" onclick="plugin.misterpah.ProjectTree.compile_message();" class="btn btn-default btn-block">Compile</button>',
'</div>'].join('\n');
	untyped $("#projectControl").append(compileTo);
	}
	
	static public function close_tree():Void
	{
		trace("close tree");
		untyped $("#projectControl").html("");
		untyped $("#projectTree").html("");
	}
	

	
	static public function scan_folder(scan_path:String):Array<Dynamic>
	{
		var path = untyped Utils.repair_path(scan_path);
		
		var path_content:Array<String> = Utils.fs.readdirSync(path);
		var path_content_folder:Array<Array<String>> = new Array();
		for (each in path_content)
			{
			var is_file = Utils.fs.statSync(path + Utils.path.sep + each).isFile();
			path_content_folder.push([each,is_file]);
			}
		return (path_content_folder);
	}		
}
