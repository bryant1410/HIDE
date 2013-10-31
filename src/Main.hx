package ;
import js.Browser;
import js.Lib;
import jQuery.*;

@:keep @:expose class Main {
	
	static public var session:Session;
	static public var file_stack:FileObject;

    static public var plugin_index:Array<Dynamic>;

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
            // needed because STATIC wont generate/call unused HX
            Utils.init_ui();                
			plugin_load_all();
            plugin_manager();
            //plugin_execute_init();
			});
    }

	// the editor will always run this first. 
    static function init()
    {
    	session = new Session();
    	file_stack = new FileObject();
        plugin_index = new Array();
    }

    static function register_plugin(event,data:Map<String,Array<Dynamic>>)
    {
        //trace(data.get('filename'));
        var filename:String = cast(data.get('filename'),String);
        if (filename != 'plugin.sample.Dummy.js')
        {
        plugin_index.push(data);    
        }
        
    }


	
	// this function will manage all of the plugin. including everything regarding HIDE.
    static function plugin_load_all():Void
    {
    	new menu.FileMenu();

        var plugin_list = Utils.list_plugin();       
        for (each in plugin_list)
            {
            //trace(each);
            Utils.loadJavascript("./plugin/"+each);
            //trace(each+".init");
            }
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
                    '<th>Feature</th>',
                    '<th>Version</th>',
                    '</tr>',
                    '</thead>'].join("\n");

        retStr += '<tbody>';
        var i = 0;
        for (each in plugin_index)
        {
        retStr += "<tr>";
        retStr += "<td><input type='checkbox' id='plugin_checkbox"+i+"' value='"+i+"'></td>";
        retStr += "<td>"+each.get("name")+"</td>";
        retStr += "<td>"+each.get("feature")+"</td>";
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

        //trace(activated_plugin);

        if (activated_plugin.length > 0)
        {
        for (each in activated_plugin)
            {
                var plugin_init = each + ".init";
                untyped $(document).triggerHandler(plugin_init);
            }
        }
        else
        {
            // load default plugin

            var default_plugin = new Array();
            default_plugin.push("plugin.misterpah.Editor.js");
            default_plugin.push("plugin.misterpah.FileAccess.js");
            default_plugin.push("plugin.misterpah.ProjectAccess.js");

            trace("default plugin");
            for (each in default_plugin)
            {
                var plugin_init = each + ".init";
                untyped $(document).triggerHandler(plugin_init);
            }            
        }
    }
	
    
}