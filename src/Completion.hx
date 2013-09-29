package ;
import haxe.ds.StringMap.StringMap;

/**
 * ...
 * @author AS3Boyan
 */
class Completion
{

	public function new() 
	{
		var WORD:EReg = ~/[A-Z]+$/i;
		var RANGE = 500;

		CodeMirror.registerHelper("hint", "haxe", function(editor:CodeMirror, options) {
			var word:EReg = null;
			
			if (options != null && options.word != null)
			{
				word = options.word;
			}
			else if (WORD != null)
			{
				word = WORD;
			}
			
			var range:Int = null;
			
			if (options != null && options.range != null)
			{
				range = options.range;
			}
			else if (RANGE != null)
			{
				range = RANGE;
			}
			
			var cur = editor.getCursor();
			var curLine:String = editor.getLine(cur.line);
			var start:Int = cur.ch;
			var end = start;
			
			while (end < curLine.length && word.match(curLine.charAt(end))) ++end;
			while (start > 0 && word.match(curLine.charAt(start - 1))) --start;
			
			var curWord = null;
			
			if (start != end) 
			{
				curWord = curLine.substring(start, end);
			}

			var list = new Array();
			var seen:StringMap<Bool> = new StringMap();
			
				var dir = -1;
			
				var line = cur.line;
				var end2 = Math.min(Math.max(line + dir * range, editor.firstLine()), editor.lastLine()) + dir;
				while (line != end2) 
				{
					var text = editor.getLine(line);
					var m:Dynamic = null;
					
					//trace(text);
					
					//var re:EReg = ~/[A-Z]+$/i;
					
					//
					//re.map(text, function(e:EReg):String
					//{
						//trace(e.matched(0));
						//return e.matched(0);
					//}
					//);
					
					//var re:Dynamic = untyped __js__("new RegExp(word.source, \"g\")");
					
					//while (re.match(text)) 
					//{
						//m = re.matched(0);
						//re.map
						//trace(m);
						//m.push(re.matched(0));
					
						//if (line == cur.line && m == curWord) continue;
						//if ((curWord == null || m.indexOf(curWord) == 0) && !seen.exists(m)) 
						//{
							//seen.set(m, true);
							//list.push(m);
						//}
					//}
					
					line += dir;
				}
			
			//scan(-1);
			//scan(1);
			return {list: list, from: CodeMirror.Pos(cur.line, start), to: CodeMirror.Pos(cur.line, end)};
		});
	}
	
	//public static function scan(dir)
	//{
		//var line = cur.line;
		//var end = Math.min(Math.max(line + dir * range, editor.firstLine()), editor.lastLine()) + dir;
		//while (line != end) {
		//var text = editor.getLine(line), m;
		//var re = new RegExp(word.source, "g");
		//while (m = re.exec(text)) {
		//if (line == cur.line && m[0] == curWord) continue;
		//if ((!curWord || m[0].indexOf(curWord) == 0) && !seen.hasOwnProperty(m[0])) {
		//seen[m[0]] = true;
		//list.push(m[0]);
		//}
		//}
		//
		//line += dir;
		//}
	//}
}