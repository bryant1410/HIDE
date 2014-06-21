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
	static var source:Array<TreeItem> = [];
	
	public static function update():Void
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
				
				var marker = cm.markText(pos, pos2, {className: "showDeclaration"});
				
				Timer.delay(function ()
							{
								marker.clear();
							}
							, 1000);
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