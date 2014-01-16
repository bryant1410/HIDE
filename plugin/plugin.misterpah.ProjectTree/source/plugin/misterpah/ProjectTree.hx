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
					new JQuery("#sidr-projectTree .well").append("<a href='#' style='color:#eaf1fe;font-weight:bold;' onclick='plugin.misterpah.FileAccess.openFileHandler(\""+currentFile+"\")'>"+filename+"</a><br/>");
					}
				else
					{
					new JQuery("#sidr-projectTree .well").append("<a href='#' onclick='plugin.misterpah.ProjectTree.projectTree_openFolder(\""+filename+"\")'>["+filename+"]</a><br/>");
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
		
		untyped $("body").prepend('<div id="sidr"></div>');
		
		untyped $("#sidr").append('<div id="sidr-projectControl"></div>');
		untyped $("#sidr").append('<div id="sidr-projectTree"></div>');
		untyped sessionStorage.projectTreeCurrentFolder = Main.session.project_folder;
		projectTree_openFolder( Main.session.project_folder,false);

		
var compileTo:String = [
'<style>#sidr-projectControl select {background: #2154ac;color:#ffffff;border:1px solid #ffffff;}</style>',
'<div style="margin:10px;color:#ffffff;background:#2154ac;border:0px;" class="well">',
'<div style="padding-left:0px;padding-right:0px;padding-top:4px;" class="col-xs-4">',
'Target :',
'</div>',
'<div style="padding-left:0px;padding-right:0px" class="col-xs-8">',
'<select id="ProjectTree_compileTarget">',
'<option>Hxml</option>',
'<option>Flash</option>',
'</select>',
'</div>',
'<button type="button" onclick="plugin.misterpah.ProjectTree.compile_message();" class="btn btn-default btn-block">Compile</button>',
'<div style="clear:both"></div>',
'</div>'].join('\n');
		
		untyped $("#sidr-projectControl").append(compileTo);
		untyped $("body").append('<a id="simple-menu" class="tiny button secondary radius" style="display:none;" href="#sidr">Simple menu</a>');
		untyped $("body").append("<style>.active-navbar-header{background:#abc}</style>");
		untyped $(".navbar-brand").attr("href","#sidr");
		untyped $(".navbar-brand").attr("id","simple-menu");
		untyped $(".navbar-brand").html('<span id="project-tree-icon" class="glyphicon glyphicon-th-list"></span> HIDE');
		untyped $("#simple-menu").sidr(
			{ 
			onOpen:function(){
				trace("open");
				untyped $(".navbar-default").css("border-left","1px solid #397ff6");
				untyped $(".sidr").css("border-top","1px solid #e7e7e7");			
				untyped $(".sidr").css("background","#397ff6");			
				untyped $(".sidr").css("box-shadow","none");
				untyped $("#project-tree-icon").css("color","#ffffff");
				untyped $(".navbar-header").css("background","#397ff6");
				untyped $(".navbar-header a").css("color","#ffffff");
				},
			onClose:function(){
				trace("close");
				untyped $(".navbar-default").css("border-left","1px solid #e7e7e7");
				untyped $("#project-tree-icon").css("color","rgb(119,119,119)");
				untyped $(".navbar-header").css("background","none");
				untyped $(".navbar-header a").css("color","rgb(119,119,119)");
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
