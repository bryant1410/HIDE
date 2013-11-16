package ;
import js.Browser;
import js.Lib;
import jQuery.*;

@:keep @:expose class Main {
	
	static public var session:Session;
	static public var file_stack:FileObject;

    static public var compilemenu:menu.CompileMenu;


    static public var plugin_index:Array<Dynamic>;
    static public var default_plugin:Array<String>;
    static public var plugin_activated:Array<String>;

    static private var modal:ui.ModalDialog;

	// the program starts here	
    static public function main():Void 
    {
    	// execute once everything is loaded
		new JQuery(function():Void
			{		
            init();
            Utils.gui.Window.get().showDevTools();
            new JQuery(js.Browser.document).on("core_register_plugin", register_plugin);

            Utils.init_ui();                
			plugin_load_all();
            plugin_load_default();

            new JQuery(js.Browser.document).on("core_plugin_pluginManager", plugin_manager);
			});
    }

	// the editor will always run this first. 
    static function init()
    {
    	session = new Session();
    	file_stack = new FileObject();
        plugin_index = new Array();
        plugin_activated = new Array();
    }

    static function register_plugin(event,data:Map<String,Array<Dynamic>>)
    {
        var filename:String = cast(data.get('filename'),String);
        if (filename != 'plugin.sample.Dummy.js')
        {
        plugin_index.push(data);    
        }
        
    }

	static function plugin_load_default():Void
  	{	
      // load default plugin




      if (untyped localStorage.default_plugin == null || untyped localStorage.default_plugin == "")
        {
            default_plugin = new Array();
            default_plugin.push("plugin.boyan.ShortcutKey.js");
            default_plugin.push("plugin.misterpah.BuildHxml.js");
            default_plugin.push("plugin.misterpah.Editor.js");
            default_plugin.push("plugin.misterpah.FileAccess.js");
            default_plugin.push("plugin.misterpah.ProjectAccess.js");
            default_plugin.push("plugin.misterpah.ProjectTypeFlixel.js");
            default_plugin.push("plugin.misterpah.ProjectTypeOpenfl.js");            

            untyped localStorage.default_plugin = default_plugin.join(",");
        }


    default_plugin = untyped localStorage.default_plugin.split(",");


    trace("default plugin");
    for (each in default_plugin)
        {
           plugin_activated.push(each);
           var plugin_init = each + ".init";
           untyped $(document).triggerHandler(plugin_init);
    	}          
  	}
	
	// this function will manage all of the plugin. including everything regarding HIDE.
    static function plugin_load_all():Void
    {
    	new menu.FileMenu();
        new menu.EditMenu();
        compilemenu = new menu.CompileMenu();



        var plugin_list = Utils.list_plugin();       
        for (each in plugin_list)
            {
            Utils.loadJavascript("./plugin/"+each);
            }
    }



    static function plugin_execute_init(event):Void
    {
        // execute plugin which selected;


        modal.hide();
        var activated_plugin = new Array();

        for (i in 0...plugin_index.length)
        {
            var checkbox_checked = new JQuery("#plugin_checkbox"+i).prop("checked");
            if (checkbox_checked == true)
            {
                var cur = plugin_index[i];
                activated_plugin.push(cur.get('filename'));
            }
        }        

        trace(activated_plugin);

        untyped localStorage.default_plugin = activated_plugin.join(",");

        var notify = new ui.Notify();
        notify.content = "Please restart HIDE to take effect.";
        notify.show();
    }
	
    












    static function plugin_manager():Void
    {
        modal = new ui.ModalDialog();
        modal.title = "HIDE Plugin Manager";
        modal.id = "plugin_manager";
        var retStr ="<div style='height:300px;overflow:scroll;width:100%;'>";

        retStr += ['<div class="panel panel-default">'
            ].join("\n");

        retStr += ['<table class="table">',
                    '<thead>',
                    '<tr>',
                    '<th>Activate</th>',
                    '<th>Plugin Name</th>',
                    /*'<th>Feature</th>',*/
                    '<th>Version</th>',
                    '</tr>',
                    '</thead>'].join("\n");

        retStr += '<tbody>';
        var i = 0;

        for (each in plugin_index)
        {
        var default_plugin_loaded = untyped $.inArray(each.get("filename"),default_plugin);
        //trace(default_plugin_loaded);
        retStr += "<tr>";
        if (default_plugin_loaded == -1)
            {
            retStr += "<td><input type='checkbox' id='plugin_checkbox"+i+"' value='"+i+"'></td>";        
            }
        else
            {
             retStr += "<td><input type='checkbox' id='plugin_checkbox"+i+"' value='"+i+"' checked></td>";
            }
        
        retStr += "<td>"+each.get("name")+"</td>";
        //retStr += "<td>"+each.get("feature")+"</td>";
        retStr += "<td>"+each.get("version")+"</td>";
        retStr += "</tr>";
        i+= 1;
        }
        retStr += '</tbody>';
        retStr += '</table>';

        retStr += [
            '</div>'].join("\n");        


        retStr += "</div>";
        modal.ok_text = "Activate Plugin";
        modal.cancel_text = "Cancel";
        modal.content = retStr;
        modal.header = true;
        
        modal.show();


        new JQuery("#plugin_manager .button_ok").click(plugin_execute_init);
    }    
}