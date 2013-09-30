package ;
import CodeMirror;
import Cursor;
import haxe.ds.StringMap.StringMap;

/**
 * ...
 * @author AS3Boyan
 */
class Completion
{
	var list:Array<String>;
	var seen:StringMap<Bool>;
	var editor:CodeMirror;
	var word:EReg;
	var range:Int;
	var curWord:String;
	var cur:Cursor;

	public function new() 
	{
		var WORD:EReg = ~/[A-Z]+$/i;
		var RANGE = 500;

		CodeMirror.registerHelper("hint", "haxe", function(current_editor:CodeMirror, options) {
			editor = current_editor;
			
			word = null;
			
			if (options != null && options.word != null)
			{
				word = options.word;
			}
			else if (WORD != null)
			{
				word = WORD;
			}
			
			range = null;
			
			if (options != null && options.range != null)
			{
				range = options.range;
			}
			else if (RANGE != null)
			{
				range = RANGE;
			}
			
			cur = editor.getCursor();
			var curLine:String = editor.getLine(cur.line);
			var start:Int = cur.ch;
			var end = start;
			
			while (end < curLine.length && word.match(curLine.charAt(end))) ++end;
			while (start > 0 && word.match(curLine.charAt(start - 1))) --start;
			
			curWord = null;
			
			if (start != end) 
			{
				curWord = curLine.substring(start, end);
			}

			list = new Array();
			seen = new StringMap();
			
			scan(-1);
			scan(1);
			return {list: list, from: CodeMirror.Pos(cur.line, start), to: CodeMirror.Pos(cur.line, end)};
		});
	}
	
	private function scan(dir:Int):Void
	{			
		var line = cur.line;
		var end2 = Math.min(Math.max(line + dir * range, editor.firstLine()), editor.lastLine()) + dir;
		while (line != end2) 
		{
			var text = editor.getLine(line);
			var m:Dynamic = null;
			
			var re:EReg = ~/([A-Z]+)/ig;
			
			re.map(text, function(e:EReg):String
			{
				m = e.matched(0);
				
				if (!(line == cur.line) || !(m == curWord))
				{
					if ((curWord == null || m.indexOf(curWord) == 0) && !seen.exists(m)) 
					{
						seen.set(m, true);
						list.push(m);
					}
				}
				
				return e.matched(0);
			}
			);
			
			line += dir;
		}
	}
}