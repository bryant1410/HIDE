package cm;
import parser.RegexParser;
#if !macro
import CodeMirror.Pos;
import core.Completion;
import core.FunctionParametersHelper;
import core.HaxeLint;
import core.HaxeParserProvider;
import core.Helper;
import core.Hotkeys;
import core.OutlinePanel;
import haxe.Json;
import haxe.Timer;
import jQuery.JQuery;
import js.Browser;
import js.html.DivElement;
import js.html.KeyboardEvent;
import js.html.svg.TextElement;
import js.html.TextAreaElement;
import js.Lib;
import js.Node;
import menu.BootstrapMenu;
import nodejs.webkit.Window;
import parser.OutlineHelper;
import projectaccess.ProjectAccess;
import tabmanager.TabManager;
import tjson.TJSON;
#end

#if macro
import haxe.macro.Context;
import haxe.macro.Expr;
import sys.FileSystem;
#end
    
/**
 * ...
 * @author AS3Boyan
 */
class Editor
{	
	#if !macro
	
	public static var editor:CodeMirror;
	public static var regenerateCompletionOnDot:Bool;
	
	public static function load():Void
	{		
		regenerateCompletionOnDot = true;
		
		var readFileOptions:NodeFsFileOptions = {};
		readFileOptions.encoding = NodeC.UTF8;
		
		var options:Dynamic = { };
		
		try 
		{
			options = TJSON.parse(Node.fs.readFileSync(Node.path.join("core", "config", "editor.json"), readFileOptions));
		}
		catch (err:Error)
		{
			trace(err);
		}
		
		walk(options);
		
		options.extraKeys = 
		{
			"." : 
				function passAndHint(cm) 
				{
					if (TabManager.getCurrentDocument().getMode().name == "haxe") 
					{
						var completionActive = editor.state.completionActive;
						var completionType = Completion.getCompletionType();
                        
						if ((completionType == CompletionType.REGULAR || completionType == CompletionType.CLASSLIST) && completionActive != null && completionActive.widget != null) 
						{
							completionActive.widget.pick();
						}
					}
					
					untyped __js__("return CodeMirror.Pass");
				},
			";":
				function passAndHint(cm:CodeMirror) 
				{
					var cursor = editor.getCursor();
					var ch = editor.getRange(cursor, { line: cursor.line, ch: cursor.ch +1 } );
					
					if (ch == ";") 
					{
						cm.execCommand("goCharRight");
					}
					else 
					{
						untyped __js__("return CodeMirror.Pass");
					}
				},
           	"=":
				function passAndHint(cm2:CodeMirror) 
				{
                    var mode = TabManager.getCurrentDocument().getMode().name;
                    
					if (Completion.getCompletionType() == CompletionType.REGULAR && mode == "haxe" || mode == "xml")
					{
						var completionActive = cm2.state.completionActive;
						
						if (completionActive != null && completionActive.widget != null) 
						{
							completionActive.widget.pick();
						}
                            
                        if (mode == "xml")
                        {
                            var cur = cm2.getCursor();
                            cm2.replaceRange("=\"\"", cur, cur);
                            cm2.execCommand("goCharLeft");
                            cm.Xml.completeIfInTag(cm2);
                        }
                        else
                        {
                            untyped __js__("return CodeMirror.Pass");
                        }
                        
					}
					else
                    {
                        untyped __js__("return CodeMirror.Pass");
                    }
					
				},
//             "\\\'(\\\'":
//             	function passAndHint(cm2:CodeMirror)
//             	{
//                     trace("test");
//                     cm.Xml.completeIfInTag(cm2);
//                     untyped __js__("return CodeMirror.Pass");
//                 },
            	
            "\\\'<\\\'":
            	function passAndHint(cm2:CodeMirror)
            	{
                    cm.Xml.completeAfter(cm2);
                    untyped __js__("return CodeMirror.Pass");
                },
            	
            "\\\'/\\\'":
            	function passAndHint(cm2:CodeMirror)
            	{
                    cm.Xml.completeIfAfterLt(cm2);
                    untyped __js__("return CodeMirror.Pass");
                },
            "\\\' \\\'":
                function passAndHint(cm2:CodeMirror)
            	{
                    cm.Xml.completeIfInTag(cm2);
                    untyped __js__("return CodeMirror.Pass");
                },
            "Ctrl-J": "toMatchingTag"
		}
		
		editor = CodeMirror.fromTextArea(Browser.document.getElementById("code"), options);
        
		editor.on("keypress", function (cm:CodeMirror, e:KeyboardEvent):Void 
		{
			if (e.shiftKey) 
			{
                if (e.keyCode == 40 || e.keyCode == 62)
                {
                    if (Completion.getCompletionType() == CompletionType.REGULAR && TabManager.getCurrentDocument().getMode().name == "haxe") 
                    {
                        var completionActive = editor.state.completionActive;

                        if (completionActive != null && completionActive.widget != null) 
                        {
                            completionActive.widget.pick();
                        }
                    }
                }
			}
		}
		);
		
		new JQuery("#editor").hide(0);
		
		loadThemes(getThemeList(), loadTheme);
		
		var value:String = "";
		var map = CodeMirror.keyMap.sublime;
		var mapK = untyped CodeMirror.keyMap["sublime-Ctrl-K"];
		
		  for (key in Reflect.fields(map)) 
		  {
			  //&& !/find/.test(map[key])
			if (key != "Ctrl-K" && key != "fallthrough")
			{
				value += "  \"" + key + "\": \"" + Reflect.field(map, key) + "\",\n";
			}
			  
		  }
		  for (key in Reflect.fields(mapK)) 
		  {
			if (key != "auto" && key != "nofallthrough")
			{
				value += "  \"Ctrl-K " + key + "\": \"" + Reflect.field(mapK, key) + "\",\n";
			}
			  
		  }
		
// 		trace(Editor.editor);
		
		Node.fs.writeFileSync(Node.path.join("core", "bindings.txt"), value, NodeC.UTF8);
		
		Browser.window.addEventListener("resize", function (e)
		{
			Helper.debounce("resize", function ():Void 
			{
				editor.refresh();
			}, 100);
			
			Timer.delay(resize, 50);
		}
		);
		
		new JQuery('#thirdNested').on('resize', 
		function (event) {       
			var panels = event.args.panels;
			
			resize();
		});
		
		ColorPreview.create(editor);
		
		editor.on("cursorActivity", function (cm:CodeMirror)
		{
			Helper.debounce("cursorActivity", function ():Void 
			{
				FunctionParametersHelper.update(cm);
				ColorPreview.update(cm);
				ERegPreview.update(cm);
			}, 100);
		}
		);
		
		editor.on("scroll", function (cm:CodeMirror):Void 
		{
			ColorPreview.scroll(editor);
		}
		);
		
		var timer:Timer = null;
		
		var basicTypes = ["Array", "Map", "StringMap"];
		
// 		var ignoreNewLineKeywords = ["function", "for ", "while"];
		
		editor.on("change", function (cm:CodeMirror, e:CodeMirror.ChangeEvent):Void 
		{
            if (e.origin == "paste" && (e.from.line - e.to.line) > 0)
            {
                for (line2 in e.from.line...e.to.line)
                {
					cm.indentLine(line2);                
                }
            }
            
			var doc = TabManager.getCurrentDocument();
			var modeName:String = doc.getMode().name;
			
			if (modeName == "haxe") 
			{
				Helper.debounce("change", function ():Void 
				{
					HaxeLint.updateLinting();
				}, 100);
				
				var cursor = cm.getCursor();
				var data = cm.getLine(cursor.line);
				
				//if (StringTools.endsWith(e.text[0], ";")) 
				//{
					//var insertNewLine:Bool = true;
					//
					//for (keyword in ignoreNewLineKeywords) 
					//{
						//if (data.indexOf(keyword) != -1) 
						//{
							//insertNewLine = false;
							//break;
						//}
					//}
					//
					//cm.execCommand("newlineAndIndent");
				//}
				
				var lastChar = data.charAt(cursor.ch - 1);
				
				if (lastChar == ".")
                {
                    triggerCompletion(Editor.editor, true);
                }	
				if (lastChar == "=")
                {
                    var name = StringTools.trim(data.substring(0, cursor.ch - 1));
					
					var type = null;
					
					if (name != "" && name.indexOf(".") == -1)
					{						
						var variableDeclarations = RegexParser.getVariableDeclarations(doc.getValue());
						
						var variableWithExplicitType = [];
						
						for (item in variableDeclarations)
						{
							if (item.type != null)							
							{
								variableWithExplicitType.push(item);
							}
						}
							
						for (item in variableWithExplicitType)
						{
							if (name == item.name)
							{
								type = item.type;
								break;
							}	 
						}
						
						var suggestions = [];
					
						var value = doc.getValue();		
				
						if (type != null)
						{
							var variableWithSameType = [];
						
							for (item in variableWithExplicitType)
							{
								if (type == item.type)
								{
									variableWithSameType.push(item.name);
								}
							}
				
							for (item in variableWithSameType)
							{
// 								~/[\t ]*editor2[\t ]*= *(.+)$/gm
// 								~/[\t ]*editor2[\t ]*:[a-zA-Z0-9_]*[\t ]*= *(.+)$/gm
								 
								var ereg = new EReg("[\t ]*" + item + "[\t ]*= *(.+)$", "gm");
								var ereg2 = new EReg("[\t ]*" + item + "[\t ]*:[a-zA-Z0-9_<>]*[\t ]*= *(.+)$", "gm");
				
								ereg.map(value, function (ereg3)
										{
											var text = " " + ereg3.matched(1);
											
											if (suggestions.indexOf(text) == -1)
											{
												suggestions.push(text);
											}
											return "";
										});
				
								ereg2.map(value, function (ereg3)
										{
											var text = " " + ereg3.matched(1);
											
											if (suggestions.indexOf(text) == -1)
											{
												suggestions.push(text);
											}
											return "";
										});
							}
				
							suggestions.push(" " + "new " + type);
							Completion.showCodeSuggestions(suggestions);
						}
						else
						{
							var ereg = new EReg("[\t ]*" + name + "[\t ]*= *(.+)$", "gm");
							
							ereg.map(value, function (ereg3)
										{
											var text = " " + ereg3.matched(1);
											
											if (suggestions.indexOf(text) == -1)
											{
												suggestions.push(text);
											}
											return "";
										});
							
							if (suggestions.length > 0)
							{
								Completion.showCodeSuggestions(suggestions);
							}
						}
					}
                }	
				else if (lastChar == ":")
				{
					if (data.charAt(cursor.ch - 2) == "@")
					{
						Completion.showMetaTagsCompletion();
					}
					else 
					{
						Completion.showClassList();
					}
				}
				else if (lastChar == "<")
				{
					for (type in basicTypes) 
					{
						if (StringTools.endsWith(data.substr(0, cursor.ch - 1), type)) 
						{
							Completion.showClassList();
							break;
						}
					}
				}
				else if (StringTools.endsWith(data, "import ")) 
				{                    
					Completion.showClassList(true);
				}
			}
			else if (modeName == "hxml") 
			{
				var cursor = cm.getCursor();
				var data = cm.getLine(cursor.line);
				
				if (data == "-")
				{
					Completion.showHxmlCompletion();
				}
                else if (data == "-cp ")
                {
                    Completion.showFileList(false, true);
                }
                else if (data == "-dce ")
                {
                    Completion.showHxmlCompletion();
				}
                else if (data == "--macro ")
               	{
                    Completion.showClassList(true);
                }
			}
			
			//Helper.debounce("filechange", function ():Void 
			//{
				var tab = TabManager.tabMap.get(TabManager.selectedPath);
				tab.setChanged(!tab.doc.isClean());
			//}
			//, 150);
		}
		);
		
		CodeMirror.prototype.centerOnLine = function(line) 
		{
			untyped __js__(" var h = this.getScrollInfo().clientHeight;  var coords = this.charCoords({line: line, ch: 0}, 'local'); this.scrollTo(null, (coords.top + coords.bottom - h) / 2); ");
		};

		editor.on("gutterClick", function (cm:CodeMirror, line:Int, gutter:String, e)
						{
							if (ProjectAccess.currentProject != null && gutter == "CodeMirror-foldgutter")
							{
								saveFoldedRegions();
							}
						});
	}
	
