package completion;
import cm.Editor;
import completion.Hxml.CompletionData;
import haxe.Timer;
import js.Node;
import tjson.TJSON;

/**
 * ...
 * @author AS3Boyan
 */
class SnippetsCompletion
{
	static var instance:SnippetsCompletion;
	
	public function new() 
	{
		
	}	
	
	public static function get()
	{
		if (instance == null)
		{
			instance = new SnippetsCompletion();
		}
			
		return instance;
	}
	
	public function load():Void 
	{
		var options:NodeFsFileOptions = { };
		options.encoding = NodeC.UTF8;
		
		Node.fs.readFile(Node.path.join("core", "config", "snippets.json"), options, function (error:NodeErr, data:String):Void 
		{
			if (error == null) 
			{
				var templates = TJSON.parse(data);
				
				var snippets:Array<Dynamic> = templates.snippets;
				
				for (template in snippets) 
				{
					untyped CodeMirrorStatic.templatesHint.addTemplates(template, true);
				}
			}
			else 
			{
				Alertify.error("Can't open core/config/snippets.json");
			}
		});
	}
	
	public function getCompletion():Array<CompletionData>
	{		
		var completions:Array<CompletionData> = untyped CodeMirrorStatic.templatesHint.getCompletions(Editor.editor);
		return completions;
	}
	
}