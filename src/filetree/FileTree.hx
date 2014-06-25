package filetree;
import core.RunProject;
import haxe.ds.StringMap.StringMap;
import jQuery.JQuery;
import jQuery.JQueryStatic;
import js.Browser;
import js.html.AnchorElement;
import js.html.DivElement;
import js.html.LIElement;
import js.html.MouseEvent;
import js.html.UListElement;
import js.Node;
import js.node.Mv;
import js.Node.NodeStat;
import js.node.Remove;
import js.node.Walkdir;
import js.node.Watchr;
import nodejs.webkit.Shell;
import parser.ClasspathWalker;
import projectaccess.ProjectAccess;
import tabmanager.TabManager;
import watchers.LocaleWatcher;
import watchers.SettingsWatcher;
import watchers.Watcher;
import core.OutlinePanel.TreeItem;

/**
 * ...
 * @author AS3Boyan
 */

class FileTree
{
	var lastProjectName:String;
	var lastProjectPath:String;
	
	var contextMenu:Dynamic;
	var contextMenuCommandsMap:StringMap<Dynamic>;
	var watcher:Dynamic;
	
	static var instance:FileTree;
	
	public function new() 
	{
		
	}	
	
	public static function get()
	{
		if (instance == null)
		{
			instance = new FileTree();
		}
			
		return instance;
	}
	