	public static function saveFoldedRegions()
	{
		var doc = TabManager.getCurrentDocument();
		
		if (doc != null && ProjectAccess.currentProject != null)
		{
			var cm = editor;
			var foldedRegions:Array<Pos> = [];

			for (marker in doc.getAllMarks())
			{
				var pos = marker.find().from;

				if (cm.isFolded(pos))
				{
					foldedRegions.push(pos);
				}
			}

			var selectedFile = ProjectAccess.getFileByPath(Node.path.relative(ProjectAccess.path, TabManager.getCurrentDocumentPath()));

			if (selectedFile != null)
			{
				selectedFile.foldedRegions = foldedRegions;
				trace("folding regions saved successfully for" + Std.string(selectedFile));
			}
			else
			{
				trace("cannot save folded regions for this document");
			}
		}
		else
		{
			trace("unable to preserve code folding for" + Std.string(doc));
		}
	}

		
	public static function triggerCompletion(cm:CodeMirror, ?dot:Bool = false) 
	{
        trace("triggerCompletion");
        
		var modeName:String = TabManager.getCurrentDocument().getMode().name;
		
		switch (modeName)
		{
			case "haxe":
				//HaxeParserProvider.getClassName();
				
				if (!dot || regenerateCompletionOnDot || (dot && !cm.state.completionActive)) 
				{
					TabManager.saveActiveFile(function ():Void 
					{
						Completion.showRegularCompletion();
					});
				}
			case "hxml":
				Completion.showHxmlCompletion();
        	case "xml":
        		cm.showHint({completeSingle: false});
			default:
				
		}
	}
	
