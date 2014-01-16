package plugin.misterpah;
import jQuery.*;
import js.Browser;
import ui.*;
import Utils;
import CodeMirror;

@:keep @:expose class Editor
{
	static private var plugin:Map<String,String>;


    private static var tab_index:Array<String>;
    private static var tab_cursor:Array<Array<Int>>;
    
    private static var cm:CodeMirror;
    public static var completion_list:Array<String>;
    private static var cursor_type:String;
    private static var track_cursor:Bool;
	
	
    static public function main():Void
    {
	init();
    }
	
	private static function plugin_path():String
	{
	return "../plugin/" + Type.getClassName(Editor) +"/bin";
	}
	
    public static function init()
    {
        tab_index = new Array();
        tab_cursor = new Array();
        completion_list = new Array();
        track_cursor = true;

		
		Utils.loadJavascript(plugin_path() +"/codemirror-3.15/lib/codemirror.js");
		Utils.loadJavascript(plugin_path() +"/codemirror-3.15/mode/haxe/haxe.js");
		
		Utils.loadJavascript(plugin_path() +"/codemirror-3.15/addon/edit/matchbrackets.js");
		Utils.loadJavascript(plugin_path() +"/codemirror-3.15/addon/edit/closebrackets.js");
		Utils.loadJavascript(plugin_path() +"/codemirror-3.15/addon/fold/foldcode.js");
		Utils.loadJavascript(plugin_path() +"/codemirror-3.15/addon/fold/foldgutter.js");
		Utils.loadJavascript(plugin_path() +"/codemirror-3.15/addon/selection/active-line.js");
		Utils.loadJavascript(plugin_path() +"/codemirror-3.15/addon/hint/show-hint.js");
		
		Utils.loadJavascript(plugin_path() +"/js/codemirror.hint.haxe.js");
		
		
		
		
		Utils.loadJavascript(plugin_path() +"/js/jquery.xml2json.js");
		
        Utils.loadCss(plugin_path() +"/codemirror-3.15/lib/codemirror.css");
        Utils.loadCss(plugin_path() +"/codemirror-3.15/addon/hint/show-hint.css");
		Utils.loadCss(plugin_path() +"/codemirror-3.15/theme/xq-light.css");
		//Utils.loadCss(plugin_path() +"/editor.css");
        
        create_ui();
        register_hooks(); 

    }


    public static function create_ui()
    {

        new JQuery("#editor_position").css("display","none");
        new JQuery("#editor_position").append("<div id='misterpah_editor_tabs_position'><ul class='nav nav-tabs'></ul></div>");
        new JQuery("#editor_position").append("<div class='ui-layout-center' id='misterpah_editor_cm_position'></div>");
        new JQuery("#misterpah_editor_cm_position").append("<textarea style='display:none;' name='misterpah_editor_cm_name' id='misterpah_editor_cm'></textarea>");
        
        cm = CodeMirror.fromTextArea(Browser.document.getElementById("misterpah_editor_cm"), {
            lineNumbers:true,
            indentUnit:4,
            tabSize:4,
            indentWithTabs:true,
              cursorHeight:0.85,
            mode:'haxe',
			theme:'xq-light',
            //addons starts here
            matchBrackets:true,
            autoCloseBrackets:true,
            foldCode:true,
            foldGutter:true,
            styleActiveLine:true,
          });

        
        CodeMirror.on(cm,"cursorActivity",function(cm){
            if (track_cursor == true)
                {
                var path = Main.session.active_file;
                var tab_number = Lambda.indexOf(tab_index,path);
                var cursor = cm.getCursor();
                tab_cursor[tab_number] = [cursor.line, cursor.ch];  
                trace(tab_cursor);                  
                }
            });
        
        CodeMirror.on(cm,"change",function(cm){
            var path = Main.session.active_file;

            if (path == "") {trace("ignore");return;}
            
            var file_obj = Main.file_stack.find(path);
            Main.file_stack.update_content(path,cm.getValue());

            var cursor_pos = cm.indexFromPos(cm.getCursor());
            if (cm.getValue().charAt(cursor_pos - 1) == '.')
                {
					Main.message.broadcast("core:FileMenu.saveFile","plugin.misterpah.Editor");
                    //new JQuery(js.Browser.document).triggerHandler("core:FileMenu.saveFile");
                    cursor_type = ".";
                    Utils.system_get_completion(cursor_pos);
                    untyped sessionStorage.cursor_pos = cm.getCursor().ch;
                    
                }
            if (cm.getValue().charAt(cursor_pos - 1) == '(')
                {
                    //new JQuery(js.Browser.document).triggerHandler("core:FileMenu.saveFile");
					Main.message.broadcast("core:FileMenu.saveFile","plugin.misterpah.Editor");
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

                //var file_obj = Main.file_stack.find(Main.session.active_file);
                var tab_number = Lambda.indexOf(tab_index,Main.session.active_file);        
                var unshowed_tab = tab_cursor[tab_number];
                var cursor_pos = CodeMirror.Pos(unshowed_tab[0],unshowed_tab[1]);
                cm.setCursor(cursor_pos);
            });

			
			
        new JQuery(js.Browser.document).on("plugin.misterpah.FileAccess:open_file.complete",function():Void
            {
            new JQuery("#editor_position").css("display","block");
            make_tab();
            });

        new JQuery(js.Browser.window).on("resize",function()
            {
            editor_resize();
            });

        new JQuery(js.Browser.document).on("core:utils.system_get_completion.complete",handle_getCompletion_complete);
      	new JQuery(js.Browser.document).on("plugin.misterpah.FileAccess:close_file.complete",close_tab);
    }


   static private function handle_getCompletion_complete(event,data)
    {
        var completion_array:Dynamic = untyped $.xml2json(data);
        trace(completion_array);
		
		

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
					//completion_list.push("test");
					
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

                completion_array = " " + completion_array;

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
        if (path != "")
        	{
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
    }


    private static function make_tab()
    {
        
        var path = Main.session.active_file;
        var file_obj = Main.file_stack.find(path);
        tab_index.push(path);
        tab_cursor.push([0,0]);
        new JQuery("#misterpah_editor_tabs_position ul").append("<li><a data-path='"+path+"' data-toggle='tab'>"+file_obj[2]+"</a></li>");
        show_tab(path);
        cm.setOption('value',file_obj[1]);
        editor_resize();
    }   

    private static function show_tab(path:String,tabShow:Bool=true)
    {
        /*
        var tab_number = Lambda.indexOf(tab_index,Main.session.active_file);
        var cursor = cm.getCursor();
        tab_cursor[tab_number] = cursor.line + ',' + cursor.ch;
        */
        track_cursor = false;

        var file_obj = Main.file_stack.find(path);
        var tab_number = Lambda.indexOf(tab_index,path);

        

        Main.session.active_file = path;
        cm.setOption('value',file_obj[1]);
        if (tabShow == true)
            {
            untyped $("#misterpah_editor_tabs_position li:eq("+tab_number+") a").tab("show");       
            }
        new JQuery("#misterpah_editor_cm_position").css("display","block"); 

        //trace(unshowed_tab);
        //var cursor = tab_cursor[tab_number].split(",");
        cm.refresh();
        track_cursor = true;
    }	

}
