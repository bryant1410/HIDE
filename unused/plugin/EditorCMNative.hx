package plugin;

import js.Browser;
import jQuery.*;
import CodeMirror;

class EditorCMNative
{
	public static var editor:CodeMirror;
	public static var dependency:Array<String> = ["autocomplete"];

	public static function init()
	{
		draw_ui();
		register_hooks();
	}

	public static function draw_ui()
	{



		//////////////////////////////////////////////
		///
		///					TAB UI
		///
		var plugin_tab_position_id = "plugin_tab_position";
		new JQuery("#editor_position").append("<div id='"+plugin_tab_position_id+"'></div>");


		//////////////////////////////////////////////
		///
		///					EDITOR UI
		///
		var plugin_editor_textarea_id = "plugin_textarea_id";
		new JQuery("#editor_position").append("<textarea id='"+plugin_editor_textarea_id+"'> </textarea>");
		/*
		editor = CodeMirror.fromTextArea(Browser.document.getElementById(plugin_editor_textarea_id), {
			lineNumbers: true,
			//extraKeys: keyMap,
			matchBrackets: true,
			dragDrop: false,
			autoCloseBrackets: true,
			foldGutter: {
				rangeFinder: untyped __js__("new CodeMirror.fold.combine(CodeMirror.fold.brace, CodeMirror.fold.comment)")
				},
			gutters: ["CodeMirror-linenumbers", "CodeMirror-foldgutter"]
		});		
		*/
	}

	public static function register_hooks()
	{

	}

}