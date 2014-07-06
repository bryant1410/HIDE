package outline;

import parser.RegexParser;

/**
 * @author Nick Holder
 */

enum TEST{
	Buck;
}

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
		
		var enumIndexs = new Array<Int>();
		
		var types = RegexParser.getTypeDeclarations( data );
		var outlineItem;
		
		for ( typeInfo in types )
		{
			outlineItem = new OutlineItem( typeInfo.name , typeInfo.type , typeInfo.pos.pos , typeInfo.pos.len );
			outlineItems.push( outlineItem );
  
		
			if ( typeInfo.type == "enum" )
			{
				enumIndexs.push( outlineItems.length -1 );
			}

		}
	
		for ( enumIndex in enumIndexs )
		{
			trace( outlineItems[ enumIndex ].pos , outlineItems[enumIndex+1].pos );
		}
	
		var vars = RegexParser.getVariableDeclarations( data );
		var outlineItemIndex:Int = 0;

		for ( varInfo in vars )
		{
			while( outlineItemIndex +1 < outlineItems.length && varInfo.pos.pos > outlineItems[ outlineItemIndex +1 ].pos ) outlineItemIndex ++;
	
			outlineItems[ outlineItemIndex ].fields.push( new OutlineField( varInfo.name , "var" , varInfo.pos.pos , varInfo.pos.len ) );
		}
		
		
		var methods = RegexParser.getFunctionDeclarations(data);
		outlineItemIndex = 0;		

		for ( methodInfo in methods )
		{
			while( outlineItemIndex +1 < outlineItems.length && methodInfo.pos.pos > outlineItems[ outlineItemIndex +1 ].pos ) outlineItemIndex ++;
	
			outlineItems[ outlineItemIndex ].fields.push( new OutlineField( methodInfo.name , "function" , methodInfo.pos.pos , methodInfo.pos.len ) );
		}
		
		trace( outlineItems );
			
		return outlineItems;
	}
}
	
	
	
