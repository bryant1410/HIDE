package plugin.misterpah;
import jQuery.*;
import js.Browser;

@:keep @:expose class ProjectAccess
{
	static private var plugin:Map<String,String>;

    static public function main():Void
    {
	register_listener();
	register_shortcutkey();
    }
	
	static private function register_shortcutkey():Void
	{
	untyped $.keyStroke( 79, { modKeys: ['ctrlKey','shiftKey'] }, function(){  Main.message.broadcast("core:FileMenu.openProject","plugin.misterpah.FileAccess"); }); // CTRL + SHIFT + O
	}	
	
	static public function register_listener():Void
	{
	Main.message.listen("core:FileMenu.openProject","plugin.misterpah.ProjectAccess",open_project,null);
	Main.message.listen("core:FileMenu.closeProject","plugin.misterpah.ProjectAccess",close_project,null);
	Main.message.listen("core:utils.system_parse_project.complete","plugin.misterpah.ProjectAccess",parse_project_complete,null);
	
	}
	
    static public function open_project():Void
    {
        var filedialog = new ui.FileDialog();
		filedialog.show(openProjectHandler);
    }

    static private function openProjectHandler(path:String,newFile:Bool=false):Void
    {
        Main.session.project_xml = path;
        Utils.system_parse_project();
    }	
	
	static private function parse_project_complete():Void
	{
		Main.message.broadcast("plugin.misterpah.ProjectAccess:open_project.complete","plugin.misterpah.ProjectAccess");
	}
	
	
    private static function close_project()
    {
        Main.session.project_xml = '';
        Main.session.project_folder = '';
        Main.session.project_xml_parameter = '';
		Main.message.broadcast("plugin.misterpah.ProjectAccess:close_project.complete","plugin.misterpah.ProjectAccess");
    }
}