	private static function walk(object:Dynamic)
	{		
		var regexp = untyped __js__("RegExp");
		
		for (field in Reflect.fields(object))
		{
			var value = Reflect.field(object, field);
			
			if (Std.is(value, String)) 
			{
				if (StringTools.startsWith(value, "regexp")) 
				{
					try
					{
						Reflect.setField(object, field, Type.createInstance(regexp, [value.substring(6)]));
					}
					catch (err:Error)
					{
						trace(err);
					}
				}
				else if (StringTools.startsWith(value, "eval")) 
				{
					try 
					{
						Reflect.setField(object, field, Lib.eval(value.substring(4)));
					}
					catch (err:Error)
					{
						trace(err);
					}
				}
				
			}

			if (Reflect.isObject(value) && !Std.is(value, Array) && Type.typeof(value).getName() == "TObject") 
			{
				walk(value);
			}
		}
	}
	
	public static function resize():Void 
	{
		var height = Browser.window.innerHeight - 34 - new JQuery("ul.tabs").height() - new JQuery("#tabs1").height() - 5;
		new JQuery(".CodeMirror").css("height", Std.string(Std.int(height)) + "px");
	}
	
	private static function loadTheme() 
	{
		var localStorage2 = Browser.getLocalStorage();
		
		if (localStorage2 != null)
		{
			var theme:String = localStorage2.getItem("theme");
			
			if (theme != null) 
			{
				setTheme(theme);
			}
		}
		
	}
	
