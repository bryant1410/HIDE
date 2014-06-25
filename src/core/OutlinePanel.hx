package core;
import haxe.Timer;
import parser.OutlineHelper;
import cm.Editor;
import jQuery.JQuery;

/**
 * ...
 * @author AS3Boyan
 */

typedef TreeItem = {
	var label:String;
    @:optional var icon:String;
	@:optional var items:Array<TreeItem>;
	@:optional var expanded:Bool;
	@:optional var value:Dynamic;
}
 
class OutlinePanel
{
	static var instance:OutlinePanel;
	
	public function new() 
	{
		
	}	
	
	public static function get()
	{
		if (instance == null)
		{
			instance = new OutlinePanel();
		}
			
		return instance;
	}
	
	var source:Array<TreeItem> = [];
	
	public function update():Void
	{
		untyped new JQuery("#outline").jqxTree( { source: source } );
		
		new JQuery('#outline').dblclick(function (event):Void 
		{
			var item = untyped new JQuery('#outline').jqxTree('getSelectedItem');
			
			var value:DeclarationPos = item.value;
			
			var cm = Editor.editor;
			
			if (value != null) 
			{
				var pos = cm.posFromIndex(value.min);
				var pos2 = cm.posFromIndex(value.max);
				var line = pos.line;
				
				cm.centerOnLine(line);
				cm.focus();
				cm.setCursor(pos2);
				
				
			}
		}
		);
	}
	
	public function addField(item:TreeItem):Void
	{
		source.push(item);
	}
	
	public function clearFields():Void 
	{
		source = [];
	}
}