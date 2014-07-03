package outline;

import parser.RegexParser;

/**
 * @author Nick Holder
 */

class OutlineItem
{
	public var name:String;
	public var type:String;
	public var pos:Int; 
	public var len:Int;
	public var fields:Array<OutlineField>;
	
	public function new(name:String, type:String , pos:Int , len:Int)
	{
		this.name = name;
		this.type = type;
		this.pos = pos;	
		this.len = len;
		fields = new Array<OutlineField>();
	}

}

class OutlineField
{
	public var name:String;
	public var type:String;
	public var pos:Int; 
	public var len:Int;
	
	public function new(name:String, type:String , pos:Int , len:Int)
	{
		this.name = name;
		this.type = type;
		this.pos = pos;	
		this.len = len;
	}

}

class OutlineParser
{
	public function new() 
	{
		
	}	
	
	public function parse( data:String, path:String ):Array<OutlineItem>
	{
		var outlineItems = new Array<OutlineItem>();
		
		var classes = RegexParser.getClassDeclarations( data );
		for ( classInfo in classes )
		{
			outlineItems.push( new OutlineItem( classInfo.name , "class" , classInfo.pos.pos , classInfo.pos.len ) ); 
		}
		
	
		var vars = RegexParser.getVariableDeclarations( data );
		var topLevelItemIndex:Int = 0;

		for ( varInfo in vars )
		{
			while( topLevelItemIndex +1 < outlineItems.length && varInfo.pos.pos > outlineItems[ topLevelItemIndex +1 ].pos ) topLevelItemIndex ++;
	
			outlineItems[ topLevelItemIndex ].fields.push( new OutlineField( varInfo.name , "var" , varInfo.pos.pos , varInfo.pos.len ) );
		}
		
		
		var methods = RegexParser.getFunctionDeclarations(data);
		topLevelItemIndex = 0;		

		for ( methodInfo in methods )
		{
			while( topLevelItemIndex +1 < outlineItems.length && methodInfo.pos.pos > outlineItems[ topLevelItemIndex +1 ].pos ) topLevelItemIndex ++;
	
			outlineItems[ topLevelItemIndex ].fields.push( new OutlineField( methodInfo.name , "function" , methodInfo.pos.pos , methodInfo.pos.len ) );
		}

		return outlineItems;
	}
}
	
	
	
