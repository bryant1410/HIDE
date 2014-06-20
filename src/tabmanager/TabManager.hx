
package tabmanager;
import projectaccess.Project.FileData;
import js.html.KeyboardEvent;
import js.html.InputElement;
import cm.Xml;
import core.OutlinePanel;
import cm.CMDoc;
import cm.Editor;
import core.FileDialog;
import core.HaxeLint;
import core.RecentProjectsList;
import core.Utils;
import core.WelcomeScreen;
import filetree.FileTree;
import haxe.ds.StringMap.StringMap;
import haxe.Timer;
import jQuery.JQuery;
import js.Browser;
import js.html.AnchorElement;
import js.html.DivElement;
import js.html.Element;
import js.html.LIElement;
import js.html.MouseEvent;
import js.html.SpanElement;
import js.html.UListElement;
import js.Node;
import mustache.Mustache;
import nodejs.webkit.Window;
import projectaccess.ProjectAccess;
import watchers.LocaleWatcher;

/**
 * ...
 * @author AS3Boyan
 */
class TabManager
{
	public static var tabs:UListElement;
	public static var tabMap:TabMap;
	public static var selectedPath:String;
	static var selectedIndex:Int;
	
	public static function load():Void
	{
		tabs = cast(Browser.document.getElementById("tabs"), UListElement);
		
		tabMap = new TabMap();
		
		ContextMenu.createContextMenu();
		
		var options:Alertify.Options = { };
		options.labels = { };
		options.labels.ok = LocaleWatcher.getStringSync("Yes");
		options.labels.cancel = LocaleWatcher.getStringSync("No");
		
		Alertify.set(options);
		
		var indentWidthLabel = cast (Browser.document.getElementById("indent-width-label"), DivElement);
		var indentWidthInput = cast (Browser.document.getElementById("indent-width-input"), InputElement);
		
		indentWidthLabel.onclick = function (e)
			{
				indentWidthLabel.classList.add("hidden");
                indentWidthInput.classList.remove("hidden");
				indentWidthInput.focus();
				
				indentWidthInput.select();
				
				indentWidthInput.onblur = function (_)
					{
						indentWidthLabel.classList.remove("hidden");
                		indentWidthInput.classList.add("hidden");

						// remove all event handlers from the input field
						indentWidthInput.onblur = null;
						indentWidthInput.onkeyup = null;

						// restore focus to the editor
						Editor.editor.focus();
						
						setIndentationSize(Std.parseInt(indentWidthInput.value));	
					};
				
				indentWidthInput.onkeyup = function (event)
					{
						if (event.keyCode == 13) 
						{
                        	indentWidthInput.blur();
                        }
						else if (event.keyCode == 27)
						{
							resetIndentationSettings();
                        }
					};
			};
		
		var indentType = Browser.document.getElementById("indent-type");
		
		indentType.onclick = function (_)
			{
				var selectedFile = ProjectAccess.getFileByPath(TabManager.getCurrentDocumentPath());
				
				if (selectedFile != null)
				{	
					selectedFile.useTabs = !selectedFile.useTabs;
                    trace(selectedFile.useTabs);
					updateIndentationSettings(selectedFile);
					loadIndentationSettings(Editor.editor, selectedFile);
				}
			}
	}
	
	static function setIndentationSize(indentSize:Int)
	{
		var selectedFile = ProjectAccess.getFileByPath(TabManager.getCurrentDocumentPath());
				
		if (selectedFile != null)
		{
			selectedFile.indentSize = indentSize;
			updateIndentationSettings(selectedFile);
				loadIndentationSettings(Editor.editor, selectedFile);
		}
	}

	
	static function resetIndentationSettings()
	{
		var selectedFile = ProjectAccess.getFileByPath(TabManager.getCurrentDocumentPath());
				
		if (selectedFile != null)
		{	
			updateIndentationSettings(selectedFile);
		}
	}

	
	public static function createNewTab(name:String, path:String, doc:CodeMirror.Doc, ?save:Bool = false):Void
	{
		var tab = new Tab(name, path, doc, save);
		tabMap.add(tab);
		
		tabs.appendChild(tab.getElement());
		
		if (ProjectAccess.path != null) 
		{
			var relativePath = Node.path.relative(ProjectAccess.path, path);
			var selectedFile = ProjectAccess.getFileByPath(path);
			
			if (selectedFile == null) 
			{
				ProjectAccess.currentProject.files.push({path: relativePath});
			}
		}
		
		RecentProjectsList.addFile(path);
		
		Editor.resize();
	}
	
