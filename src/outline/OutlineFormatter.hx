package outline;

import jQuery.JQuery;

/**
 * ...
 * @author NickHolder
 */


 
class OutlineFormatter{

	public function new()
	{
		
		var outlineItems =  untyped new JQuery('#outline').jqxTree('getItems');
		
		var item:Dynamic;
		
		for ( i in 0...outlineItems.length)
		{
			untyped item =  outlineItems[i] ;
			
			if( item.label.split("(").length > 1 )
			{
				trace( "found function: " + item.label );
				trace( item );
				item.label = "<strong>"+ item.label + "</strong>";
			}
		}

	}
}