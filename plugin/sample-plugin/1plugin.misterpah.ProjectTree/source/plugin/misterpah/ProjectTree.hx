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
	Utils.loadJavascript(path +"/jqueryFileTree/jqueryFileTree.js");
	Utils.loadCss(path +"/jqueryFileTree/jqueryFileTree.css");
	}
	
	
	static public function register_listener():Void
	{
	Main.message.listen("plugin.misterpah.ProjectAccess:open_project.complete","plugin.misterpah.ProjectTree",open_tree,null);
	Main.message.listen("plugin.misterpah.ProjectAccess:close_project.complete","plugin.misterpah.ProjectTree",close_tree,null);
	}
	
    static public function open_tree():Void
    {
		trace("open tree");
		trace(Main.session.project_folder);
		var path = StringTools.replace(Main.session.project_folder,"\\", "\\\\");
		
		untyped walk(path, function(err, results) {
				if (err) throw err;
				project_content = results;
				});
    }

    private static function close_tree()
    {
		trace("close tree");
    }		
}