	public static function openFile(path:String, onComplete:String->Void)
	{
		var options:js.Node.NodeFsFileOptions = { };
		options.encoding = NodeC.UTF8;
		
		Node.fs.readFile(path, options, function (error:js.Node.NodeErr, code:String):Void
		{
			if (error != null)
			{
				trace(error);
			}
			else 
			{
				onComplete(code);
			}
		}
		);
	}
	
	public static function openFileInNewTab(path:String, ?show:Bool = true, ?onComplete:Dynamic):Void
	{        
		//Fix opening same file
		if (Utils.os == Utils.WINDOWS) 
		{
			var ereg:EReg = ~/[a-z]:\\/i;
			
			if (ereg.match(path)) 
			{
				path = path.substr(0, 3).toLowerCase() + path.substr(3);
			}
		}
		
		//path = js.Node.require('path').relative(js.Node.process.cwd(), path);
		path = StringTools.replace(path, "\\", js.Node.path.sep); 
		
		if (isAlreadyOpened(path, show))
		{
			if (onComplete != null) 
			{
				onComplete();
			}
            
			return;
		}
		
		openFile(path, function (code:String):Void 
		{
			if (isAlreadyOpened(path, show))
			{
				if (onComplete != null) 
				{
					onComplete();
				}
                
				return;
			}
			
			if (code != null)
			{
				var mode:String = getMode(path);
				var name:String = js.Node.path.basename(path);
				
				var doc = new CodeMirror.Doc(code, mode);
				
				createNewTab(name, path, doc);
				
                if (show)
                {
                	selectDoc(path);    
                }
				
				checkTabsCount();
				
				if (onComplete != null) 
				{
					onComplete();
				}
			}
			else 
			{
				trace("tab-manager: can't load file " + path);
			}
		}
		);
	}
	
	public static function createFileInNewTab(?pathToFile:String):Void
	{
		var path:String = pathToFile;
		
		if (path == null) 
		{
			FileDialog.saveFile(function (_selectedPath:String)
			{			
				//var path:String = convertPathToUnixFormat(value);
		
				//if (isAlreadyOpened(path))
				//{
					//return;
				//}
				
				createNewFile(_selectedPath);
			}
			);
		}
		else 
		{
			createNewFile(path);
		}
	}
	
	private static function createNewFile(path:String):Void
	{
		var name:String = js.Node.path.basename(path);
		var mode:String = getMode(name);
		
		var code:String = "";
		
		var extname:String = js.Node.path.extname(name);
		
		switch (extname) 
		{
			case ".hx":
				path = path.substr(0, path.length - name.length) + name.substr(0, 1).toUpperCase() + name.substr(1); // + Utils.capitalize(name)
			
				var options:NodeFsFileOptions = { };
				options.encoding = NodeC.UTF8;
				
				var pathToTemplate:String = Node.path.join("core", "templates", "New.hx");
				var templateCode:String = Node.fs.readFileSync(pathToTemplate, options);
				
				code = Mustache.render(templateCode, { name: js.Node.path.basename(name, extname), pack:"", author:"" } );
			case ".hxml":
				var options:NodeFsFileOptions = { };
				options.encoding = NodeC.UTF8;
				
				var pathToTemplate:String = Node.path.join("core", "templates", "build.hxml");
				var templateCode:String = Node.fs.readFileSync(pathToTemplate, options);
				
				code = templateCode;
			default:
				
		}
		
		var doc = new CodeMirror.Doc(code, mode);
		
		createNewTab(name, path, doc, true);
		selectDoc(path);
		
		checkTabsCount();
		
		FileTree.load();
	}
	
	private static function checkTabsCount():Void
	{			
		if (Browser.document.getElementById("editor").style.display == "none" && tabMap.getTabs().length > 0)
		{
			new JQuery("#editor").show(0);
			
			WelcomeScreen.hide();
			
			Editor.editor.refresh();
			
			Editor.resize();
			//Main.updateMenu();
		}
	}
	
