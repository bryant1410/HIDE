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
   	public static var completion_list:Array<Array<String>>;
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
        
        create_ui();
        register_hooks(); 
        untyped sessionStorage.static_completion = "";
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
            styleActiveLine:true
          });

        
        CodeMirror.on(cm,"cursorActivity",function(cm){
            if (track_cursor == true)
                {
                var path = Main.session.active_file;
                var tab_number = Lambda.indexOf(tab_index,path);
                var cursor = cm.getCursor();
                tab_cursor[tab_number] = [cursor.line, cursor.ch];  
                }
            });
        
        CodeMirror.on(cm,"change",function(cm){
            var path = Main.session.active_file;
            if (path == "") {trace("ignore");return;}
            var file_obj = Main.file_stack.find(path);
            Main.file_stack.update_content(path,cm.getValue());
            var cursor_pos = cm.indexFromPos(cm.getCursor());
            untyped sessionStorage.cursor_index = cursor_pos;
            untyped sessionStorage.keypress = cm.getValue().charAt(cursor_pos - 1);
            if (cm.getValue().charAt(cursor_pos - 1) == '.')
                {
                    cursor_type = ".";
                    untyped sessionStorage.cursor_pos = cm.getCursor().ch;
                    untyped sessionStorage.cursor_pos_line = cm.getCursor().line;
                    var cursor_temp = cm.getCursor();
                    cursor_temp.ch = cursor_temp.ch -1;
                    var seekToken = true;
                    var token_array:Array<Dynamic> = new Array();
                    while (seekToken)
	                    {
	                    var before_token = cm.getTokenAt(cursor_temp);
	                    token_array.push(before_token);
		                var cursor_check_before_token =  CodeMirror.Pos(cursor_temp.line, before_token.start -1);
		                var before_before_token = (cm.getTokenAt(cursor_check_before_token));
		                if (before_before_token.type == null)
		                	{
		                	seekToken = false;
		                	}
		                else
		                	{
		                	cursor_temp = cursor_check_before_token;
		                	}
    	                }
					token_array.reverse();
					var completion_str_array = new Array();
					for (each in token_array)
						{
						completion_str_array.push(each.string);
						}
					untyped sessionStorage.find_completion = completion_str_array.join(".");
					Main.message.broadcast("core:FileMenu.saveFile","plugin.misterpah.Editor");
					//Utils.system_get_completion(cursor_pos);
					Main.message.broadcast("plugin.misterpah.Completion:static_completion","plugin.misterpah.Editor");
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
      	new JQuery(js.Browser.document).on("plugin.misterpah.Completion:static_completion.complete",handle_static_completion);
    }



   static private function handle_static_completion()
    {
        var completion_array:Dynamic = untyped JSON.parse(sessionStorage.static_completion);
        trace(completion_array);
		completion_list = new Array();
        var temp:Array<String> = completion_array;
		for (each in temp)
			{
			var fname = untyped each[0];
			completion_list.push(fname);
			}
		
		CodeMirror.showHint(cm,untyped haxeHint);
		untyped sessionStorage.static_completion = "";
    }    




   static private function handle_getCompletion_complete(event,data)
    {
        var completion_array:Dynamic = untyped $.xml2json(data);
        //trace(completion_array);
		

        completion_list = new Array();
        var compile_completion = new Array();
        if (cursor_type == ".") // properties/method available
            {
                trace(completion_array);
                if (Std.is(completion_array,String))
                {
                    compile_completion.push(completion_array);
                }
                else
                {
                for (each in 0...completion_array.i.length)
                	{
                	var cur_item = new Array();
                	cur_item.push(completion_array.i[each].n);
                	compile_completion.push(cur_item);
                	}
                untyped sessionStorage.build_completion = untyped JSON.stringify(compile_completion);
                Main.message.broadcast("plugin.misterpah.Editor:handle_getCompletion_complete.build_complete","plugin.misterpah.Editor");
                }
                
                /*
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
                */
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
