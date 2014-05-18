package core;
import cm.Editor;
import CodeMirror;
import completion.Filter;
import completion.Hxml;
import completion.MetaTags;
import completion.SnippetsCompletion;
import haxe.ds.StringMap.StringMap;
import haxe.xml.Fast;
import js.Browser;
import js.html.DivElement;
import js.html.SpanElement;
import js.Node;
import openproject.OpenFL;
import parser.ClassParser;
import projectaccess.Project;
import projectaccess.ProjectAccess;
import tabmanager.TabManager;

/**
 * ...
 * @author AS3Boyan
 */
enum CompletionType
{
	REGULAR;
	FILELIST;
	PASTEFOLDER;
    OPENFILE;
	CLASSLIST;
	HXML;
	METATAGS;
}

typedef CompletionItem = 
{
	@:optional
	var d:String;
	@:optional
	var t:String;
	var n:String;
}
 
class Completion
{
	static var list:Array<CompletionData>;
	static var editor:CodeMirror;
	static var word:EReg;
	static var range:Int;
	static var cur:Pos;
	static var end:Int;
	static var start:Int;
	static var WORD:EReg = ~/[A-Z]+$/i;
	static var RANGE = 500;
	public static var curWord:String;
	public static var completions:Array<CompletionItem> = [];
	static var completionType:CompletionType = REGULAR;
	static var completionActive:Bool;
    
	public static function registerHelper() 
	{
		Hxml.load();
		MetaTags.load();
		SnippetsCompletion.load();
		
        completionActive = false;
        
        Editor.editor.on("endCompletion", function ()
                        {
                            completionActive = false;
                        });
	}
	
	static function getHints(cm:CodeMirror, ?options:Dynamic): { list: Array<CompletionData>, from: CodeMirror.Pos, to: CodeMirror.Pos }
	{		
		word = null;
		
		range = null;
		
		if (options != null && options.range != null)
		{
			range = options.range;
		}
		else if (RANGE != null)
		{
			range = RANGE;
		}

		list = new Array();
		
		switch (completionType) 
		{
			case REGULAR:
				for (completion in completions) 
				{
					var completionItem:CompletionData = { text: completion.n };
					
					var functionData = FunctionParametersHelper.parseFunctionParams(completion);
					
					var info:String;
					
					completionItem.className = "CodeMirror-Tern-completion";
					
					if (functionData.parameters != null) 
					{
						info = completion.n + "(" + functionData.parameters.join(", ") + ")" + ":" + functionData.retType;
						completionItem.className += " CodeMirror-Tern-completion-fn";
					}
					else
					{
						info = completion.t;
						
						switch (info) 
						{
							case "Bool":
								completionItem.className += " CodeMirror-Tern-completion-bool";
							case "Float", "Int", "UInt":
								completionItem.className += " CodeMirror-Tern-completion-number";
							case "String":
								completionItem.className += " CodeMirror-Tern-completion-string";
							default:
								if (info.indexOf("Array") != -1) 
								{
									completionItem.className += " CodeMirror-Tern-completion-array";
								}
								else if(info.indexOf("Map") != -1 || info.indexOf("StringMap") != -1) 
								{
									completionItem.className += " CodeMirror-Tern-completion-map";
								}
								else 
								{
									completionItem.className += " CodeMirror-Tern-completion-object";
								}
						}
					}
					
					var infoSpan:SpanElement = Browser.document.createSpanElement();
					
					var infoTypeSpan:SpanElement = Browser.document.createSpanElement();
					infoTypeSpan.textContent = info;
					infoSpan.appendChild(infoTypeSpan);
					
					infoSpan.appendChild(Browser.document.createElement("br"));
					infoSpan.appendChild(Browser.document.createElement("br"));
					
					var infoDescriptionSpan:SpanElement = Browser.document.createSpanElement();
					infoDescriptionSpan.className = "completionDescription";
					infoDescriptionSpan.innerHTML = completion.d;
					infoSpan.appendChild(infoDescriptionSpan);
					
					completionItem.info = function (completionItem) 
					{
						return infoSpan;
					};
					
					list.push(completionItem);
				}
				
        		
        		getCurrentWord(cm, {word: ~/[A-Z.]+$/i});
        
				if (curWord == null || curWord.indexOf(".") == -1)
				{
				    list = list.concat(SnippetsCompletion.getCompletion());
                    
                    for (list2 in [ClassParser.topLevelClassList, ClassParser.haxeStdTopLevelClassList])
                    {
                    	for (item in list2)
                        {
                            list.push({ text: item});
                        }
                    }
				}
			case METATAGS:
				list = MetaTags.getCompletion();
			case HXML:
				list = Hxml.getCompletion().copy();
        
        		for (list2 in [ClassParser.topLevelClassList, ClassParser.importsList, ClassParser.haxeStdTopLevelClassList, ClassParser.haxeStdImports])
                {
                	for (item in list2) 
                    {
                        list.push( { text: item} );
                    }
                }
			case FILELIST:
        		var displayText:String;
        
				for (list2 in [ClassParser.filesList, ClassParser.haxeStdFileList])
                {
                    for (item in list2) 
                    {                    
                        list.push( { text: item.path, displayText: processDisplayText(item.path)} );
                    }
				}
            case PASTEFOLDER:
        		var displayText:String;
        
        		for (item in ClassParser.filesList) 
				{
					list.push( { text: item.directory, displayText: processDisplayText(item.path)} );
				}
			case CLASSLIST:
				for (list2 in [ClassParser.topLevelClassList, ClassParser.importsList, ClassParser.haxeStdTopLevelClassList, ClassParser.haxeStdImports])
                {
                	for (item in list2) 
                    {
                        list.push( { text: item} );
                    }
                }
			default:
				
		}
		
    	getCurrentWord(cm, options);
    
		list = Filter.filter(list, curWord, completionType);
		
		var data:Dynamic = { list: list, from: { line:cur.line, ch:start }, to: { line:cur.line, ch:end } };
		CodeMirrorStatic.attachContextInfo(Editor.editor, data);
		return data;
	}
	
