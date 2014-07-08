package outline;
import core.OutlinePanel.TreeItem;

import js.html.LIElement;
import js.Browser;
import jQuery.JQuery;
import core.OutlinePanel;
/**
 * ...
 * @author NickHolder
 */

typedef TreeItemFormat = 
{
	var type:String;
	var isPublic:Bool;
	var isStatic:Bool;
}
 
class OutlineFormatter{

	public function new( treeItemFormats:Array<TreeItemFormat> )
	{
		
		var outlineItems:Array<Dynamic> =  untyped new JQuery('#outline').jqxTree('getItems');
		
		var li:LIElement;
		var item:Dynamic;
		var itemType:TreeItemFormat;
		var item:Dynamic;
		
 		for ( i in 0...outlineItems.length )
 		{
			
			item = outlineItems[i];
			
			if ( i == 0 ) continue;

			li = cast(item.element, LIElement);
					
				
			itemType = treeItemFormats.shift();
			

			switch( itemType.type)
			{
				case "enum": li.classList.add( "outlineEnum");
				case "enumGroup": li.classList.add( "outlineEnumGroup");
				case "class": li.classList.add( "outlineClass");
				case "typedef": li.classList.add( "outlineTypeDef");
				case "abstract": li.classList.add( "outlineAbstract");
				case "var":li.classList.add( "outlineVar");
				case "function": li.classList.add( "outlineFunction");
			}
			
			if(itemType.type == "var" || itemType.type=="function" )
			{	
				var span = Browser.document.createElement("span");
				span.classList.add( "outlinePrivate" );
				li.insertBefore( span, li.firstChild);
				if (!itemType.isPublic)
				{
					span.innerHTML = "P";
				}
				else 
				{
					span.innerHTML = " ";
				}

				span = Browser.document.createElement("span");
				span.classList.add( "outlineStatic" );
				li.insertBefore( span, li.firstChild);
				if (itemType.isStatic)
				{
					span.innerHTML = "S";
				}
				else 
				{
					span.innerHTML = " ";
				}
			}

		}
	}
}