	public static function closeAll():Void
	{
		for (key in tabMap.keys()) 
		{
			closeTab(key, false);
		}
	}
        
	public static function closeOthers(path:String):Void
	{		
		for (key in tabMap.keys()) 
		{
			if (key != path) 
			{
				closeTab(key, false);
			}
		}
		
		if (tabMap.getTabs().length == 1)
		{
			showNextTab();
		}
	}
	
	public static function closeTab(path:String, ?switchToTab:Bool = true):Void
	{
		Editor.saveFoldedRegions();
		
		if (isChanged(path)) 
		{
			Alertify.confirm(LocaleWatcher.getStringSync("File ") + path +  LocaleWatcher.getStringSync(" was changed. Save it?"), function (e)
			{
				if (e)
				{
					saveDoc(path);
				}
				
				removeTab(path, switchToTab);
			}
			);
		}
		else 
		{
			removeTab(path, switchToTab);
		}
		
		Editor.resize();
	}
	
	static function removeTab(path:String, ?switchToTab:Bool)
	{
		var tab = tabMap.get(path);
		tabMap.remove(path);
		
		tab.remove();
		
		selectedPath = null;
		
		if (tabMap.getTabs().length > 0)
		{
			if (switchToTab)
			{
				showPreviousTab();
			}
		}
		else 
		{
			new JQuery("#editor").hide(0);
			
			if (ProjectAccess.path != null) 
			{
				WelcomeScreen.hide();
			}
			else 
			{
				WelcomeScreen.show();
			}
			
            OutlinePanel.clearFields();
            OutlinePanel.update();
		}
		
		if (ProjectAccess.path != null) 
		{
// 			var pathToDocument:String = Node.path.relative(ProjectAccess.path, path);
			
			var selectedFile = ProjectAccess.getFileByPath(path);
			
			ProjectAccess.currentProject.files.remove(selectedFile);
		}
	}
	
	public static function showPreviousTab() 
	{
		var index = selectedIndex - 1;
		var tabArray = tabMap.getTabs();
		
		if (index < 0) 
		{
			index = tabArray.length - 1;
		}
		
		selectDoc(tabArray[index].path);
	}
	
	public static function showNextTab() 
	{
		var index = selectedIndex + 1;
		var tabArray = tabMap.getTabs();
		
		if (index > tabArray.length - 1) 
		{
			index = 0;
		}
		
		selectDoc(tabArray[index].path);
	}
	
	public static function closeActiveTab():Void
	{
		closeTab(selectedPath);
	}

	private static function isAlreadyOpened(path:String, ?show:Bool = true):Bool
	{
		var opened:Bool = tabMap.exists(path);
		
		if (opened && show) 
		{
			selectDoc(path);
		}
		
		return opened;
	}
	
	private static function getMode(path:String):String
	{
		var mode:String = null;
				
		switch (js.Node.path.extname(path)) 
		{
			case ".hx":
					mode = "haxe";
			case ".hxml":
					mode = "hxml";
			case ".js":
					mode = "javascript";
			case ".css":
					mode = "css";
            case ".json":
                	mode = "application/ld+json";
			case ".xml":
					mode = "xml";
			case ".html":
					mode = "text/html";
			case ".md":
					mode = "markdown";
			case ".sh", ".bat":
					mode = "shell";
			case ".ml":
					mode = "ocaml";
			case ".yml":
					mode = "yaml";
			default:
					
		}
		
		return mode;
	}
	
