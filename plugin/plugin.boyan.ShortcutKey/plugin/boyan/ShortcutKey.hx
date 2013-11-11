package plugin.boyan;

import jQuery.*;
import js.Browser;
import js.html.KeyboardEvent;

// This is the recommended minimum structure of a HIDE plugin

@:keepSub @:expose class ShortcutKey
{
	private static var plugin:Map<String,String>;

    public static function main()
    {
    	plugin = new Map();
    	plugin.set("name","Shortcut Key"); 
    	plugin.set("filename","plugin.boyan.ShortcutKey.js");
    	plugin.set("feature","Shortcut"); // 
    	plugin.set("listen_event",""); // events listened by this plugin
    	plugin.set("trigger_event",""); // events triggered by this plugin
    	plugin.set("version","0.1");
    	plugin.set("required",""); // other file required by this plugin

    	
        new JQuery(js.Browser.document).on(plugin.get('filename')+'.init',init);
    	Utils.register_plugin(plugin);
        
    }

    public static function init()
    {
        trace(plugin.get("filename")+" started");
    	create_ui();
        register_hooks();    	
    }

	public static function create_ui()
	{
	}


    static private function register_hooks():Void
    {
        Browser.window.addEventListener("keyup", function (e:KeyboardEvent)
        {
            if (e.ctrlKey)
            {
                if (!e.shiftKey)
                {
                    switch (e.keyCode) 
                    {
                        //Ctrl-O
                        case 79:
                            new JQuery(js.Browser.document).triggerHandler("core_file_openFile");
                        //Ctrl-S
                        case 83:
                            new JQuery(js.Browser.document).triggerHandler("core_file_save");
                        //Ctrl-N
                        case 'N'.code:
                            new JQuery(js.Browser.document).triggerHandler("core_file_newFile");
                        //Ctrl-W
                        case 'W'.code:
                            new JQuery(js.Browser.document).triggerHandler("core_file_close");
                        default:
                            
                    }           
                }
                else
                {
                    switch (e.keyCode) 
                    {
                        //Ctrl-Shift-0
                        case 48:
                            //Utils.window.zoomLevel = 0;
                        //Ctrl-Shift-'-'
                        case 189:
                            //Utils.zoomOut();
                        //Ctrl-Shift-'+'
                        case 187:
                            //Utils.zoomIn();
                        //Ctrl-Shift-Tab
                        case 9:
                            //TabsManager.showPreviousTab();
                            //e.preventDefault(); 
                            //e.stopPropagation(); 
                        //Ctrl-Shift-O
                        case 79:
                            //ProjectAccess.openProject();
                            new JQuery(js.Browser.document).triggerHandler("core_project_openProject");
                        //Ctrl-Shift-S
                        case 83:
                            //FileAccess.saveActiveFileAs();
                        //Ctrl-Shift-T
                        case 'T'.code:
                            //TabsManager.applyRandomTheme();
                        case 'N'.code:
                            //ProjectAccess.createNewProject();
                        case 'R'.code:
                            //Utils.window.reloadIgnoringCache();
                        default:
                            
                    }       
                }
            }
            else
            {
                if (e.keyCode == 13 && e.shiftKey && e.altKey)
                {
                    //Utils.toggleFullscreen();
                }
                //F5
                else if (e.keyCode == 116)
                {
                    /*
                    if (ProjectAccess.currentProject != null)
                    {
                        //BuildTools.runProject();
                    }
                    */
                }
                //F8
                else if (e.keyCode == 119) 
                {
                    /*
                    if (ProjectAccess.currentProject != null)
                    {
                        //BuildTools.buildProject();
                    }
                    */
                }

                // F4 + ALT
                else if (e.keyCode == 115 && e.altKey)
                {
                    untyped window.close();
                }                
            }
        });
    }    
}