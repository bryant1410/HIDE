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
				case "enumGroup": li.classList.add( "outlineEnumGroup");
				case "class": li.classList.add( "outlineClass");
				case "typedef": li.classList.add( "outlineTypeDef");
				
			}		
			
			if(itemType.type == "var" || itemType.type=="function" || itemType.type=="enum" )
			{	
				li.classList.add( "outlineField");	
				
				var element = Browser.document.createElement("div");
				
				li.insertBefore( element, li.firstChild);
				if (!itemType.isPublic)
				{
					element.classList.add( "outlinePrivate" );
				}
				else 
				{
					element.innerHTML = "&#8226;";
					element.classList.add( "outlinePublic" );
				}
				
				element = Browser.document.createElement("div");
					
				li.insertBefore( element, li.firstChild);
				
				switch( itemType.type)
				{
					case "enum": 
						element.classList.add( "outlineEnum");
						element.innerHTML = "E";
					//case "abstract": element.classList.add( "outlineAbstract");
					case "var":
						element.classList.add( "outlineVar");
						element.innerHTML = "V";
					case "function": 
						element.classList.add( "outlineFunction");
						element.innerHTML = "M";
				}
					
				element = Browser.document.createElement("div");
				
				li.insertBefore( element, li.firstChild);
				if (itemType.isStatic)
				{
					element.innerHTML = "&#8226;";
					element.classList.add( "outlineStatic" );
				}
				else
				{
					element.classList.add( "outlineNotStatic" );
				}

			}

		}
	}
}