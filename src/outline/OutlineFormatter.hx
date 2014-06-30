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
		

		var fieldIndex:Int = -1;
		var classIndex:Int = 0;
		var item:Dynamic;
		var haxeType:String;
		var item:Dynamic;
		
 		for ( i in 0...outlineItems.length )
 		{
			
			item = outlineItems[i];
			
			if ( i == 0 ) continue;

			li = cast(item.element, LIElement);
					
				
			haxeType = treeItemFormats.shift();
			
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


			
		}

	
	
	}
}