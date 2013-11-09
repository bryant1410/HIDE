package plugin.misterpah;
import jQuery.*;
import js.Browser;
import ui.*;
import Utils;

// This is the recommended minimum structure of a HIDE plugin

@:keepSub @:expose class Editor
{
	private static var plugin:Map<String,String>;
    private static var tab_index:Array<String>;
    private static var cm:CodeMirror;
    public static var completion_list:Array<String>;
    private static var cursor_type:String;


    public static function main()
    {
    	plugin = new Map();
    	plugin.set("name","Misterpah Editor"); 
    	plugin.set("filename","plugin.misterpah.Editor.js");
    	plugin.set("feature","Editor,Completion"); // 
    	plugin.set("listen_event","core_file_openFile_complete,core_utils_getCompletion_complete"); // events listened by this plugin
    	plugin.set("trigger_event","core_file_save"); // events triggered by this plugin
    	plugin.set("version","0.1");
    	plugin.set("required",""); // other file required by this plugin

    	
        new JQuery(js.Browser.document).on(plugin.get('filename')+'.init',init);
    	Utils.register_plugin(plugin);
        
    }

    public static function init()
    {
        trace(plugin.get("filename")+" started");
        tab_index = new Array();
        completion_list = new Array();

        Utils.loadJavascript("./plugin/support_files/plugin.misterpah/codemirror-3.15/lib/codemirror.js");
        Utils.loadJavascript("./plugin/support_files/plugin.misterpah/codemirror-3.15/mode/haxe/haxe.js");
        Utils.loadJavascript("./plugin/support_files/plugin.misterpah/jquery.xml2json.js");

        // somehow show-hint 3.18 were not working. we'll be use show-hint.js version 3.15;
        Utils.loadJavascript("./plugin/support_files/plugin.misterpah/codemirror-3.15/addon/hint/show-hint.js");
        Utils.loadJavascript("./plugin/support_files/plugin.misterpah/codemirror.hint.haxe.js");
        Utils.loadCss("./plugin/support_files/plugin.misterpah/codemirror-3.15/lib/codemirror.css");
        Utils.loadCss("./plugin/support_files/plugin.misterpah/codemirror-3.15/addon/hint/show-hint.css");

        create_ui();
        register_hooks(); 

    }


    public static function create_ui()
    {

        new JQuery("#editor_position").css("display","none");
        new JQuery("#editor_position").append("<div style='margin-top:10px;' id='misterpah_editor_tabs_position'><ul class='nav nav-tabs'></ul></div>");
        new JQuery("#editor_position").append("<div id='misterpah_editor_cm_position'></div>");
        new JQuery("#misterpah_editor_cm_position").append("<textarea style='display:none;' name='misterpah_editor_cm_name' id='misterpah_editor_cm'></textarea>");
        
        cm = CodeMirror.fromTextArea(Browser.document.getElementById("misterpah_editor_cm"), {
            lineNumbers:true,
            matchBrackets: true,
            autoCloseBrackets: true,
            mode:'haxe',
          });

        
        CodeMirror.on(cm,"change",function(cm){
            var path = Main.session.active_file;

            if (path == "") {trace("ignore");return;}
            
            var file_obj = Main.file_stack.find(path);
            Main.file_stack.update_content(path,cm.getValue());

            var cursor_pos = cm.indexFromPos(cm.getCursor());
            if (cm.getValue().charAt(cursor_pos - 1) == '.')
                {
                    new JQuery(js.Browser.document).triggerHandler("core_file_save");
                    cursor_type = ".";
                    Utils.system_get_completion(cursor_pos);
                    untyped sessionStorage.cursor_pos = cm.getCursor().ch;
                    
                }
            if (cm.getValue().charAt(cursor_pos - 1) == '(')
                {
                    new JQuery(js.Browser.document).triggerHandler("core_file_save");
                    cursor_type = "(";
                    Utils.system_get_completion(cursor_pos);
                    untyped sessionStorage.cursor_pos = cm.getCursor().ch;
                    
                }

            });

        editor_resize();
    }

 




    public static function register_hooks()
    {
        cursor_type = "";
        new JQuery(js.Browser.document).on("show.bs.tab",function(e):Void
            {
                var target = new JQuery(e.target);
                show_tab(target.attr("data-path"),false);
            });

        new JQuery(js.Browser.document).on("core_file_openFile_complete",function():Void
            {
            new JQuery("#editor_position").css("display","block");
            make_tab();
            });

        new JQuery(js.Browser.window).on("resize",function()
            {
            editor_resize();
            });

        new JQuery(js.Browser.document).on("core_utils_getCompletion_complete",handle_getCompletion_complete);
    }

    /*
    private static function simpleCompletion(cm:CodeMirror)
    {
        var cur = cm.getCursor();
        var start = cur.ch;
        var end = start;
        return {list: completion_list, from: cur, to: cur};
    }
    */

   static private function handle_getCompletion_complete(event,data)
    {
        //trace("completion_handler");
        var completion_array:Dynamic = untyped $.xml2json(data);
        
        

        completion_list = new Array();
        
        if (cursor_type == ".") // properties/method available
            {
                trace(completion_array);

                if (Std.is(completion_array,String))
                {
                    //completion_list.push(completion_array);
                }
                else
                {
                    for (each in 0...completion_array.i.length)
                    {
                        completion_list.push(completion_array.i[each].n);
                    }
                }
                CodeMirror.showHint(cm,untyped haxeHint);                    
            }
        else if (cursor_type == "(") // function properties
            {
                trace(completion_array);
                var cur_pos = cm.getCursor();

                completion_array = StringTools.replace(completion_array,"->",",");
                var completion_array_exploded = completion_array.split(",");
                var return_type = completion_array_exploded.pop();
                completion_array = completion_array_exploded.join(",");

                completion_array = StringTools.replace(completion_array,"Void","");



                completion_list.push(completion_array);
                CodeMirror.showHint(cm,untyped haxeHint); 
                cm.setCursor(cur_pos);
            }

        //new JQuery(js.Browser.document).triggerHandler("codemirror_haxe_hint");
    }    



    private static function editor_resize()
        {
            var win = Utils.gui.Window.get();
            var win_height = cast(win.height,Int);
            var doc_height = new JQuery(js.Browser.document).height();
            var nav_height = new JQuery(".nav").height();
            var tab_height = new JQuery("#misterpah_editor_tabs_position").height();
            new JQuery(".CodeMirror").css("height", (win_height -nav_height - tab_height - 38) +"px");
        }

    private static function close_tab()
    {
        var path = Main.session.active_file; 
        var tab_number = Lambda.indexOf(tab_index,path);
        new JQuery("#misterpah_editor_tabs_position li:eq("+tab_number+")").remove();
        Main.session.active_file = '';
        cm.setOption('value','');
        tab_index.remove(path);
        if (tab_index.length < 1)
        {
            new JQuery("#editor_position").css("display","none");
        }
        else
        {
            new JQuery("#misterpah_editor_cm_position").css("display","none");  
        }
    }


    private static function make_tab()
    {
        
        var path = Main.session.active_file;
        var file_obj = Main.file_stack.find(path);
        tab_index.push(path);
        //var tab_number = Lambda.indexOf(tab_index,path);

        new JQuery("#misterpah_editor_tabs_position ul").append("<li><a data-path='"+path+"' data-toggle='tab'>"+file_obj[2]+"</a></li>");
        show_tab(path);
        cm.setOption('value',file_obj[1]);
        editor_resize();
    }   

    private static function show_tab(path:String,tabShow:Bool=true)
    {
        //editor_resize();
        //trace(path);
        var tab_number = Lambda.indexOf(tab_index,path);
        var file_obj = Main.file_stack.find(path);
        Main.session.active_file = path;
        cm.setOption('value',file_obj[1]);
        if (tabShow == true)
            {
            untyped $("#misterpah_editor_tabs_position li:eq("+tab_number+") a").tab("show");       
            }
        new JQuery("#misterpah_editor_cm_position").css("display","block"); 
    }

}