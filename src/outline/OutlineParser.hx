package outline;

import parser.RegexParser;

/**
 * @author Nick Holder
 */

enum TestEnum{
	Enum1;
	Enum2;
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
	public var isPublic:Bool;
	public var isStatic:Bool;
	
	public function new(name:String, type:String , pos:Int , len:Int , ?isPublic:Bool , ?isStatic:Bool )
	{
		this.name = name;
		this.type = type;
		this.pos = pos;	
		this.len = len;
	}

}

typedef OutlineFieldData = 
{
	var name:String;
	var pos:PosData;
	var isPublic:Bool;
	var isStatic:Bool;
	var type:String;
	var params:Array<String>;
}


class OutlineParser extends RegexParser
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
			var enumBlock = data.substring( outlineItems[ enumIndex ].pos , outlineItems[enumIndex+1].pos ); 
			var regEx1 = ~/([A-Za-z0-9_]+);/gm;

			regEx1.map(enumBlock, function (ereg2)
            {
				var pos = regEx1.matchedPos();
               
				outlineItems[ enumIndex ].fields.push( new OutlineField( regEx1.matched(1) , "enum" , pos.pos ,  pos.len ) );
                return "";
            });
		}
	
		var vars = getVariableDeclarations( data );
		var outlineItemIndex:Int = 0;

		for ( varInfo in vars )
		{
			while( outlineItemIndex +1 < outlineItems.length && varInfo.pos.pos > outlineItems[ outlineItemIndex +1 ].pos ) outlineItemIndex ++;
	
			outlineItems[ outlineItemIndex ].fields.push( new OutlineField( varInfo.name , "var" , varInfo.pos.pos , varInfo.pos.len , varInfo.isPublic , varInfo.isStatic ) );
		}
		
		
		var methods = getFunctionDeclarations(data);
		outlineItemIndex = 0;		

		for ( methodInfo in methods )
		{
			while( outlineItemIndex +1 < outlineItems.length && methodInfo.pos.pos > outlineItems[ outlineItemIndex +1 ].pos ) outlineItemIndex ++;
	
			outlineItems[ outlineItemIndex ].fields.push( new OutlineField( methodInfo.name , "function" , methodInfo.pos.pos , methodInfo.pos.len ) );
		}
		
		return outlineItems;
	}
		
		
	function getVariableDeclarations(data:String):Array<OutlineFieldData>
    {
		var variableDeclarations:Array<OutlineFieldData> = [];
        
        var eregVariables = ~/(static)?\s?(public)?\s?var +([a-z_0-9]+):?([^=;]+)?/gi;
        
        eregVariables.map(data, function(ereg2:EReg)
        {							 
			var pos = ereg2.matchedPos();
			var index = pos.pos + pos.len;
			var isStatic = ereg2.matched(1)=="static";
			var isPublic = ereg2.matched(2)=="public";
			
			var name = ereg2.matched(3);
			var type = ereg2.matched(4);
			
			var varDecl1:OutlineFieldData = {name: name, pos: pos , type: "" , params:null, isPublic: isPublic , isStatic:isStatic };

			if (type != null)
			{
				 type = StringTools.trim(type);

				 if (type != "")
				 {
				 	varDecl1.type = type;	 
				 }
			}

			variableDeclarations.push(varDecl1);
			
							 
            return ""; 
        });
		
        return variableDeclarations;
    }

 function getFunctionDeclarations(data:String)
    {
        var functionDeclarations:Array<OutlineFieldData> = [];
        
        
        var eregFunctionWithParameters = ~/(static)?\s?(public)?\s?function *([a-zA-Z0-9_]*) *\(([^\)]*)/gm;
       
        eregFunctionWithParameters.map(data, function (ereg2:EReg)
        {
			var pos = ereg2.matchedPos();
			var isStatic = ereg2.matched(1)=="static";
			var isPublic = ereg2.matched(2)=="public";
			
			
            var name:String = ereg2.matched(3);
            
            if (name != "")
            {
				if (name != "new")
				{
					var params = null;
					
					var str = ereg2.matched(4);
					
					if (str != null)
					{
						params = str.split(",");
					}
					
					functionDeclarations.push({name: name, params: params ,pos: pos , type: "" , isPublic:isPublic , isStatic:isStatic});
					trace( name , isPublic , isStatic );
				}
            }
            
            return "";
        });
        
        return functionDeclarations;
    }
}
	
	
	
