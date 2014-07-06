package outline;
import core.OutlinePanel.TreeItem;

import js.html.LIElement;
import jQuery.JQuery;
import core.OutlinePanel;
/**
 * ...
 * @author NickHolder
 */


 
class OutlineFormatter{

	public function new( treeItemFormats:Array<String> )
	{
		
		var outlineItems:Array<Dynamic> =  untyped new JQuery('#outline').jqxTree('getItems');
		
		var li:LIElement;
		var item:Dynamic;
		var itemType:String;
		var item:Dynamic;
		
 		for ( i in 0...outlineItems.length )
 		{
			
			item = outlineItems[i];
			
			if ( i == 0 ) continue;

			li = cast(item.element, LIElement);
					
				
			itemType = treeItemFormats.shift();
			

			switch( itemType)
			{
				case "enum": li.classList.add( "outlineEnum");
				case "enumGroup": li.classList.add( "outlineEnumGroup");
				case "class": li.classList.add( "outlineClass");
				case "typedef": li.classList.add( "outlineTypeDef");
				case "abstract": li.classList.add( "outlineAbstract");
				case "var": li.classList.add( "outlineVar");
				case "function": li.classList.add( "outlineFunction");

			}
		}
	}
}