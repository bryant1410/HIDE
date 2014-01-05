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
	Utils.loadJavascript(path +"/sidr/jquery.sidr.min.js");
	Utils.loadCss(path +"/sidr/stylesheets/jquery.sidr.dark.css");
	}
	
	
	static public function register_listener():Void
	{
	Main.message.listen("plugin.misterpah.ProjectAccess:open_project.complete","plugin.misterpah.ProjectTree",open_tree,null);
	Main.message.listen("plugin.misterpah.ProjectAccess:close_project.complete","plugin.misterpah.ProjectTree",close_tree,null);
	}
	
    static public function open_tree():Void
    {
		trace("open tree");
		var path_content = scan_folder(Main.session.project_folder);
		trace(path_content);
		untyped $("body").prepend('<div id="sidr"></div>');
		untyped $("body").append('<a id="simple-menu" class="tiny button secondary radius" style="display:none;" href="#sidr">Simple menu</a>');
		untyped $("body").append("<style>.active-navbar-header{background:#abc}</style>");
		untyped $(".navbar-brand").attr("href","#sidr");
		untyped $(".navbar-brand").attr("id","simple-menu");
		untyped $(".navbar-brand").html('<span id="project-tree-icon" class="glyphicon glyphicon-th-list"></span> HIDE');
		untyped $("#simple-menu").sidr(
			{ 
			onOpen:function(){
				$("#project-tree-icon").css("color","#5B0400");
				},
			onClose:function(){
				$("#project-tree-icon").css("color","#777");
				}
			});
		untyped $.sidr("open","sidr",function(){} );
	}
	
	static public function close_tree():Void
	{
		untyped $.sidr("close","sidr",function(){} );
		untyped $(".navbar-header").html('<a class="navbar-brand">HIDE</a>');
		trace("close tree");
	}
	
	
	
	static public function scan_folder(scan_path:String):Array<Dynamic>
	{
		var path = StringTools.replace(scan_path,"\\", "\\\\");
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