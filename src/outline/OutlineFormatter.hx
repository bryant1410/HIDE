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
		
		
		for ( item in outlineItems)
		{
			trace( item ); 
		}

	}
}