	public static function selectDoc(path:String):Void
	{
		var found = false;

		var keys = tabMap.keys();
		for (i in 0...keys.length) 
		{
			if (keys[i] == path) 
			{
				tabMap.get(keys[i]).getElement().className = "selected";
				selectedIndex = i;
				found = true;
			}
			else 
			{
				tabMap.get(keys[i]).getElement().className = "";
			}
		}
		
		var cm = Editor.editor;

		if (found)
		{
			var project = ProjectAccess.currentProject;

			if (selectedPath != null && project != null)
			{
				Editor.saveFoldedRegions();
				cm.refresh();
			}
			
			selectedPath = path;
			
			if (ProjectAccess.path != null) 
			{
				project.activeFile = Node.path.relative(ProjectAccess.path, selectedPath);
			}

			var tab = tabMap.get(selectedPath);
			var doc = tab.doc;

			Editor.editor.swapDoc(doc);

			HaxeLint.updateLinting();

			var completionActive = Editor.editor.state.completionActive;

			if (completionActive != null && completionActive.widget != null) 
			{
				completionActive.widget.close();
			}

			if (ProjectAccess.currentProject != null)
			{		
				var selectedFile = ProjectAccess.getFileByPath(selectedPath);
				
				if (selectedFile != null)
				{
					if (!tab.loaded)
					{
						var foldedRegions = selectedFile.foldedRegions;

						if (foldedRegions != null)
						{
							for (pos in foldedRegions)
							{
								cm.foldCode(pos, null, "fold");
							}
						}

						if (selectedFile.activeLine != null)
						{
							var pos = {line: selectedFile.activeLine, ch: 0};

							doc.setCursor(pos);
							cm.centerOnLine(pos.line);
						}

						tab.loaded = true;
					}
					
					if (selectedFile.useTabs != null && selectedFile.indentSize != null)
					{
						loadIndentationSettings(cm, selectedFile);
					}
					else
					{
						Editor.saveIndentationSettings(selectedFile);
					}
						
					updateIndentationSettings(selectedFile);
				}
				else
				{
					trace("can't load folded regions for active document");
				}
			}

			cm.focus();		
			Browser.document.getElementById("status-file").textContent = "-" + Std.string(doc.lineCount()) + " Lines";
		}
	}
	
	static function loadIndentationSettings(cm:CodeMirror, selectedFile:FileData)
	{
		cm.setOption("indentWithTabs", selectedFile.useTabs);
		
		if (selectedFile.useTabs)
		{
			cm.setOption("tabSize", selectedFile.indentSize);
		}
		else
		{
			cm.setOption("indentUnit", selectedFile.indentSize);
		}
	}
		
	static function updateIndentationSettings(selectedFile:FileData)
	{
		var indentType = Browser.document.getElementById("indent-type");

		if (selectedFile.useTabs)
		{
			indentType.textContent = "Tab Size:";
		}
		else
		{
			indentType.textContent = "Spaces:";
		}
		
		var indentWidthInput = cast(Browser.document.getElementById("indent-width-input"), InputElement);
		indentWidthInput.value = Std.string(selectedFile.indentSize);
		
		var indentWidthLabel = cast(Browser.document.getElementById("indent-width-label"), DivElement);
		indentWidthLabel.textContent = Std.string(selectedFile.indentSize);
	}
		
	public static function getCurrentDocumentPath():String
	{
		return selectedPath;
	}
	
	public static function getCurrentDocument():CodeMirror.Doc
	{
        var doc:CodeMirror.Doc = null;
        
        if (selectedPath != null)
        {
            var tab = tabMap.get(selectedPath);

	    if (tab != null)
	    {
		doc = tab.doc;
	    }
        }
            
		return doc;
	}
	
	public static function saveDoc(path:String, ?onComplete:Dynamic):Void
	{
		if (isChanged(path)) 
		{
			var tab:Tab = tabMap.get(path);
			tab.save();
		}
		
		if (onComplete != null)
		{
			onComplete();
		}	
	}
	
	public static function isChanged(path:String):Bool
	{
		var tab:Tab = tabMap.get(path);
		
		//tab.doc.changeGeneration()
		return !tab.doc.isClean();
	}
	
	public static function saveActiveFile(?onComplete:Dynamic):Void
	{
		if (selectedPath != null) 
		{
			saveDoc(selectedPath, onComplete);
		}
        else
        {
            trace(selectedPath);
        }
	}
	
	public static function saveActiveFileAs():Void
	{		
		var tab = tabMap.get(selectedPath);
		
		FileDialog.saveFile(function (path:String):Void
		{
			tabMap.remove(selectedPath);
			tab.path = path;
			selectedPath = path;
			tabMap.add(tab);
			saveDoc(selectedPath);
		}
		, tab.name);
	}
	
	public static function saveAll(?onComplete:Dynamic):Void
	{		
		for (key in tabMap.keys()) 
		{
			saveDoc(key);
		}
		
		if (onComplete != null)
		{
			onComplete();
		}
	}
}
