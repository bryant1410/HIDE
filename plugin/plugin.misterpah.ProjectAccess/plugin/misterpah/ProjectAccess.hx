package plugin.misterpah;
import jQuery.*;
import js.Browser;
import ui.*;
import Utils;

// This is the recommended minimum structure of a HIDE plugin

@:keepSub @:expose class ProjectAccess
{
	private static var plugin:Map<String,String>;
    private static var registered_type:Array<Dynamic>;    

    public static function main()
    {
    	plugin = new Map();
    	plugin.set("name","Project Access"); 
    	plugin.set("filename","plugin.misterpah.ProjectAccess.js");
    	plugin.set("feature","Open Project, Close Project"); // 
    	plugin.set("listen_event","core_project_openProject,core_project_closeProject"); // events listened by this plugin
    	plugin.set("trigger_event",""); // events triggered by this plugin
    	plugin.set("version","0.1");
    	plugin.set("required",""); // other file required by this plugin

    	
        new JQuery(js.Browser.document).on(plugin.get('filename')+'.init',init);
    	Utils.register_plugin(plugin);
        
    }

    public static function init()
    {
        trace(plugin.get("filename")+" started");
        registered_type = new Array();
    	create_ui();
        register_hooks();    	
    }

	public static function create_ui()
	{
	}


	public static function register_hooks()
	{
        new JQuery(js.Browser.document).on("core_project_newProject",new_project_ui);
        new JQuery(js.Browser.document).on("core_project_registerNewTypeProject",registerNewType);    

        new JQuery(js.Browser.document).on("core_project_openProject",open_project);
        new JQuery(js.Browser.document).on("core_project_closeProject",close_project);        
        new JQuery(js.Browser.document).on("plugin_misterpah_projectAccess_openProject_handler",openFileHandler);        
	}

    private static function open_project()
    {
        new ui.FileDialog("plugin_misterpah_projectAccess_openProject_handler");
    }


    private static function openFileHandler(event,path:String):Void
    {
        Main.session.project_xml = path;
        Utils.system_parse_project();
        trace(Main.session);
        new JQuery(js.Browser.document).triggerHandler("core_project_openProject_complete");
    }


    private static function close_project()
    {
        Main.session.project_xml = '';
        Main.session.project_folder = '';
        Main.session.project_xml_parameter = '';
        new JQuery(js.Browser.document).triggerHandler("core_project_closeProject_complete");
    }

    private static function registerNewType(event,data)
    {
        //trace(event);
        registered_type.push(data);
    }

    private static function new_project_ui()
    {
        trace("haha");

        var retStr = "";
        retStr += '<div class="row">';
        for (each in 0...registered_type.length)
        {
            var cur = registered_type[each];
            trace(cur.get("plugin_name"));
            retStr += [
            '<div class="col-xs-2">',
                    '<label>',
                    '<img width=64 class="img-rounded" src="'+cur.get("plugin_image")+'" />',
                    '<p class="text-center"><input type="radio" name="NewProject_radio" value="'+cur.get("plugin_name")+'" /><br/>'+cur.get("plugin_name")+'</p>',
                    '</label>',
            '</div>'].join("\n");
        }
        retStr += '</div>';



        var radio_plugin_name = new Array();
        for (each in 0...registered_type.length)
        {
            var cur = registered_type[each];
            //trace(cur.get("plugin_name"));
            retStr += [
            '<div id="radio_'+cur.get("plugin_name")+'" style="display:none;">',
            '<h2>'+cur.get("plugin_name")+'</h2>',
            '<p>'+cur.get("plugin_description")+'</p>',
            '<p><b>Help:</b> '+cur.get("plugin_help")+'</p>',
            '<p><b>This will execute:</b> '+cur.get("plugin_execute")+'</p>',
            //'<p><b>Project Name:</b> <input style="width:100%;" id="projectName_'+cur.get("plugin_name")+'" value="" /></p>',
            '<p><b>With optional parameter:</b> <input style="width:100%;" id="optional_'+cur.get("plugin_name")+'" value="'+cur.get("plugin_extraParam")+'" /></p>',
            '</div>'
            ].join("\n");

            radio_plugin_name.push("radio_"+cur.get("plugin_name"));
        }

        retStr += '<br/>';
        retStr += '<button style="display:none;" id="NewProject_submit" type="button" class="btn btn-primary btn-lg btn-block">Create Project</button>';



        var dialog = new ui.ModalDialog();
        dialog.title = "New Project";
        dialog.id="new_project_modal_id";
        dialog.content=retStr;
        dialog.header = true;
        dialog.footer = false;
        dialog.show();


        new JQuery("input[name='NewProject_radio']").on("click",function()
            {
                new JQuery("#NewProject_submit").css('display','block');
                for (each in 0...radio_plugin_name.length)
                {
                    //trace(radio_plugin_name[each]);
                    new JQuery("#"+radio_plugin_name[each]).css("display","none");
                }
                var selected = new JQuery("input[name='NewProject_radio']:checked").val();
                //selected.css("display","block");
                new JQuery("#radio_"+selected).css("display","block");
            });

        new JQuery("#NewProject_submit").on("click",function(){
            var selected = new JQuery("input[name='NewProject_radio']:checked").val();
            
            for (each in 0...registered_type.length)
                {           
                var cur = registered_type[each];
                //cur.get("plugin_name");
                if (selected == cur.get("plugin_name"))
                    {
                    //var project_name = new JQuery("#projectName_"+cur.get("plugin_name")).val();
                    var execute = cur.get("plugin_execute");
                    var optional = new JQuery("#optional_"+cur.get("plugin_name")).val();
                    Utils.system_create_project( execute + " "+optional);
                    dialog.hide();
                    }
                }
            });

    }      
  
}