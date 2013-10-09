package ;

#if macro
import haxe.xml.Fast;
import sys.io.File;
import sys.FileSystem;
#end

/**
 * ...
 * @author AS3Boyan
 */
class MacroUtils
{

	public function new() 
	{
		
	}
	
	//public static function getFileContent(path:Array<String>)
	//{		
		//var script:String = "";
		//for (filePath in path)
		//{
			//filePath = "./bin/includes/" + filePath;
			//
			//if (FileSystem.exists(filePath))
			//{
				//script += "(function(){" + File.getContent(filePath) + "})();";
			//}
			//else
			//{
				//trace("File not found: " + filePath);
			//}
		//}
		//
		//return script;
	//}
	
	//public static function embedJS()
	//{
		//var script:ScriptElement = Browser.document.createScriptElement();
		//var script = MacroUtils.getFileContent([
		//"js/codemirror-3.18/lib/codemirror.js", 
		//"js/codemirror-3.18/mode/haxe/haxe.js",
		//"js/codemirror/addon/hint/show-hint.js",
		//"js/codemirror-3.18/addon/edit/matchbrackets.js",
		//"js/codemirror-3.18/addon/edit/closebrackets.js",
		//"js/codemirror-3.18/addon/comment/comment.js",
		//"js/codemirror-3.18/addon/fold/foldcode.js",
		//"js/codemirror-3.18/addon/fold/foldgutter.js",
		//"js/codemirror-3.18/addon/fold/brace-fold.js",
		//"js/codemirror-3.18/addon/fold/comment-fold.js",
		//"js/codemirror-3.18/addon/selection/active-line.js",
		//"js/codemirror-3.18/addon/search/searchcursor.js",
		//"js/codemirror-3.18/addon/search/search.js",
		//"js/codemirror-3.18/addon/dialog/dialog.js",
		//"js/codemirror-3.18/addon/tern/tern.js",
		//"js/tern/doc/demo/polyfill.js",
		//"js/acorn/acorn.js",
		//"js/acorn/acorn_loose.js",
		//"js/acorn/util/walk.js",
		//"js/tern/lib/signal.js",
		//"js/tern/lib/tern.js",
		//"js/tern/lib/def.js",
		//"js/tern/lib/comment.js",
		//"js/tern/lib/infer.js",
		//"js/tern/doc/demo/demo.js",
		//"js/tern/plugin/doc_comment.js",
		//"js/jquery/jquery-2.0.3.min.js",
		//"js/bootstrap/bootstrap.min.js",
		//"js/ide.js"
		//]);
		//
		//File.saveContent("./bin/includes/js/ide.js", script);
	//}
	
	//haxe -cp src --macro "MacroUtils.embedJSinHtml()"
	public static function embedJSinHtml()
	{
		var html:String = File.getContent("./bin/page.html");
		
		var ereg:EReg = ~/[<]script(.)+script[>]/g;
		
		html = ereg.map(html, function(_ereg:EReg)
		{
			var script:String = _ereg.matched(0);
			
			var xml = Xml.parse(script);			
			var fast = new Fast(xml.firstElement());
			
			var embedded_script = null;
			
			//"<!--" + fast.att.src + "-->\n"
			
			if (fast.has.src)
			{
				embedded_script = "<script>" + File.getContent("bin/" + fast.att.src) +  "</script>" ;
			}
			else
			{
				embedded_script = script;
			}
			
			return embedded_script;
		}
		);
		
		ereg = ~/[<]link(.+)[>]/g;
		
		html = ereg.map(html, function(_ereg:EReg)
		{
			var script:String = _ereg.matched(0);
			
			var xml = Xml.parse(script + "</link>");			
			var fast = new Fast(xml.firstElement());
			
			var embedded_script = null;
			
			if (fast.has.href)
			{
				var path:String = fast.att.href;
				embedded_script = "<style>" + File.getContent("bin/" + path) + "</style>";
				
				var ereg3:EReg = ~/[.][.]\//g;
				embedded_script = ereg3.replace(embedded_script, "./includes/");
			}
			else
			{
				embedded_script = script;
			}
			
			return embedded_script;
		}
		);
		
		File.saveContent("./bin/index.html", html);
	}
}