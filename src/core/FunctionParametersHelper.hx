package core;
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
	static var lines:Array<Int> = [];
	
	public static function addWidget(type:String, name:String, parameters:Array<String>, retType:String, description:String, currentParameter:Int, lineNumber:Int):Void
	{		
		var lineWidget:LineWidget = new LineWidget(type, name, parameters, retType, description, currentParameter, lineNumber);
		widgets.push(lineWidget);
		lines.push(lineNumber);
	}
	
	public static function alreadyShown(lineNumber:Int):Bool
	{
		return lines.indexOf(lineNumber) != -1;
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
		
		lines = [];
		widgets = [];
	}
	
	public static function update(cm:CodeMirror):Void
	{		
		var modeName:String = TabManager.getCurrentDocument().getMode().name;
			
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
	
	static function scanForBracket(cm:CodeMirror, cursor:CodeMirror.Pos):Void
	{
		//{bracketRegex: untyped __js__("/[([\\]]/")}
		var bracketsData = cm.scanForBracket(cursor, -1, null);
		
		if (bracketsData != null && bracketsData.ch == "(") 
		{
			var range:String = cm.getRange(bracketsData.pos, cursor);
			
			var pos = {line:bracketsData.pos.line, ch:bracketsData.pos.ch};
			
			var currentParameter:Int = range.split(",").length - 1;
			
			if (!FunctionParametersHelper.alreadyShown(pos.line)) 
			{						
				getFunctionParams(cm, pos, currentParameter);				
			}
			else 
			{
				widgets[0].updateParameters(currentParameter);
			}
		}
		else
		{
			FunctionParametersHelper.clear();
		}
	}
	
	static function getFunctionParams(cm:CodeMirror, pos:CodeMirror.Pos, currentParameter:Int):Void
	{
		var word = Completion.getCurrentWord(cm, {}, {line:pos.line, ch:pos.ch - 1}).word;
		
		Completion.getCompletion(function ()
		{
			var found:Bool = false;
			
			for (completion in Completion.completions) 
			{							
				if (word == completion.n) 
				{
					var functionData = parseFunctionParams(completion);
					
					if (functionData.parameters != null)
					{
						var description = parseDescription(completion);
						
						FunctionParametersHelper.clear();
						FunctionParametersHelper.addWidget("function", completion.n, functionData.parameters, functionData.retType, description, currentParameter, cm.getCursor().line);
						FunctionParametersHelper.updateScroll();
						found = true;
						break;
					}
				}
			}
			
			if (!found) 
			{
				FunctionParametersHelper.clear();
			}
		}
		, {line: pos.line, ch: pos.ch - 1});
	}
	
	static function parseDescription(completion:CompletionItem)
	{
		var description = completion.d;
						
		if (description != null) 
		{
			if (description.indexOf(".") != -1) 
			{
				description = description.split(".")[0];
			}
		}
		
		return description;
	}
	
	public static function parseFunctionParams(completion:CompletionItem)
	{
		var parameters:Array<String> = null;
		
		var retType:String = null;
		
		if (completion.t.indexOf("->") != -1) 
		{
			var openBracketsCount:Int = 0;
			var positions:Array<{start:Int, end:Int}> = [];
			var i:Int = 0;
			var lastPos:Int = 0;
			
			while (i < completion.t.length) 
			{				
				switch (completion.t.charAt(i)) 
				{
					case "-":
						if (openBracketsCount == 0 && completion.t.charAt(i + 1) == ">") 
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
			
			positions.push( { start: lastPos, end: completion.t.length } );
			
			parameters = [];
			
			for (j in 0...positions.length) 
			{
				var param:String = StringTools.trim(completion.t.substring(positions[j].start, positions[j].end));
				
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