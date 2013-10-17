package plugin.misterpah;
import jQuery.*;
import js.Browser;
import ui.*;
import Utils;

class Editor
{
	private var tab_index:Array<String>;
	private var cm:CodeMirror;
	private var completion_list:Array<String>;
	public var plugin_name:String = "Misterpah editor";
	public var plugin_type:String = "editor";
	public var plugin_version:String = "1.0";



	public function new()
	{
		tab_index = new Array();
		completion_list = new Array();

		Utils.loadJavascript("./plugin/misterpah/codemirror-3.18/lib/codemirror.js");
		Utils.loadJavascript("./plugin/misterpah/codemirror-3.18/mode/haxe/haxe.js");
		Utils.loadJavascript("./plugin/misterpah/jquery.xml2json.js");

		// somehow show-hint 3.18 were not working. we'll be use show-hint.js version 3.15;
		Utils.loadJavascript("./plugin/misterpah/show-hint-3.15.js");
		Utils.loadCss("./plugin/misterpah/codemirror-3.18/lib/codemirror.css");
		Utils.loadCss("./plugin/misterpah/show-hint-custom.css");

		create_ui();
		register_hooks();		
	}



	public function create_ui()
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
			var path = Main.session.get("active_file");

			if (path == "") {trace("ignore");return;}
			
			var file_obj = Main.opened_file_stack[path];
			file_obj.set('content',cm.getValue());
			Main.opened_file_stack.set(path,file_obj);

			var cursor_pos = cm.indexFromPos(cm.getCursor());
			if (cm.getValue().charAt(cursor_pos - 1) == '.')
				{
					new JQuery(js.Browser.document).triggerHandler("core_file_save");
					Utils.system_get_completion(cursor_pos);
				}

			});

		editor_resize();
		CodeMirror.registerHelper("hint","haxe",simpleCompletion);
	}

	public function register_hooks()
	{

		new JQuery(js.Browser.document).on("show.bs.tab",function(e):Void
			{
				var target = new JQuery(e.target);
				show_tab(target.attr("data-path"),false);
			});

		new JQuery(js.Browser.document).on("plugin_misterpah_fileAccess_openFile_complete",function():Void
			{
			new JQuery("#editor_position").css("display","block");
			make_tab();
			});

		new JQuery(js.Browser.window).on("resize",function()
			{
			editor_resize();
			});

		
		// this is to process / add / remove from the completion results
		new JQuery(js.Browser.document).on("core_utils_getCompletion_complete",function(event,data){
			
			//trace("hoi");
			//trace(data);

			// using Javascript xml2json library.
			var completion_array:Dynamic = untyped $.xml2json(data);
			//trace(completion_array);
			//trace(completion_array.i);
			
			completion_list = new Array();
			if (completion_array.i == null) // type completion
			{

			}
			else
			{
				for (each in 0...completion_array.i.length)
				{
					completion_list.push(completion_array.i[each].n);
				}				
			}
			//trace(completion_array.i[0].n);
			/*
			if (completion_array.length > 1)
			{
				completion_list = new Array();
				for (each in 0...completion_array.i.length)
				{
					completion_list.push(completion_array.i[each].n);
				}
			}
			*/
			/*
			if (completion_array.i)
			{
				completion_list = new Array();
				var completion_i = completion_array.i;
				
				for (each in completion_i)
				{
					//completion_list.push(each);
					trace(each.n);
				}
			}
			*/


			//completion_list.push("pah was here");

			CodeMirror.showHint(cm,simpleCompletion);
			});


	}

	private function simpleCompletion(cm:CodeMirror)
	{
		var cur = cm.getCursor();
		//var curline = cm.getLine(cur.line);
		var start = cur.ch;
		var end = start;
		//return {list:completion,from:CodeMirror.}
		return {list: completion_list, from: cur, to: cur};
	}



	private function editor_resize()
		{
			var win = Utils.gui.Window.get();
			//trace('hoi');
			var win_height = cast(win.height,Int);
			var doc_height = new JQuery(js.Browser.document).height();
			var nav_height = new JQuery(".nav").height();
			var tab_height = new JQuery("#misterpah_editor_tabs_position").height();
			//trace(win_height +" "+ nav_height + " "+tab_height);
			//trace(win_height +" "+ doc_height );
			new JQuery(".CodeMirror").css("height", (win_height -nav_height - tab_height - 38) +"px");
		}

	private function close_tab()
	{
		var path = Main.session.get("active_file");	
		var tab_number = Lambda.indexOf(tab_index,path);
		new JQuery("#misterpah_editor_tabs_position li:eq("+tab_number+")").remove();
		Main.session.set("active_file",'');
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


	private function make_tab()
	{
		
		var path = Main.session.get("active_file");
		var file_obj = Main.opened_file_stack[path];
		tab_index.push(path);
		//var tab_number = Lambda.indexOf(tab_index,path);

		new JQuery("#misterpah_editor_tabs_position ul").append("<li><a data-path='"+path+"' data-toggle='tab'>"+file_obj['className']+"</a></li>");
		show_tab(path);
		cm.setOption('value',file_obj['content']);
		editor_resize();
	}	

	private function show_tab(path:String,tabShow:Bool=true)
	{
		//editor_resize();
		//trace(path);
		var tab_number = Lambda.indexOf(tab_index,path);
		var file_obj = Main.opened_file_stack[path];
		Main.session.set("active_file",path);
		cm.setOption('value',file_obj['content']);
		if (tabShow == true)
			{
			untyped $("#misterpah_editor_tabs_position li:eq("+tab_number+") a").tab("show");		
			}
		new JQuery("#misterpah_editor_cm_position").css("display","block");	
	}

}