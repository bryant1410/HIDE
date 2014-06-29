package outline;

import js.html.LIElement;
import jQuery.JQuery;

/**
 * ...
 * @author NickHolder
 */


 
class OutlineFormatter{

	public function new()
	{
		
		var outlineItems:Array<Dynamic> =  untyped new JQuery('#outline').jqxTree('getItems');
		
		var li:LIElement;

			
		for ( item in outlineItems )
		{
			li = cast(item.element, LIElement);
			
			if( item.label.split("(").length > 1 )
			{
				li.classList.add( "outlineFunction");	
			}
			else 
			{ 
				 if ( li.className != "jqx-tree-dropdown" && li.className != "jqx-tree-item-li jqx-disableselect" )
				{
					li.classList.add( "outlineVar");
				}		
			}
			
		}

	
	
	}
}