    public static function processDisplayText(displayText:String):String
    {
        if (displayText.length > 70)
        {
            displayText = displayText.substr(0, 35) + " ... " + displayText.substr(displayText.length - 35);
        }
            
        return displayText;
    }
    
	public static function getCurrentWord(cm:CodeMirror, ?options:Dynamic, ?pos:Pos):{word:String, from:CodeMirror.Pos, to:CodeMirror.Pos}
	{
		if (options != null && options.word != null)
		{
			word = options.word;
		}
		else if (WORD != null)
		{
			word = WORD;
		}
		
		if (pos != null) 
		{
			cur = pos;
		}
		
		var curLine:String = cm.getLine(cur.line);
		start = cur.ch;
		
		end = start;
		
		while (end < curLine.length && word.match(curLine.charAt(end))) ++end;
		while (start > 0 && word.match(curLine.charAt(start - 1))) --start;
		
		curWord = null;
		
		if (start != end) 
		{
			curWord = curLine.substring(start, end);
		}
		
		return {word:curWord, from: {line:cur.line, ch: start}, to: {line:cur.line, ch: end}};
	}
	
	public static function getCompletion(onComplete:Dynamic, ?_pos:Pos)
	{        
		if (ProjectAccess.path != null) 
		{
			var projectArguments:Array<String> = [];
			//= ProjectAccess.currentProject.args.copy();
			
			var project = ProjectAccess.currentProject;
            
			switch (project.type)
			{
				case Project.HAXE:
					var pathToHxml:String = project.targetData[project.target].pathToHxml;
					projectArguments.push(pathToHxml);
					processArguments(projectArguments, onComplete, _pos);
				case Project.HXML:
					projectArguments.push(project.main);
					processArguments(projectArguments, onComplete, _pos);
				case Project.OPENFL:
					OpenFL.parseOpenFLDisplayParameters(ProjectAccess.path, project.openFLTarget, function (args:Array<String>):Void 
					{
						projectArguments = args;
						processArguments(projectArguments, onComplete, _pos);
					}
					);
				default:
					
			}
		}
	}
	
	static function processArguments(projectArguments:Array<String>, onComplete:Dynamic, ?_pos:Pos):Void 
	{
        trace("processArguments");
        
		projectArguments.push("--no-output");
		projectArguments.push("--display");
		
		var cm:CodeMirror = Editor.editor;
		cur = _pos;
		
		if (_pos == null) 
		{
			cur = cm.getCursor();
		}
		
		getCurrentWord(cm, null, cur);
		
		if (curWord != null) 
		{
			cur = {line: cur.line,  ch:start};
		}
		
		projectArguments.push(TabManager.getCurrentDocumentPath() + "@" + Std.string(cm.indexFromPos(cur)));
		
		completions = [];
		
		var params = ["--connect", "5000", "--cwd", HIDE.surroundWithQuotes(ProjectAccess.path)].concat(projectArguments);
		
		ProcessHelper.runProcess("haxe", params, null, function (stdout:String, stderr:String)
		{
			var xml:Xml = Xml.parse(stderr);
			
			var fast = new Fast(xml);
			
			if (fast.hasNode.list)
			{
				var list = fast.node.list;
				
				var completion:CompletionItem;
				
				if (list.hasNode.i)
				{
					for (item in list.nodes.i) 
					{
						if (item.has.n)
						{
							completion = {n: item.att.n};
														
							if (item.hasNode.d)
							{
								var str = StringTools.trim(item.node.d.innerHTML);
								str = StringTools.replace(str, "\t", "");
								str = StringTools.replace(str, "\n", "");
								str = StringTools.replace(str, "*", "");
								str = StringTools.replace(str, "&lt;", "<");
								str = StringTools.replace(str, "&gt;", ">");
								str = StringTools.trim(str);
								completion.d = str;
							}
							
							if (item.hasNode.t)
							{
								completion.t = item.node.t.innerData;
							}
							
							completions.push(completion);
						}
					}
				}
			}
			
			onComplete();
		}, 
		function (code:Int, stdout:String, stderr:String)
		{
			trace(code);
			trace(stderr);
			
			onComplete();
		}
		);
	}
	
