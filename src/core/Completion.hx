package core;
import haxe.Timer;
import completion.Hxml.CompletionData;
import parser.RegexParser;
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
    
typedef TopLevelImport =
{
    name:String,
    ?fullName:String
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
					var completionItem = generateCompletionItem(completion.n, completion.t, completion.d);
					list.push(completionItem);
				}
        		
        		getCurrentWord(cm, {word: ~/[A-Z.]+$/i});
        
        		var className = "CodeMirror-Tern-completion";	
        
				if (curWord == null || curWord.indexOf(".") == -1)
                    
				{
					var doc = TabManager.getCurrentDocument();
					
					if (doc != null)
					{
						var variableDeclarations = RegexParser.getVariableDeclarations(doc.getValue());
						
						for (item in variableDeclarations)
						{
							var completionItem = generateCompletionItem(item.name, item.type);
							list.push(completionItem);
						}
						
						var functionDeclarations = RegexParser.getFunctionDeclarations(doc.getValue());

						for (item in functionDeclarations)
						{
							var completionData = generateFunctionCompletionItem(item.name, item.params);
							var completionItem = createCompletionItem(item.name, null, completionData);
							list.push(completionItem);
						}
					}
					
				    list = list.concat(SnippetsCompletion.getCompletion());
                    
                    var classList = getClassList();
                    
					var packages:Array<String> = [];				
	
                    for (item in classList.topLevelClassList)
                    {
                        var completion:CompletionData = {text: item.name };
                        completion.className = className + " CodeMirror-Tern-completion-class";
                    	list.push(completion);
                    }

					for (list in [ClassParser.importsList, ClassParser.haxeStdImports])
					{
						for (item in list)
						{
							var str = item.split(".")[0];
	
							if (packages.indexOf(str) == -1 && str.charAt(0) == str.charAt(0).toLowerCase())
							{
								packages.push(str);
							}	 
						}
					}

					for (item in packages)
					{
						var completion:CompletionData = {text: item };
                        completion.className = className + " CodeMirror-Tern-completion-package";
                    	list.push(completion);
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
				var classList = getClassList();
                     
				var className = "CodeMirror-Tern-completion";

                for (item in classList.topLevelClassList)
                {
                    var completion:CompletionData = {text: item.name };
                    completion.className = className + " CodeMirror-Tern-completion-class";
                    list.push(completion);
                }
                    
                for (item in classList.importsList)
                {
                    var completion:CompletionData = {text: item};
                    completion.className = className + " CodeMirror-Tern-completion-class";
                    list.push(completion);
                }

			default:
				
		}
		
    	getCurrentWord(cm, options);
    
		list = Filter.filter(list, curWord, completionType);
		
		var data:Dynamic = { list: list, from: { line:cur.line, ch:start }, to: { line:cur.line, ch:end } };
		CodeMirrorStatic.attachContextInfo(Editor.editor, data);

		switch (completionType)
        {
        	case REGULAR, CLASSLIST:
                CodeMirrorStatic.on(data, "pick", searchForImport);
            default:
        }

		return data;
	}
	
    static function searchForImport(completion:CompletionData)
    {
        var cm = Editor.editor;
        
        var cursor = cm.getCursor();
        var curLine:String = cm.getLine(cursor.line);
        
        var word = ~/[A-Z\.]+$/i;
        
        var importStart = cursor.ch;
        var importEnd = importStart;
        
        while (importStart > 0 && word.match(curLine.charAt(importStart - 1))) --importStart;
        
        if (importStart != importEnd) 
		{
            var fullImport = curLine.substring(importStart, importEnd);
            
            if (fullImport.indexOf(".") != -1)
            {
                var topLevelClassList = core.Completion.getClassList().topLevelClassList;
                ImportDefinition.searchImportByText(topLevelClassList, fullImport, {line: cursor.line, ch:importStart}, {line: cursor.line, ch:importEnd}, false);
            }
		}
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
			Editor.regenerateCompletionOnDot = true;
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

	static function searchImage(name:String, ?type:String, ?description:String)
	{
		var functionData = FunctionParametersHelper.parseFunctionParams(name, type, description);
		
		var info:String = null;

		var className = "CodeMirror-Tern-completion";

		if (functionData.parameters != null) 
		{
			var data = generateFunctionCompletionItem(name, functionData.parameters);
			className = data.className;
			info = data.info + ":" + functionData.retType;
		}
		else if (type != null)
		{
			info = type;

			switch (info) 
			{
				case "Bool":
					className += " CodeMirror-Tern-completion-bool";
				case "Float", "Int", "UInt":
					className += " CodeMirror-Tern-completion-number";
				case "String":
					className += " CodeMirror-Tern-completion-string";
				default:
					if (info.indexOf("Array") != -1) 
					{
						className += " CodeMirror-Tern-completion-array";
					}
					else if(info.indexOf("Map") != -1 || info.indexOf("StringMap") != -1) 
					{
						className += " CodeMirror-Tern-completion-map";
					}
					else 
					{
						className += " CodeMirror-Tern-completion-object";
					}
			}
		}
			
		return {className: className, info: info};
	}

	static function generateFunctionCompletionItem(name:String, params:Array<String>)
	{
		var info:String = null;

		var className = "CodeMirror-Tern-completion";
		
		info = name + "(";
		
		if (params != null)
		{
			info += params.join(", ");
		}
			
		info += ")";
		
		className += " CodeMirror-Tern-completion-fn";
		
		return {className: className, info: info};
	}

	static function generateCompletionItem(name:String, ?type:String, ?description:String)
	{
		var completionData = searchImage(name, type, description);
		return createCompletionItem(name, description, completionData);
	}

	static function createCompletionItem(name:String, description:String, completionData:Dynamic)
	{
		var completionItem:CompletionData = { text: name };

		completionItem.className = completionData.className;	

		var infoSpan:SpanElement = Browser.document.createSpanElement();

		if (completionData.info != null)
		{
			var infoTypeSpan:SpanElement = Browser.document.createSpanElement();
			infoTypeSpan.textContent = completionData.info;
			infoSpan.appendChild(infoTypeSpan);

			infoSpan.appendChild(Browser.document.createElement("br"));
			infoSpan.appendChild(Browser.document.createElement("br"));
		}

		if (description != null)
		{
			var infoDescriptionSpan:SpanElement = Browser.document.createSpanElement();
			infoDescriptionSpan.className = "completionDescription";
			infoDescriptionSpan.innerHTML = description;
			infoSpan.appendChild(infoDescriptionSpan);
		}

		if (completionData.info != null || description != null)
		{
			completionItem.info = function (completionItem) 
			{
				return infoSpan;
			};
		}

		return completionItem;
	}


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
	
    public static function getClassList()
    {
        var value = tabmanager.TabManager.getCurrentDocument().getValue();

        var filePackage = RegexParser.getFilePackage(value);
        var fileImports = RegexParser.getFileImportsList(value);

        var topLevelClassList:Array<TopLevelImport> = [];
        var importsList:Array<String> = [];
        
        var relativeImport:String = null;

        var parentPackages:Array<String> = [];
        
        if (filePackage.filePackage != null && filePackage.filePackage != "")
        {
            var packages = filePackage.filePackage.split(".");

            var parentPackage:String;

            while (packages.length > 0)
            {
                parentPackage = packages.join(".");
                packages.pop();
                parentPackages.push(parentPackage);
            }
        }
        
        var found:Bool;
            
        for (list2 in [ClassParser.importsList, ClassParser.haxeStdImports])
        {
            for (item in list2) 
            {
                found = false;
                
                for (parentPackage in parentPackages)
                {
                	if (StringTools.startsWith(item, parentPackage + ".") && item.indexOf(".", parentPackage.length + 1) == -1)
                    {
                        relativeImport = item.substr(parentPackage.length + 1);
                        topLevelClassList.push({name: relativeImport, fullName: item});
                        found = true;
                        break;
                    }
                }
                
            	if (!found)
                {
                    if (fileImports.indexOf(item) != -1)
                    {
                        relativeImport = item.split(".").pop();
                        topLevelClassList.push({name: relativeImport, fullName: item});
                    }
                    else if (filePackage.filePackage != null && filePackage.filePackage != "" && StringTools.startsWith(item, filePackage.filePackage + "."))
                    {
                        relativeImport = item.substr(filePackage.filePackage.length + 1);
                        importsList.push(relativeImport);
                    }
                    else
                    {
                        relativeImport = item;
                        importsList.push(relativeImport);
                    }
                }
                
            }
        }

        for (list2 in [ClassParser.haxeStdTopLevelClassList, ClassParser.topLevelClassList])
        {
            for (item in list2) 
            {

                topLevelClassList.push({name: item});
            }
        }
            
       	for (item in fileImports)
        {
            found = false;
             
			relativeImport = item.split(".").pop();
			
			for (topLevelItem in topLevelClassList)
            {
                if (topLevelItem.name == relativeImport)
                {
                    found = true;
                    break;
                }
			}

			if (!found)
            {
                topLevelClassList.push({name: relativeImport, fullName: item});
            }
		}
            
        return {topLevelClassList: topLevelClassList, importsList: importsList};
    }

        
	public static function getCompletionType()
    {
        return completionType;
    }

}