	public function init():Void
	{		
		contextMenuCommandsMap = new StringMap();
		
		appendToContextMenu("New File...", function (selectedItem):Void 
		{
			var path:String;
			
			if (selectedItem.value.type == 'folder') 
			{
				path = selectedItem.value.path;
			}
			else
			{
				path = Node.path.dirname(selectedItem.value.path);
			}
			
			Alertify.prompt(LocaleWatcher.getStringSync("Filename:"), function (e:Bool, str:String)
			{
				if (e) 
				{
					var pathToFile:String = js.Node.path.join(path, str);
					var tabManager = TabManager.get();
					tabManager.createFileInNewTab(pathToFile);
					untyped new JQuery('#filetree').jqxTree('addTo', createFileItem(pathToFile) , selectedItem.element);
					attachContextMenu();
				}
			}, "New.hx");
		});
		
		appendToContextMenu("New Folder...", function (selectedItem):Void 
		{
			var path:String;
			
			if (selectedItem.value.type == 'folder') 
			{
				path = selectedItem.value.path;
			}
			else
			{
				path = Node.path.dirname(selectedItem.value.path);
			}
			
			Alertify.prompt("Folder name:", function (e, str:String)
			{
				if (e) 
				{
					var dirname:String = str;
			
					if (dirname != null)
					{
						var pathToFolder = Node.path.join(path, dirname);
						
						Node.fs.mkdir(pathToFolder, function (error:NodeErr):Void
						{
							if (error == null) 
							{
								untyped new JQuery('#filetree').jqxTree('addTo', { label: str, value: {type: "folder", path: pathToFolder}, icon: "includes/images/folder.png" }, selectedItem.element);
								attachContextMenu();
							}
							else 
							{
								Alertify.error(error);
							}
						});
					}
				}
			}, "New Folder");
		});
		
		appendToContextMenu("Open Item", function (selectedItem):Void 
		{
			var tabManager = TabManager.get();
			
			if (selectedItem.value.type == 'file') 
			{
				tabManager.openFileInNewTab(selectedItem.value.path);
			}
			else
			{
				untyped new JQuery('#filetree').jqxTree('expandItem', selectedItem.element);
			}
		});
		
		appendToContextMenu("Open using OS", function (selectedItem):Void 
		{
			Shell.openItem(selectedItem.value.path);
		});
		
		appendToContextMenu("Show Item In Folder", function (selectedItem):Void 
		{
			Shell.showItemInFolder(selectedItem.value.path);
		});
		
		appendToContextMenu("Rename...", function (selectedItem):Void 
		{			
			var path = selectedItem.value.path;
			
			Alertify.prompt(LocaleWatcher.getStringSync("Please enter new name for ") + path, function (e, str):Void 
			{
				if (e) 
				{
					var currentDirectory:String = Node.path.dirname(path);
					Mv.move(path, Node.path.join(currentDirectory, str), function (error):Void 
					{
						if (error == null) 
						{
							load();
						}
						else 
						{
							Alertify.error(error);
						}
					}
					);
				}
			}
			, Node.path.basename(path));
		}
		);
		
		appendToContextMenu("Delete...", function (selectedItem):Void 
		{
			var path = selectedItem.value.path;
			
			switch (selectedItem.value.type) 
			{
				case 'file':
					Alertify.confirm(LocaleWatcher.getStringSync("Remove file ") + path + " ?", function (e):Void 
					{
						if (e) 
						{
							Node.fs.unlink(path, function (error:NodeErr):Void 
							{
								if (error == null) 
								{
									untyped new JQuery('#filetree').jqxTree('removeItem', selectedItem.element);
									attachContextMenu();
								}
								else
								{
									Alertify.error(error);
								}
							}
							);
						}
					}
					);
				case 'folder':
					Alertify.confirm(LocaleWatcher.getStringSync("Remove folder ") + path + " ?", function (e):Void 
					{
						if (e) 
						{
							Remove.removeAsync(path, {}, function (error):Void 
							{
								if (error == null) 
								{
									untyped new JQuery('#filetree').jqxTree('removeItem', selectedItem.element);
									attachContextMenu();
								}
								else 
								{
									Alertify.error(error);
								}
							}
							);
						}
					}
					);
				default:
					
			}
		}
		);
		
		appendToContextMenu("Toggle Hidden Items Visibility", function (selectedItem):Void 
		{
			if (ProjectAccess.path != null) 
			{
				ProjectAccess.currentProject.showHiddenItems = !ProjectAccess.currentProject.showHiddenItems;
				Alertify.success(LocaleWatcher.getStringSync("Hidden Items Visible: ") + Std.string(ProjectAccess.currentProject.showHiddenItems));
				
				if (!ProjectAccess.currentProject.showHiddenItems) 
				{
					Alertify.log("Hidden Items: \n" + Std.string(ProjectAccess.currentProject.hiddenItems));
				}
			}
			
			load();
		}
		);
		
		appendToContextMenu("Toggle Item Visibility", function (selectedItem):Void 
		{
			if (ProjectAccess.path != null) 
			{
				var relativePath:String = Node.path.relative(ProjectAccess.path, selectedItem.value.path);
				
				if (ProjectAccess.currentProject.hiddenItems.indexOf(relativePath) == -1) 
				{
					ProjectAccess.currentProject.hiddenItems.push(relativePath);
					untyped new JQuery('#filetree').jqxTree('removeItem', selectedItem.element);
					attachContextMenu();
				}
				else 
				{
					ProjectAccess.currentProject.hiddenItems.remove(relativePath);
					load();
				}
			}
			else 
			{
				untyped new JQuery('#filetree').jqxTree('removeItem', selectedItem.element);
			}
		}
		);
		
		appendToContextMenu("Set As Compile Main", function (selectedItem):Void
		{
			var path:String = selectedItem.value.path;
			
			if (RunProject.setHxmlAsProjectBuildFile(path))
			{
				
			}
		}
		);
		
		contextMenu = untyped new JQuery("#jqxMenu").jqxMenu({ autoOpenPopup: false, mode: 'popup' });
		
		attachContextMenu();
		
		// disable the default browser's context menu.
		new JQuery(Browser.document).on('contextmenu', function (e) {
			if (new JQuery(e.target).parents('.jqx-tree').length > 0) {
				return false;
			}
			return true;
		});
		
		new JQuery("#jqxMenu").on('itemclick', function (event) 
		{
			var item = JQueryStatic.trim(new JQuery(event.args).text());
			contextMenuCommandsMap.get(item)();
		}
		);
		
		new JQuery('#filetree').dblclick(function (event):Void 
		{
			var item = untyped new JQuery('#filetree').jqxTree('getSelectedItem');
			
			if (item.value.type == 'file') 
			{
				var tabManager = TabManager.get();
				tabManager.openFileInNewTab(item.value.path);
			}
		}
		);
		
		new JQuery('#filetree').bind('dragEnd', function (event) {
                var target = event.args.originalEvent.target;
                var targetParents = new JQuery(target).parents();
                var item:Dynamic = null;
                JQueryStatic.each(untyped new JQuery("#filetree").jqxTree('getItems'), function (index, value) {
                    if (value.label == event.args.label && value.value == event.args.value) {
                        item = value;
                        untyped __js__('return false');
                    }
                });
                if (item) {
                    var parents = new JQuery(item.element).parents('li');
                    var path = "";
					
                    JQueryStatic.each(parents, function (index, value) {
                        var item = untyped new JQuery("#filetree").jqxTree('getItem', value);
						
						if (item.level > 0) 
						{
							 path = item.label + "/" + path;
						}
                    });
					
					var topDirectory = untyped new JQuery("#filetree").jqxTree('getItems')[0].value.path;
					var selectedItem = untyped new JQuery("#filetree").jqxTree('getSelectedItem');
					
					var previousPath = selectedItem.value.path;
                    var newPath = Node.path.join(topDirectory, path, selectedItem.label);
					
					Mv.move(previousPath, newPath, function (error:NodeErr):Void 
					{
						if (error == null) 
						{
							Alertify.success("File were successfully moved to " + newPath);
							selectedItem.value.path = newPath;
							attachContextMenu();
						}
						else 
						{
							Alertify.error("Can't move file from " + previousPath + " to " + newPath);
							load();
						}
					}
					);
                }
            });
	}
	
