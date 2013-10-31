package plugin.misterpah;
import jQuery.*;
import js.Browser;
import ui.*;


// This is the recommended minimum structure of a HIDE plugin

@:keepSub @:expose class FileAccess
{
	static private var plugin:Map<String,String>;

    static public function main()
    {
    	plugin = new Map();
    	plugin.set("name","Misterpah FileAccess"); 
    	plugin.set("filename","plugin.misterpah.FileAccess.js");
    	plugin.set("feature","New File,Open File,Save File,Close File"); // 
    	plugin.set("listen_event","core_file_newFile,core_file_openFile,core_file_save,core_file_close"); // events listened by this plugin
    	plugin.set("trigger_event","plugin_misterpah_fileAccess_openFile_complete,plugin_misterpah_fileAccess_closeFile_complete"); // events triggered by this plugin
    	plugin.set("version","0.1");
    	plugin.set("required",""); // other file required by this plugin

    	
        new JQuery(js.Browser.document).on(plugin.get('filename')+'.init',init);
    	Utils.register_plugin(plugin);
        
    }

    static public function init()
    {
        trace(plugin.get("filename")+" started");
    	create_ui();
        register_hooks();    	
    }

	static public function create_ui()
	{
        // not used, but please keep it here
	}


	static public function register_hooks()
	{
        new JQuery(js.Browser.document).on("core_file_newFile",new_file);
        new JQuery(js.Browser.document).on("core_file_openFile",open_file);
        new JQuery(js.Browser.document).on("core_file_save",save_file);
        new JQuery(js.Browser.document).on("core_file_close",close_file);       

        // special case. some bug makes FileDialog can't triggerHandler to document
        new JQuery(js.Browser.document).on("plugin_misterpah_fileAccess_open_file_handler",openFileHandler);        
	}



    static private function new_file()
    {
        trace("new_file bebeh");
    }


    static private function open_file()
    {
        var filedialog = new ui.FileDialog("plugin_misterpah_fileAccess_open_file_handler");
    }


    static public function openFileHandler(event,path:String):Void
    {
        trace(path);
        trace(Main.file_stack.find(path));
        var find = Main.file_stack.find(path);
        if (find[0] == "null" || find[0] == "not found")
        {
            var content = Utils.system_openFile(path);
            var filename_split = path.split(Utils.path.sep);
            var className = filename_split[filename_split.length-1].split('.')[0];

            Main.file_stack.add(path,content,className);

            Main.session.active_file = path;

            new JQuery(js.Browser.document).triggerHandler("core_file_openFile_complete");
        }
    }

    static public function save_file()
    {
        var path = Main.session.active_file;
        var file_obj = Main.file_stack.find(path);
        Utils.system_saveFile(path,file_obj[1]);
    }

    static public function close_file()
    {
        var path = Main.session.active_file;
        Main.file_stack.remove(path);
        new JQuery(js.Browser.document).triggerHandler("core_file_closeFile_complete");
    }    
}