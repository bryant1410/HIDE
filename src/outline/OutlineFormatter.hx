package outline;

import js.html.LIElement;
import jQuery.JQuery;
import core.OutlinePanel;
/**
 * ...
 * @author NickHolder
 */


 
class OutlineFormatter{

	public function new( source:Array<TreeItem> )
	{
		
		var outlineItems:Array<Dynamic> =  untyped new JQuery('#outline').jqxTree('getItems');
		
		var li:LIElement;
		
		for( sourceItem in source ) 
		{
			//trace( sourceItem.items[0].items[0].haxeType );
		}
 			
		
		var fieldIndex:Int = -1;
		var classIndex:Int = 0;
		var item:Dynamic;
		var haxeType:String;
			
 		for ( itemIndex in 0...outlineItems.length )
 		{
			
			if( itemIndex == 0 ) continue;
			
			item = outlineItems[itemIndex];
			
			
			
			li = cast(item.element, LIElement);
			
			
			
			if( fieldIndex == -1 ) 
			{
				fieldIndex = 0;
				switch (source[0].items[classIndex].haxeType)
				{
					case "class": li.classList.add( "outlineClass");
					case "enumGroup": li.classList.add( "outlineEnumGroup");
					case "typedef": li.classList.add( "outlineTypeDef");
				}

				continue;
			}
				
				
			haxeType = source[0].items[classIndex].items[fieldIndex].haxeType;
			
			if( haxeType == "field")
			{
				if( item.label.split("(").length > 1 )
				{
					li.classList.add( "outlineFunction");	
				}
				else 
				{ 

					li.classList.add( "outlineVar");
							
				} 
			}
			else 
			{
				switch( haxeType)
				{
					case "enum": li.classList.add( "outlineEnum");
					case "typedef": li.classList.add( "outlineTypeDef");
					case "abstract": li.classList.add( "outlineAbstract");
				}
			}
				
			
			
			if ( ++ fieldIndex == source[0].items[classIndex].items.length)
			{
				classIndex++;
				fieldIndex= -1;
			}

			
		}

	
	
	}
}