	static function updateProjectMainHxml()
	{
		var noproject = (ProjectAccess.path == null || ProjectAccess.currentProject.main == null);
		var main = null;
		
		if (!noproject)
		{
			main = Node.path.resolve(ProjectAccess.path, ProjectAccess.currentProject.main);
		}
		
		var items:Array<Dynamic> = untyped new JQuery('#filetree').jqxTree('getItems');
				
		for (item in items)
		{
			var li = cast(item.element, LIElement);

			if (!noproject && item.value.path == main)
			{
				li.classList.add("mainHxml");
			}
			else
			{
				li.classList.remove("mainHxml");
			}

		}
	}

	function appendToContextMenu(name:String, onClick:Dynamic)
	{
		var li:LIElement = Browser.document.createLIElement();
		li.textContent = name;
		new JQuery("#filetreemenu").append(li);
		
		contextMenuCommandsMap.set(name, function ():Void 
		{
			var selectedItem = untyped new JQuery('#filetree').jqxTree('getSelectedItem');
			if (selectedItem != null) 
			{
				onClick(selectedItem);
			}
		});
	}
	
	function attachContextMenu() 
	{
		// open the context menu when the user presses the mouse right button.
		new JQuery("#filetree li").on('mousedown', function (event) {			
			var target = new JQuery(event.target).parents('li:first')[0];
			var rightClick = isRightClick(event);
			if (rightClick && target != null) 
			{
				untyped new JQuery("#filetree").jqxTree('selectItem', target);
				var scrollTop = new JQuery(Browser.window).scrollTop();
				var scrollLeft = new JQuery(Browser.window).scrollLeft();
				contextMenu.jqxMenu('open', Std.parseInt(event.clientX) + 5 + scrollLeft, Std.parseInt(event.clientY) + 5 + scrollTop);
				return false;
			}
			else 
			{
				return true;
			}
		});
	}
	
	function isRightClick(event:Dynamic):Bool
	{
		var rightclick = null;
		if (!event) var event = Browser.window.event;
		if (event.which) rightclick = (event.which == 3);
		else if (event.button) rightclick = (event.button == 2);
		return rightclick;
	}
	