	private static function loadThemes(themes:Array<String>, onComplete:Dynamic):Void
	{
		var themesSubmenu = BootstrapMenu.getMenu("View").getSubmenu("Themes");
		var theme:String;
		
		var pathToThemeArray:Array<String> = new Array();
		
		themesSubmenu.addMenuItem("default", 0, setTheme.bind("default"));
		
		for (i in 0...themes.length)
		{
			theme = themes[i];
			themesSubmenu.addMenuItem(theme, i + 1, setTheme.bind(theme));
		}
		
		onComplete();
	}
	
	private static function setTheme(theme:String):Void
	{
		editor.setOption("theme", theme);
		Browser.getLocalStorage().setItem("theme", theme);
	}
	
	#end
	
	macro public static function getThemeList() 
	{
		var p = Context.currentPos();
		var result = [];
		
		for (theme in sys.FileSystem.readDirectory(Sys.getCwd() + "libs/js/CodeMirror/theme")) 
		{
			var eConst = EConst(CString(theme.split(".").shift()));
			result.push( { expr: eConst, pos: p } );
		}
        
//         for (theme in sys.FileSystem.readDirectory(Sys.getCwd() + "libs/css/theme"))
// 		{
// 			var eConst = EConst(CString(theme.split(".").shift()));
// 			result.push( { expr: eConst, pos: p } );
// 		}
		
		return { expr: EArrayDecl(result), pos: p };
    }
}
