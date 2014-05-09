package core;
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
	static var source:Array<TreeItem> = [];
	
	public static function update():Void
	{
		untyped new JQuery("#outline").jqxTree( { source: source } );
		
		new JQuery('#outline').dblclick(function (event):Void 
		{
			var item = untyped new JQuery('#outline').jqxTree('getSelectedItem');
			
			var value = item.value;
			
			if (value != null) 
			{
				var line = Editor.editor.posFromIndex(value).line;
				Editor.editor.centerOnLine(line);
			}
		}
		);
	}
	
	public static function addField(item:TreeItem):Void
	{
		source.push(item);
	}
	
	public static function clearFields():Void 
	{
		source = [];
	}
}