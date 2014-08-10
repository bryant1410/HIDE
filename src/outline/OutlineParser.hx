package outline;

import parser.RegexParser;
import core.OutlinePanel;
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
	public var isPublic:Bool;
	public var isStatic:Bool;
	
	public function new(name:String, type:String , pos:Int , len:Int , ?isPublic:Bool , ?isStatic:Bool )
	{
		this.name = name;
		this.type = type;
		this.pos = pos;	
		this.len = len;
		this.isPublic = isPublic;
		this.isStatic = isStatic;
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
	@:optional var endPos:Int;
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
		
		
		
		
		// TYPES
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
		
	
	
	
		// ENUMS
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
		



		// METHODS
		var methods = getFunctionDeclarations(data);		
		var methodFields = new Array<OutlineField>();		

		for ( methodInfo in methods )
		{
			
			methodFields.push( new OutlineField( methodInfo.name +" ("+ methodInfo.params.toString()+")" , "function" , methodInfo.pos.pos , methodInfo.pos.len , methodInfo.isPublic , methodInfo.isStatic) );
		}

			
			
			
		// VARS
		
		var vars = getVariableDeclarations( data );
		var methodIndex = 0;
		var varInfo;
		var varIndex;
		var removedVarCount = 0;
		var hasRemovedVar;
		var varFields = new Array<OutlineField>();

		for ( i in 0...vars.length )
		{	
			varIndex = i - removedVarCount;
			varInfo = vars[varIndex];

			hasRemovedVar = false;
			for (methodIndex in 0...methods.length)
			{
				//trace( varInfo.name + " : " + varInfo.pos.pos +" "+ methods[methodIndex].name + " : " + methods[methodIndex].pos.pos + " " + methods[methodIndex].endPos ); 
				
				if( varInfo.pos.pos >  methods[methodIndex].pos.pos && varInfo.pos.pos < methods[methodIndex].endPos )
				{
					vars.splice(varIndex,1);
					removedVarCount++;
					hasRemovedVar = true;
					break;
				}
			}

			if (hasRemovedVar)
			{
				continue;
			}

				
			var typeString = "";
			if( varInfo.type !="") typeString = " : " + varInfo.type;
		

			varFields.push( new OutlineField( varInfo.name + typeString , "var" , varInfo.pos.pos , varInfo.pos.len , varInfo.isPublic , varInfo.isStatic ) );
		}
		
		
		// SORT
		var parentIndex = 0;
		var fieldInfo;
		var usingSmartSort = OutlinePanel.get().useSorting;
		
		//trace( usingSmartSort );

		if( usingSmartSort )
		{
			var nameA:String;
			var nameB:String;
			var sortFunction = function(a:OutlineField, b:OutlineField):Int
			{
				nameA = a.name.toLowerCase();
				nameB = b.name.toLowerCase();
				if (nameA < nameB) return -1;
				if (nameA > nameB) return 1;
				return 0;
			}; 
			
			varFields.sort( sortFunction);
			
			methodFields.sort( sortFunction);
			
		}
		
		while( varFields.length != 0 || methodFields.length!=0)
		{
			
			// SMART SORT
			// Currently only splits vars and methods
			if( usingSmartSort)
			{
				if( varFields.length != 0 )
				{
					fieldInfo = varFields.shift();

					if (varFields.length ==0 )
					{
						parentIndex = 0;
						trace( "length == 0");
					}

				}
				else 
				{	
					fieldInfo = methodFields.shift();
				}
					
				parentIndex = 0;
			}
			// NO SORT
			else
			{
				if( varFields.length == 0 ) 
					fieldInfo = methodFields.shift();
				else if( methodFields.length == 0 ) 
					fieldInfo = varFields.shift();
				else
				{
					if( varFields[0].pos < methodFields[0].pos )
					{
						fieldInfo = varFields.shift();
					}
					else
					{
						fieldInfo = methodFields.shift();
					}
				}
					
				parentIndex = 0;	
				
			}
			
			while( parentIndex +1 < outlineItems.length && fieldInfo.pos > outlineItems[ parentIndex +1 ].pos ) parentIndex ++;
	
			outlineItems[ parentIndex ].fields.push( fieldInfo );
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
				
					var params = null;
					
					var str = ereg2.matched(4);
					
					if (str != null)
					{
						params = str.split(",");
					}
					
					var functionBody:String = data.substr(pos.pos + pos.len);
					var leftBraces = functionBody.split("{");
					var functionBodyLength:Int =leftBraces[0].length +1;
					var unClosedBraces:Int =0;
					var leftBrace;
					var rightBrace;
				
					for ( i in 1...leftBraces.length )
					{
						leftBrace = leftBraces[i];
						unClosedBraces ++;
						 
						var rightBraces = leftBrace.split("}");	
				
						if (rightBraces.length == 1 ) 
						{
							functionBodyLength += rightBraces[0].length;
							
							continue;
						}
							
						for ( j in 0...rightBraces.length )
						{
							rightBrace = rightBraces[j];
							
							if( j != 0 ) unClosedBraces --;
							
				
							if (unClosedBraces == 0 )
							{
								break;
							}
							else 
							{
								functionBodyLength += rightBrace.length ;
							}
							
						}
					
						if (unClosedBraces == 0 )
						{
							
							break;
						}
							
					}

					functionDeclarations.push({name: name, params: params ,pos: pos , type: "" , isPublic:isPublic , isStatic:isStatic , endPos: ( pos.pos + pos.len + functionBodyLength ) });
					
			}
            
            
            return "";
        });
        
        return functionDeclarations;
    }
}
	
	
	
