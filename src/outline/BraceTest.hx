package core;

 
class BraceTest
{
	var nice;
	public function update():Void
	{
		
		untyped new JQuery("#outline").jqxTree( { source: source } );
		
		new JQuery('#outline').dblclick(function (event):Void 
		{
			var item = untyped new JQuery('#outline').jqxTree('getSelectedItem');
			
			var value:DeclarationPos = item.value;
			
			var cm2 = Editor.editor;
			
			if (value != null) 
			{
				var pos = cm2.posFromIndex(value.min);
				var pos2 = cm2.posFromIndex(value.max);
				var line = pos.line;
				
				cm2.centerOnLine(line);
				cm2.focus();
				cm2.setCursor(pos2);
				
				var highlightRange = HighlightRange.get();
				highlightRange.highlight(cm2, pos, pos2);
			}
		}
		);
		
		new JQuery('#paneloutlineverticalScrollBar').before( outlineOptionsPanel );
		
		new JQuery('#outlineOptionsPanel').append(sortButton);
	}
	var nick;
	
}