	public function load(?projectName:String, ?path:String):Void
	{        
		if (projectName == null)
		{
			projectName = lastProjectName;
		}
		
		if (path == null)
		{
			path = lastProjectPath;
		}
            
        var filetree:Dynamic = untyped new JQuery("#filetree");
        
        filetree.on('expand', function (event) 
        {
            var label = filetree.jqxTree('getItem', event.args.element).label;
            var element2 = new JQuery(event.args.element);
            var loader = false;
            var loaderItem:Dynamic = null;
            var children = element2.find('ul:first').children();
            jQuery.JQueryStatic.each(children, function (index, value) 
			{
                var item = filetree.jqxTree('getItem', value);
                if (item != null && item.label == "Loading...") 
                {
                    loaderItem = item;
                    loader = true;
                    untyped __js__("return false");
                };
            });
           	
            if (loader) 
            {
                var pathToItem:String = loaderItem.value;
                
            	var items:Array<TreeItem> = readDir2(pathToItem);
                
//                 for (i in 0...items.length)
//                 {
//                 	 items[i] = prepareForLazyLoading(items[i]);
//                 }
                
                filetree.jqxTree('addTo', items, element2[0]);
            	filetree.jqxTree('removeItem', loaderItem.element);
            	attachContextMenu();
            }
        });
		
		readDirItems(path, function (source:TreeItem):Void 
		{            
//             var source2:TreeItem = prepareForLazyLoading(source);
//             source2.expanded = true;
            
            untyped new JQuery('#filetree').jqxTree( { source: [source] } );
            attachContextMenu();
            			
			//var items = untyped new JQuery("#filetree").jqxTree('getItems');
			//trace(items);
		}, true);
		
		if (watcher != null) 
		{
			watcher.close();
			watcher = null;
		}
		
		var classpathWalker = ClasspathWalker.get();
			
		var config:Config = {
			path: path,
			listener:
				function (changeType, filePath, fileCurrentStat, filePreviousStat):Void 
				{
					trace(changeType);
					trace(filePath);
					trace(fileCurrentStat);
					trace(filePreviousStat);
					
					switch (changeType) 
					{
						case 'create':
							trace(changeType);
							trace(filePath);
							//load();
							
							Node.fs.stat(filePath, function (error:NodeErr, stat:NodeStat):Void 
							{
								if (error == null) 
								{
									if (stat.isFile()) 
									{
										if (changeType == 'create') 
										{
											classpathWalker.addFile(filePath);
										}
										else
										{
											classpathWalker.removeFile(filePath);
										}
									}
									else if(stat.isDirectory()) 
									{
										trace(changeType);
										trace(filePath);
										//ClasspathWalker.parseProjectArguments();
									}
								}
								else 
								{
									trace(error);
								}
							}
							);
                        case 'delete':
                            if (Node.path.extname(filePath) != "")
                            {
                            	classpathWalker.removeFile(filePath);
                    		}
						default:
							
					}
				}
		};
		
		config.interval = 3000;
		
		watcher = Watchr.watch(config);
		
		lastProjectName = projectName;
		lastProjectPath = path;
		
		updateProjectMainHxml();
	}
	
	static function readDirItems(path:String, ?onComplete:Dynamic->Void, ?root:Bool = false)
	{
        var source:Dynamic = createFolderItem(path, []);
        source.expanded = true;
        
        source.items = readDir2(path);
        
        onComplete(source);
	}
	
    static function readDir2(path:String):Array<TreeItem>
	{
        var items:Array<TreeItem> = [];
        
        var pathToFolders:Array<String> = [];
        var pathToFiles:Array<String> = [];
        
        var fullPath:String;
        var stat:NodeStat;
        
        for (pathToItem in js.Node.fs.readdirSync(path))
        {      
            if (!SettingsWatcher.isItemInIgnoreList(pathToItem) && !ProjectAccess.isItemInIgnoreList(pathToItem))
            {
                fullPath = Node.path.join(path, pathToItem);
                stat = Node.fs.statSync(fullPath);

                if (stat.isDirectory())
                {
                    pathToFolders.push(fullPath);
                }
                else if(stat.isFile())
                {
                    pathToFiles.push(fullPath);
                }
            }
        }
        
        var type:String = null;
        type = "folder";
        
        var item:TreeItem = null;
        
        for (pathToItem in pathToFolders)
        {
             item = createFolderItem(pathToItem, []);
        	 item.items = [];
        	 item.items.push({label:"Loading...", value: pathToItem});
             items.push(item);
		}
    	
    	type = "file";
    
    	for (pathToItem in pathToFiles)
        {
             item = createFileItem(pathToItem);
             items.push(item);
		}

		return items;
	}
    
	static function createFileItem(path:String):TreeItem
	{
		var basename:String = Node.path.basename(path);
		var extname:String = Node.path.extname(basename);
		
		var data:TreeItem = { label: basename, value: {path: path, type: "file"} };
		
// 		switch (extname) 
// 		{
// 			case ".pdf":
// 				data.icon = "includes/images/page_white_acrobat.png";
// 			case ".swf":
// 				data.icon = "includes/images/page_white_flash.png";
// 			case ".jpg", ".jpeg", ".png", ".gif", ".tga":
// 				data.icon = "includes/images/photo.png";
// 			case ".html":
// 				data.icon = "includes/images/html.png";
// 			default:
				
// 		}
		
		return data;
	}
    
    static function createFolderItem(path:String, items:Array<TreeItem>):TreeItem
    {
    	return {label:Node.path.basename(path), items: items, value: {path: path, type: "folder"}}; //icon: "includes/images/folder.png"
    }
}
