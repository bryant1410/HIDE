package core;
import CodeMirror.Pos;
import cm.Editor;
import core.Completion.CompletionItem;
import core.LineWidget;
import js.Browser;
import js.html.DivElement;
import js.html.SpanElement;
import js.Node;
import tabmanager.TabManager;

/**
 * ...
 * @author AS3
 */
class FunctionParametersHelper
{
	public static var widgets:Array<LineWidget> = [];
	static var lastPos:CodeMirror.Pos;
	
	public static function addWidget(type:String, name:String, parameters:Array<String>, retType:String, description:String, currentParameter:Int, pos:CodeMirror.Pos):Void
	{		
		var lineWidget:LineWidget = new LineWidget(type, name, parameters, retType, description, currentParameter, pos);
		widgets.push(lineWidget);
	}
	
	public static function alreadyShown():Bool
	{
		return widgets.length > 0;
	}
	
	public static function updateScroll():Void
	{
		var info = Editor.editor.getScrollInfo();
		var after = Editor.editor.charCoords( { line: Editor.editor.getCursor().line + 1, ch: 0 }, "local").top;
		
		if (info.top + info.clientHeight < after)
		{
			Editor.editor.scrollTo(null, after - info.clientHeight + 3);
		}
	}
	
	public static function clear():Void
	{
		for (widget in widgets) 
		{
			Editor.editor.removeLineWidget(widget.getWidget());
		}
		
		widgets = [];
	}
	
	public static function update(cm:CodeMirror):Void
	{		
		var doc = TabManager.getCurrentDocument();
		
		if (doc != null)
		{
			var modeName:String = doc.getMode().name;
			
			if (modeName == "haxe" && !cm.state.completionActive)
			{	
				var cursor = cm.getCursor();
				var data = cm.getLine(cursor.line);			

				if (cursor != null && data.charAt(cursor.ch - 1) != ".")
				{
					scanForBracket(cm, cursor);
				}
			}
		}
	}
	
	static function scanForBracket(cm:CodeMirror, cursor:CodeMirror.Pos):Void
	{
		//{bracketRegex: untyped __js__("/[([\\]]/")}
        //{bracketRegex: untyped __js__("/[({}]/")}
        var bracketsData = cm.scanForBracket(cursor, -1, null, {bracketRegex: untyped __js__("/[([\\]]/")});
        
        var pos:CodeMirror.Pos = null;
        
		if (bracketsData != null && bracketsData.ch == "(") 
		{
            pos = {line:bracketsData.pos.line, ch:bracketsData.pos.ch};
            
            var matchedBracket:CodeMirror.Pos = cm.findMatchingBracket(pos, false, null).to;
            
            if (matchedBracket == null || (cursor.line <= matchedBracket.line && cursor.ch <= matchedBracket.ch))
            {
                var range:String = cm.getRange(bracketsData.pos, cursor);
			
                var currentParameter:Int = range.split(",").length - 1;
                
                if (lastPos == null || lastPos.ch != pos.ch || lastPos.line != pos.line)
                {
                    getFunctionParams(cm, pos, currentParameter);  
                }
                else if (FunctionParametersHelper.alreadyShown())
                {
                    for (widget in widgets)
					{
						widget.updateParameters(currentParameter);	 
					}
                }
                
                lastPos = pos;
			}
            else
            {
                lastPos = null;
                FunctionParametersHelper.clear();
            }
		}
		else
		{
            lastPos = null;
			FunctionParametersHelper.clear();
		}
	}
	
	static function getFunctionParams(cm:CodeMirror, pos:Pos, currentParameter:Int):Void
	{
		var posBeforeBracket:Pos = {line:pos.line, ch:pos.ch - 1};
		
		var word = Completion.getCurrentWord(cm, {}, posBeforeBracket).word;
        
		Completion.getCompletion(function ()
		{
			var found:Bool = false;
			
			FunctionParametersHelper.clear();
			
			for (completion in Completion.completions) 
			{							
				if (word == completion.n) 
				{
					var functionData = parseFunctionParams(completion.n, completion.t, completion.d);
					
					if (functionData.parameters != null)
					{
						var description = parseDescription(completion.d);
						FunctionParametersHelper.addWidget("function", completion.n, functionData.parameters, functionData.retType, description, currentParameter, cm.getCursor());
						found = true;
// 						break;
					}
				}
			}
				
			FunctionParametersHelper.updateScroll();
			
// 			if (!found) 
// 			{
// 				FunctionParametersHelper.clear();
// 			}  
		}
		, posBeforeBracket);
	}
	
	static function parseDescription(description:String)
	{						
		if (description != null) 
		{
			if (description.indexOf(".") != -1) 
			{
				description = description.split(".")[0];
			}
		}
		
		return description;
	}
	
	public static function parseFunctionParams(name:String, type:String, description:String)
	{
		var parameters:Array<String> = null;
		
		var retType:String = null;
		
		if (type != null && type.indexOf("->") != -1) 
		{
			var openBracketsCount:Int = 0;
			var positions:Array<{start:Int, end:Int}> = [];
			var i:Int = 0;
			var lastPos:Int = 0;
			
			while (i < type.length) 
			{				
				switch (type.charAt(i)) 
				{
					case "-":
						if (openBracketsCount == 0 && type.charAt(i + 1) == ">") 
						{
							positions.push({start: lastPos, end: i-1});
							i++;
							i++;
							lastPos = i;
						}
					case "(":
						openBracketsCount++;
					case ")":
						openBracketsCount--;
					default:
						
				}
				
				i++;
			}
			
			positions.push( { start: lastPos, end: type.length } );
			
			parameters = [];
			
			for (j in 0...positions.length) 
			{
				var param:String = StringTools.trim(type.substring(positions[j].start, positions[j].end));
				
				if (j < positions.length - 1) 
				{
					parameters.push(param);
				}
				else 
				{
					retType = param;
				}
			}
			
			if (parameters.length == 1 && parameters[0] == "Void") 
			{
				parameters = [];
			}
		}
		
		return {parameters: parameters, retType: retType};
	}
}