    static function getHintAsync(cm:CodeMirror, c:Dynamic)
	{   
        if (completionActive)
        {
            c(getHints(cm));
        }
        else
        {
            Completion.getCompletion(function ()
                                     {
                                         c(getHints(cm));
                                     });
            
            completionActive = true;
        }
    }
        
	public static function isEditorVisible():Bool
	{
		var editor = cast(Browser.document.getElementById("editor"), DivElement);
		return editor.style.display != "none";
	}
	
	public static function showRegularCompletion():Void
	{
		if (isEditorVisible()) 
		{
			Editor.regenerateCompletionOnDot = true;
			WORD = ~/[A-Z]+$/i;
			completionType = REGULAR;
            
            var hint:Dynamic = getHintAsync;
            hint.async = true;
            
            Editor.editor.showHint({hint: hint, completeSingle: false});
		}
	}
	
	public static function showMetaTagsCompletion():Void
	{
		if (isEditorVisible()) 
		{
            cur = Editor.editor.getCursor();
            Editor.regenerateCompletionOnDot = false;
			WORD = ~/[A-Z@:]+$/i;
			completionType = METATAGS;
			CodeMirrorStatic.showHint(Editor.editor, getHints, { closeCharacters: untyped __js__("/[\\s()\\[\\]{};>,]/") } );
		}
	}
	
	public static function showHxmlCompletion():Void
	{
		if (isEditorVisible()) 
		{
            cur = Editor.editor.getCursor();
            Editor.regenerateCompletionOnDot = false;
			WORD = ~/[A-Z- \.\\\/]+$/i;
			completionType = HXML;
			CodeMirrorStatic.showHint(Editor.editor, getHints, { closeCharacters: untyped __js__("/[()\\[\\]{};:>,]/") } );
		}
	}
	
//     Quick Open/Show File List for Hxml completion
	public static function showFileList(?openFile:Bool = true, ?insertDirectory:Bool = false):Void
	{		
        if (openFile)
        {
            completionType = OPENFILE;            
            QuickOpen.show(ClassParser.filesList.copy().concat(ClassParser.haxeStdFileList));
        }
        else if (isEditorVisible()) 
		{
            cur = Editor.editor.getCursor();
			Editor.regenerateCompletionOnDot = false;
			WORD = ~/[A-Z-\.\\\/]+$/i;
            
            if (insertDirectory == false)
            {
                completionType = FILELIST;
            }
            else
            {
                completionType = PASTEFOLDER;
            }
                
            CodeMirrorStatic.showHint(Editor.editor, getHints);
		}
	}
	
//     Shows list of all classes available for project, used to provide imports completion("import |"), triggered on ":" symbol
	public static function showClassList(?ignoreWhitespace:Bool = false):Void
	{
		if (isEditorVisible()) 
		{
            cur = Editor.editor.getCursor();
			Editor.regenerateCompletionOnDot = false;
			WORD = ~/[A-Z\.]+$/i;
			completionType = CLASSLIST;
            
//             default closeCharacters value
//             "/[\s()\[\]{};:>,]/"
			
			var closeCharacters = untyped __js__("/[\\s()\\[\\]{};>,]/");
			
			if (ignoreWhitespace) 
			{
				closeCharacters = untyped __js__("/[()\\[\\]{};>,]/");
			}
			
			CodeMirrorStatic.showHint(Editor.editor, getHints, { closeCharacters: closeCharacters  } );
		}
	}
	
// 	static function getImportHints(cm:CodeMirror)
// 	{
        
//     }

	public static function showImportDefinition(importsSuggestions:Array<String>, ?from:CodeMirror.Pos, ?to:CodeMirror.Pos)
	{
        var cm = Editor.editor;
        
        CodeMirrorStatic.showHint(cm, function ()
            {
                var completions:Array<CompletionData> = [];
                
                var completion:CompletionData;
                
                for (item in importsSuggestions)
                {
                     completion = {};
                     completion.text = item;
                     completion.displayText = "import " + item;
                     completion.hint = ImportDefinition.importClassHint.bind(from, to);
                     completions.push(completion);
				}
        		
				var pos = cm.getCursor();
                                  
        		var data:Dynamic = { list: completions, from: pos, to: pos };
        		return data;
            }
        , {completeSingle: false});
    }

	public static function getCompletionType()
    {
        return completionType;
    }

}
