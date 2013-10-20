(function () { "use strict";
function $extend(from, fields) {
	function inherit() {}; inherit.prototype = from; var proto = new inherit();
	for (var name in fields) proto[name] = fields[name];
	if( fields.toString !== Object.prototype.toString ) proto.toString = fields.toString;
	return proto;
}
var EReg = function(r,opt) {
	opt = opt.split("u").join("");
	this.r = new RegExp(r,opt);
};
EReg.__name__ = true;
EReg.prototype = {
	replace: function(s,by) {
		return s.replace(this.r,by);
	}
	,__class__: EReg
}
var FileTree = function() { }
FileTree.__name__ = true;
FileTree.init = function() {
	var tree = js.Boot.__cast(js.Browser.document.getElementById("tree") , HTMLUListElement);
	var rootTreeElement = FileTree.createDirectoryElement("HIDE");
	tree.appendChild(rootTreeElement);
	FileTree.readDir("../",rootTreeElement);
}
FileTree.createDirectoryElement = function(text) {
	var directoryElement = js.Browser.document.createElement("li");
	var a = js.Browser.document.createElement("a");
	a.className = "tree-toggler nav-header";
	a.href = "#";
	var span = js.Browser.document.createElement("span");
	span.className = "glyphicon glyphicon-folder-open";
	a.appendChild(span);
	span = js.Browser.document.createElement("span");
	span.textContent = text;
	span.style.marginLeft = "5px";
	a.appendChild(span);
	a.onclick = function(e) {
		new $(directoryElement).children("ul.tree").toggle(300);
		Main.resize();
	};
	directoryElement.appendChild(a);
	var ul = js.Browser.document.createElement("ul");
	ul.className = "nav nav-list tree";
	directoryElement.appendChild(ul);
	return directoryElement;
}
FileTree.readDir = function(path,topElement) {
	Utils.fs.readdir(path,function(error,files) {
		var foldersCount = 0;
		var _g = 0;
		while(_g < files.length) {
			var file = [files[_g]];
			++_g;
			var filePath = [Utils.path.join(path,file[0])];
			Utils.fs.stat(filePath[0],(function(filePath,file) {
				return function(error1,stat) {
					if(stat.isFile()) {
						var li = js.Browser.document.createElement("li");
						var a = js.Browser.document.createElement("a");
						a.href = "#";
						a.textContent = file[0];
						a.title = filePath[0];
						a.onclick = (function(filePath) {
							return function(e) {
								core.TabsManager.openFileInNewTab(filePath[0]);
							};
						})(filePath);
						if(StringTools.endsWith(file[0],".hx")) a.style.fontWeight = "bold"; else if(StringTools.endsWith(file[0],".hxml")) {
							a.style.fontWeight = "bold";
							a.style.color = "gray";
						} else a.style.color = "gray";
						li.appendChild(a);
						var ul = js.Boot.__cast(topElement.getElementsByTagName("ul")[0] , HTMLUListElement);
						ul.appendChild(li);
					} else if(!StringTools.startsWith(file[0],".")) {
						var ul = js.Boot.__cast(topElement.getElementsByTagName("ul")[0] , HTMLUListElement);
						var directoryElement = FileTree.createDirectoryElement(file[0]);
						directoryElement.onclick = (function(filePath) {
							return function(e) {
								if(directoryElement.getElementsByTagName("ul")[0].childNodes.length == 0) {
									FileTree.readDir(filePath[0],directoryElement);
									e.stopPropagation();
									e.preventDefault();
									directoryElement.onclick = null;
								}
							};
						})(filePath);
						ul.appendChild(directoryElement);
						ul.insertBefore(directoryElement,ul.childNodes[foldersCount]);
						foldersCount++;
					}
				};
			})(filePath,file));
		}
		new $(topElement).children("ul.tree").show(300);
	});
}
var HxOverrides = function() { }
HxOverrides.__name__ = true;
HxOverrides.cca = function(s,index) {
	var x = s.charCodeAt(index);
	if(x != x) return undefined;
	return x;
}
HxOverrides.substr = function(s,pos,len) {
	if(pos != null && pos != 0 && len != null && len < 0) return "";
	if(len == null) len = s.length;
	if(pos < 0) {
		pos = s.length + pos;
		if(pos < 0) pos = 0;
	} else if(len < 0) len = s.length + len - pos;
	return s.substr(pos,len);
}
HxOverrides.iter = function(a) {
	return { cur : 0, arr : a, hasNext : function() {
		return this.cur < this.arr.length;
	}, next : function() {
		return this.arr[this.cur++];
	}};
}
var Lambda = function() { }
Lambda.__name__ = true;
Lambda.indexOf = function(it,v) {
	var i = 0;
	var $it0 = $iterator(it)();
	while( $it0.hasNext() ) {
		var v2 = $it0.next();
		if(v == v2) return i;
		i++;
	}
	return -1;
}
var Layout = function() { }
Layout.__name__ = true;
Layout.init = function() {
	Layout.layout = new $("#panel").layout({ center__paneSelector : ".outer-center", west__paneSelector : ".outer-west", west__size : 250, spacing_open : 8, spacing_closed : 12, center__childOptions : { center__paneSelector : ".middle-center", south__paneSelector : ".middle-south", south__size : 100, spacing_open : 8, spacing_closed : 12}, animatePaneSizing : true, stateManagement__enabled : true});
	Layout.initPreserveLayout();
}
Layout.initPreserveLayout = function() {
	var localStorage = js.Browser.getLocalStorage();
	Utils.window.on("close",function(e) {
		var stateString = JSON.stringify(Layout.layout.readState());
		localStorage.setItem("state",stateString);
	});
	var state = localStorage.getItem("state");
	if(state != null) Layout.layout.loadState(JSON.parse(state),true);
}
var Main = function() { }
Main.__name__ = true;
Main.main = function() {
	new $(function() {
		Main.init();
	});
}
Main.close = function() {
	Sys.exit(0);
}
Main.init = function() {
	js.Browser.window.onresize = function(e) {
		Main.resize();
	};
	core.TabsManager.init();
	Main.initDragAndDropListeners();
	Main.initHotKeys();
	Main.initMouseZoom();
	Main.session = new Session();
	Main.settings = new haxe.ds.StringMap();
	core.FileDialog.init();
	FileTree.init();
	Layout.init();
	Main.initCorePlugin();
	PreserveWindowState.init();
}
Main.initMouseZoom = function() {
	js.Browser.document.onmousewheel = function(e) {
		if(e.altKey) {
			if(e.wheelDeltaY < 0) {
				var font_size = Std.parseInt(new $(".CodeMirror").css("font-size"));
				font_size--;
				Main.setFontSize(font_size);
				e.preventDefault();
				e.stopPropagation();
			} else if(e.wheelDeltaY > 0) {
				var font_size = Std.parseInt(new $(".CodeMirror").css("font-size"));
				font_size++;
				Main.setFontSize(font_size);
				e.preventDefault();
				e.stopPropagation();
			}
		}
	};
}
Main.initHotKeys = function() {
	js.Browser.window.onkeyup = function(e) {
		if(e.ctrlKey) {
			if(!e.shiftKey) switch(e.keyCode) {
			case 87:
				core.TabsManager.closeActiveTab();
				break;
			case 48:
				new $(".CodeMirror").css("font-size","11pt");
				new $(".CodeMirror-hint").css("font-size","11pt");
				new $(".CodeMirror-hints").css("font-size",Std.string(9.9) + "pt");
				break;
			case 189:
				var font_size = Std.parseInt(new $(".CodeMirror").css("font-size"));
				font_size--;
				Main.setFontSize(font_size);
				break;
			case 187:
				var font_size = Std.parseInt(new $(".CodeMirror").css("font-size"));
				font_size++;
				Main.setFontSize(font_size);
				break;
			case 9:
				core.TabsManager.showNextTab();
				e.preventDefault();
				e.stopPropagation();
				break;
			case 79:
				core.FileAccess.openFile();
				break;
			case 83:
				core.FileAccess.saveActiveFile();
				break;
			default:
			} else switch(e.keyCode) {
			case 48:
				Utils.window.zoomLevel = 0;
				break;
			case 189:
				Utils.zoomOut();
				break;
			case 187:
				Utils.zoomIn();
				break;
			case 9:
				core.TabsManager.showPreviousTab();
				e.preventDefault();
				e.stopPropagation();
				break;
			case 79:
				core.ProjectAccess.openProject();
				break;
			case 83:
				break;
			case 84:
				core.TabsManager.applyRandomTheme();
				break;
			default:
			}
		} else if(e.keyCode == 13 && e.shiftKey && e.altKey) Utils.toggleFullscreen();
	};
}
Main.initDragAndDropListeners = function() {
	js.Browser.window.ondragover = function(e) {
		e.preventDefault();
		e.stopPropagation();
		return false;
	};
	js.Browser.window.ondrop = function(e) {
		e.preventDefault();
		e.stopPropagation();
		var _g1 = 0, _g = e.dataTransfer.files.length;
		while(_g1 < _g) {
			var i = _g1++;
			core.TabsManager.openFileInNewTab(e.dataTransfer.files[i].path);
		}
		return false;
	};
}
Main.resize = function() {
}
Main.setFontSize = function(font_size) {
	new $(".CodeMirror").css("font-size",Std.string(font_size) + "px");
	new $(".CodeMirror-hint").css("font-size",Std.string(font_size - 2) + "px");
	new $(".CodeMirror-hints").css("font-size",Std.string(font_size - 2) + "px");
}
Main.initCorePlugin = function() {
	Main.initMenu();
}
Main.initMenu = function() {
	Main.menus = new haxe.ds.StringMap();
	Main.menus.set("file",new ui.menu.FileMenu());
	Main.menus.set("edit",new ui.menu.EditMenu());
	Main.menus.set("view",new ui.menu.ViewMenu());
	Main.menus.set("source",new ui.menu.SourceMenu());
	Main.menus.set("run",new ui.menu.RunMenu());
	Main.menus.set("help",new ui.menu.HelpMenu());
	haxe.Timer.delay(Main.updateMenu,100);
}
Main.updateMenu = function() {
	var fileMenuDisabledItems = new Array();
	if(core.TabsManager.docs.length == 0) {
		fileMenuDisabledItems.push("Close File");
		fileMenuDisabledItems.push("Save");
		fileMenuDisabledItems.push("Save as...");
		fileMenuDisabledItems.push("Save all");
		Main.menus.get("edit").setMenuEnabled(false);
	} else Main.menus.get("edit").setMenuEnabled(true);
	if(Main.session.current_project_xml == "") {
		fileMenuDisabledItems.push("Close Project...");
		fileMenuDisabledItems.push("Project Properties");
		Main.menus.get("run").setMenuEnabled(false);
	} else Main.menus.get("run").setMenuEnabled(true);
	Main.menus.get("file").setDisabled(fileMenuDisabledItems);
}
var IMap = function() { }
IMap.__name__ = true;
var PreserveWindowState = function() { }
PreserveWindowState.__name__ = true;
PreserveWindowState.init = function() {
	PreserveWindowState.initWindowState();
	Utils.window.on("maximize",function() {
		PreserveWindowState.isMaximizationEvent = true;
		PreserveWindowState.currWinMode = "maximized";
	});
	Utils.window.on("unmaximize",function() {
		PreserveWindowState.currWinMode = "normal";
		PreserveWindowState.restoreWindowState();
	});
	Utils.window.on("minimize",function() {
		PreserveWindowState.currWinMode = "minimized";
	});
	Utils.window.on("restore",function() {
		PreserveWindowState.currWinMode = "normal";
	});
	Utils.window.window.addEventListener("resize",function(e) {
		if(PreserveWindowState.resizeTimeout != null) PreserveWindowState.resizeTimeout.stop();
		PreserveWindowState.resizeTimeout = new haxe.Timer(500);
		PreserveWindowState.resizeTimeout.run = function() {
			if(PreserveWindowState.isMaximizationEvent) PreserveWindowState.isMaximizationEvent = false; else if(PreserveWindowState.currWinMode == "maximized") PreserveWindowState.currWinMode = "normal";
			PreserveWindowState.resizeTimeout.stop();
			PreserveWindowState.dumpWindowState();
		};
	},false);
	Utils.window.on("close",function(e) {
		PreserveWindowState.saveWindowState();
		Utils.window.close(true);
	});
}
PreserveWindowState.initWindowState = function() {
	var windowState = js.Browser.getLocalStorage().getItem("windowState");
	if(windowState != null) PreserveWindowState.winState = JSON.parse(windowState);
	if(PreserveWindowState.winState != null) {
		PreserveWindowState.currWinMode = PreserveWindowState.winState.mode;
		if(PreserveWindowState.currWinMode == "maximized") Utils.window.maximize(); else PreserveWindowState.restoreWindowState();
	} else {
		PreserveWindowState.currWinMode = "normal";
		PreserveWindowState.dumpWindowState();
	}
	Utils.window.show();
}
PreserveWindowState.dumpWindowState = function() {
	if(PreserveWindowState.winState == null) PreserveWindowState.winState = { };
	if(PreserveWindowState.currWinMode == "maximized") PreserveWindowState.winState.mode = "maximized"; else PreserveWindowState.winState.mode = "normal";
	if(PreserveWindowState.currWinMode == "normal") {
		PreserveWindowState.winState.x = Utils.window.x;
		PreserveWindowState.winState.y = Utils.window.y;
		PreserveWindowState.winState.width = Utils.window.width;
		PreserveWindowState.winState.height = Utils.window.height;
	}
}
PreserveWindowState.restoreWindowState = function() {
	Utils.window.resizeTo(PreserveWindowState.winState.width,PreserveWindowState.winState.height);
	Utils.window.moveTo(PreserveWindowState.winState.x,PreserveWindowState.winState.y);
}
PreserveWindowState.saveWindowState = function() {
	PreserveWindowState.dumpWindowState();
	js.Browser.getLocalStorage().setItem("windowState",JSON.stringify(PreserveWindowState.winState));
}
var Session = function() {
	this.current_project_folder = "";
	this.current_project_xml_parameter = "";
	this.current_project_xml = "";
};
Session.__name__ = true;
Session.prototype = {
	__class__: Session
}
var Std = function() { }
Std.__name__ = true;
Std.string = function(s) {
	return js.Boot.__string_rec(s,"");
}
Std.parseInt = function(x) {
	var v = parseInt(x,10);
	if(v == 0 && (HxOverrides.cca(x,1) == 120 || HxOverrides.cca(x,1) == 88)) v = parseInt(x);
	if(isNaN(v)) return null;
	return v;
}
Std.random = function(x) {
	return x <= 0?0:Math.floor(Math.random() * x);
}
var StringTools = function() { }
StringTools.__name__ = true;
StringTools.startsWith = function(s,start) {
	return s.length >= start.length && HxOverrides.substr(s,0,start.length) == start;
}
StringTools.endsWith = function(s,end) {
	var elen = end.length;
	var slen = s.length;
	return slen >= elen && HxOverrides.substr(s,slen - elen,elen) == end;
}
var Sys = function() { }
Sys.__name__ = true;
Sys.exit = function(code) {
	js.Node.process.exit(code);
}
var js = {}
js.Node = function() { }
js.Node.__name__ = true;
var Utils = function() { }
Utils.__name__ = true;
Utils.getOS = function() {
	var os_type = null;
	var _g = Utils.os.type();
	switch(_g) {
	case "Windows_NT":
		os_type = 0;
		break;
	case "Linux":
		os_type = 1;
		break;
	default:
		os_type = 2;
	}
	return os_type;
}
Utils.toggleFullscreen = function() {
	Utils.window.toggleFullscreen();
}
Utils.zoomIn = function() {
	Utils.window.zoomLevel = Utils.window.zoomLevel + 1;
}
Utils.zoomOut = function() {
	Utils.window.zoomLevel = Utils.window.zoomLevel - 1;
}
Utils.capitalize = function(myString) {
	return HxOverrides.substr(myString,0,1) + HxOverrides.substr(myString,1,null);
}
Utils.system_openFile = function(filename,onLoaded) {
	Utils.fs.readFile(filename,"utf-8",function(error,data) {
		if(error != null) console.log(error);
		onLoaded(data);
	});
}
Utils.system_saveFile = function(filename,content) {
	Utils.fs.writeFile(filename,content,null,function(error) {
		if(error != null) console.log(error);
		console.log("SYSTEM: file saved " + filename);
	});
}
Utils.system_parse_project = function() {
	var exec_str = "";
	var filename = Main.session.current_project_xml;
	var projectFolder = filename.split(Utils.path.sep);
	projectFolder.pop();
	Main.session.current_project_folder = projectFolder.join(Utils.path.sep);
	if(Utils.getOS() == 0) exec_str = "cd /D " + Main.session.current_project_folder + " & openfl display -hxml flash";
	if(Utils.getOS() == 1) exec_str = "cd " + Main.session.current_project_folder + " ; openfl display -hxml flash";
	console.log(exec_str);
	Utils.exec(exec_str,function(error,stdout,stderr) {
		var the_error = false;
		if(stderr != "") the_error = true;
		if(the_error == true) {
			var notify = new ui.Notify();
			notify.type = "error";
			notify.content = "not a valid HaxeFlixel Project File (XML)";
			notify.show();
		}
		if(the_error == false) {
			var content_push = new Array();
			var content = stdout.split("\n");
			var i = 0;
			var _g1 = 0, _g = content.length;
			while(_g1 < _g) {
				var i1 = _g1++;
				var cur = content[i1];
				if(cur.indexOf("-lib") == 0) content_push.push(cur); else if(cur.indexOf("-cp") == 0) content_push.push(cur); else if(cur.indexOf("-main") == 0) content_push.push(cur); else if(cur.indexOf("-D") == 0) content_push.push(cur);
			}
			Main.session.current_project_xml_parameter = content_push.join(" ");
			console.log(Main.session.current_project_xml_parameter);
			new $(js.Browser.document).trigger("projectAccess_parseProject_complete");
		}
	});
}
var core = {}
core.FileAccess = function() { }
core.FileAccess.__name__ = true;
core.FileAccess.createNewFile = function() {
	core.TabsManager.createFileInNewTab();
}
core.FileAccess.openFile = function() {
	core.FileDialog.openFile(core.TabsManager.openFileInNewTab);
}
core.FileAccess.saveActiveFile = function() {
	console.log("save active file");
	var curDoc = core.TabsManager.curDoc;
	var curDoc_filepath = curDoc.path;
	var curDoc_val = curDoc.doc.cm.getValue();
	var historySize = curDoc.doc.historySize();
	if(curDoc_filepath != "" && historySize.undo == 0 && historySize.redo == 0) {
		console.log("no changes detected");
		return;
	}
	if(curDoc_filepath == "") core.FileDialog.saveFile(function(path) {
		Utils.system_saveFile(path,curDoc_val);
	},curDoc.name); else Utils.system_saveFile(curDoc_filepath,curDoc_val);
}
core.FileAccess.closeActiveFile = function() {
	core.TabsManager.closeActiveTab();
}
core.FileAccess.saveActiveFileAs = function() {
	var curDoc = core.TabsManager.curDoc;
	var curDoc_val = curDoc.doc.cm.getValue();
	core.FileDialog.saveFile(function(path) {
		Utils.system_saveFile(path,curDoc_val);
		curDoc.path = path;
	},curDoc.name);
}
core.FileAccess.saveAll = function() {
	var _g = 0, _g1 = core.TabsManager.docs;
	while(_g < _g1.length) {
		var doc = _g1[_g];
		++_g;
		if(doc != null) Utils.system_saveFile(doc.path,doc.doc.getValue());
	}
}
core.FileDialog = function() { }
core.FileDialog.__name__ = true;
core.FileDialog.init = function() {
	core.FileDialog.input = js.Browser.document.createElement("input");
	core.FileDialog.input.type = "file";
	core.FileDialog.input.style.display = "none";
	core.FileDialog.input.addEventListener("change",function(e) {
		var value = core.FileDialog.input.value;
		if(value != "") core.FileDialog.onClick(value);
	});
	js.Browser.document.body.appendChild(core.FileDialog.input);
}
core.FileDialog.openFile = function(_onClick) {
	core.FileDialog.input.value = "";
	core.FileDialog.onClick = _onClick;
	if(core.FileDialog.input.hasAttribute("nwsaveas")) core.FileDialog.input.removeAttribute("nwsaveas");
	core.FileDialog.input.click();
}
core.FileDialog.saveFile = function(_onClick,_name) {
	core.FileDialog.input.value = "";
	core.FileDialog.onClick = _onClick;
	if(_name == null) _name = "";
	core.FileDialog.input.setAttribute("nwsaveas",_name);
	core.FileDialog.input.click();
}
core.ProjectAccess = function() { }
core.ProjectAccess.__name__ = true;
core.ProjectAccess.createNewProject = function() {
	console.log("create a new project");
	var notify = new ui.Notify();
	notify.type = "error";
	notify.content = "Just to test notify!";
	notify.show();
	var modalDialog = new ui.ModalDialog();
	modalDialog.id = "projectAccess_new";
	modalDialog.title = "New Project";
	modalDialog.content = "this is just a sample";
	modalDialog.ok_text = "Create";
	modalDialog.cancel_text = "Cancel";
	modalDialog.show();
	new $("#projectAccess_new .button_ok").on("click",null,function() {
		console.log("you've clicked the OK button");
	});
}
core.ProjectAccess.openProject = function() {
	console.log("open a project");
	if(Main.session.current_project_xml == "") core.FileDialog.openFile(function(path) {
		Main.session.current_project_xml = path;
		Utils.system_parse_project();
	}); else {
		var notify = new ui.Notify();
		notify.type = "error";
		notify.content = "Only One project could be open at one time. Please close the project first.";
		notify.show();
	}
}
core.ProjectAccess.configureProject = function() {
	console.log("configure project");
}
core.ProjectAccess.closeProject = function() {
	console.log("close project");
	if(Main.session.current_project_xml != "") {
		Main.session.current_project_xml = "";
		Main.session.current_project_folder = "";
		Main.session.current_project_xml_parameter = "";
	} else {
		var notify = new ui.Notify();
		notify.type = "error";
		notify.content = "No project to close.";
		notify.show();
	}
}
core.TabsManager = function() { }
core.TabsManager.__name__ = true;
core.TabsManager.init = function() {
	core.TabsManager.themes = ["3024-day","3024-night","ambiance","base16-dark","base16-light","blackboard","cobalt","eclipse","elegant","erlang-dark","lesser-dark","midnight","monokai","neat","night","paraiso-dark","paraiso-light","rubyblue","solarized dark","solarized light","the-matrix","tomorrow-night-eighties","twilight","vibrant-ink","xq-dark","xq-light"];
	CodeMirror.on(js.Browser.window,"load",function() {
		core.TabsManager.initEditor();
		Main.resize();
		core.TabsManager.editor.refresh();
		core.TabsManager.createContextMenu();
	});
}
core.TabsManager.createContextMenu = function() {
	var contextMenu = js.Browser.document.createElement("div");
	contextMenu.className = "dropdown";
	contextMenu.style.position = "absolute";
	contextMenu.style.display = "none";
	js.Browser.document.onclick = function(e) {
		contextMenu.style.display = "none";
	};
	var ul = js.Browser.document.createElement("ul");
	ul.className = "dropdown-menu";
	ul.style.display = "block";
	ul.appendChild(core.TabsManager.createContextMenuItem("New File...",core.TabsManager.createFileInNewTab));
	var li = js.Browser.document.createElement("li");
	li.className = "divider";
	ul.appendChild(li);
	ul.appendChild(core.TabsManager.createContextMenuItem("Close",function() {
		core.TabsManager.closeTab(contextMenu.getAttribute("path"));
	}));
	ul.appendChild(core.TabsManager.createContextMenuItem("Close All",function() {
		core.TabsManager.closeAll();
	}));
	ul.appendChild(core.TabsManager.createContextMenuItem("Close Other",function() {
		var path = contextMenu.getAttribute("path");
		core.TabsManager.closeOthers(path);
	}));
	contextMenu.appendChild(ul);
	js.Browser.document.body.appendChild(contextMenu);
	js.Browser.document.getElementById("docs").addEventListener("contextmenu",function(ev) {
		ev.preventDefault();
		var clickedOnTab = false;
		var _g = 0, _g1 = js.Browser.document.getElementById("docs").childNodes;
		while(_g < _g1.length) {
			var li1 = _g1[_g];
			++_g;
			if(ev.target == li1) {
				clickedOnTab = true;
				break;
			}
		}
		if(clickedOnTab) {
			var li1 = js.Boot.__cast(ev.target , HTMLLIElement);
			contextMenu.setAttribute("path",li1.getAttribute("path"));
			contextMenu.style.display = "block";
			contextMenu.style.left = Std.string(ev.pageX) + "px";
			contextMenu.style.top = Std.string(ev.pageY) + "px";
		}
		return false;
	});
}
core.TabsManager.createContextMenuItem = function(text,onClick) {
	var li = js.Browser.document.createElement("li");
	li.onclick = function(e) {
		onClick();
	};
	var a = js.Browser.document.createElement("a");
	a.href = "#";
	a.textContent = text;
	li.appendChild(a);
	return li;
}
core.TabsManager.applyRandomTheme = function() {
	var theme = core.TabsManager.themes[Std.random(core.TabsManager.themes.length)];
	core.TabsManager.editor.setOption("theme",theme);
	new $("body").css("background",new $(".CodeMirror").css("background"));
	new $("#style_override").append("<style>ul.tabs li {background: " + new $(".CodeMirror").css("background") + ";}</style>");
	new $("#style_override").append("<style>ul.tabs li {color: " + new $(".CodeMirror").css("color") + ";}</style>");
	new $("#style_override").append("<style>ul.tabs li:hover {color: " + new $(".cm-keyword").css("color") + ";}</style>");
	new $("#style_override").append("<style>ul.tabs li.selected {background: " + new $(".CodeMirror").css("background") + ";}</style>");
	new $("#style_override").append("<style>ul.tabs li.selected {color: " + new $(".cm-variable").css("color") + ";}</style>");
	new $("#style_override").append("<style>.CodeMirror-hints {background: " + new $(".CodeMirror").css("background") + ";}</style>");
	new $("#style_override").append("<style>.CodeMirror-hint {color: " + new $(".cm-variable").css("color") + ";}</style>");
	new $("#style_override").append("<style>.CodeMirror-hint-active {background: " + new $(".CodeMirror").css("background") + ";}</style>");
	new $("#style_override").append("<style>.CodeMirror-hint-active {color: " + new $(".cm-keyword").css("color") + ";}</style>");
}
core.TabsManager.createFileInNewTab = function() {
	core.FileDialog.saveFile(function(value) {
		var path = core.TabsManager.convertPathToUnixFormat(value);
		if(core.TabsManager.isAlreadyOpened(path)) return;
		var name = core.TabsManager.getFileName(path);
		var mode = core.TabsManager.getMode(name);
		var code = "";
		if(Utils.path.extname(name) == ".hx") {
			path = HxOverrides.substr(path,0,path.length - name.length) + Utils.capitalize(name);
			code = "package ;\n\nclass " + Utils.path.basename(name) + "\n{\n\n}";
		}
		core.TabsManager.registerDoc(name,new CodeMirror.Doc(code,mode),path);
		core.TabsManager.selectDoc(core.TabsManager.docs.length - 1);
	});
}
core.TabsManager.convertPathToUnixFormat = function(path) {
	if(Utils.getOS() == 0) {
		var ereg = new EReg("[\\\\]","g");
		path = ereg.replace(path,"/");
	}
	return path;
}
core.TabsManager.isAlreadyOpened = function(path) {
	var opened = false;
	var _g1 = 0, _g = core.TabsManager.docs.length;
	while(_g1 < _g) {
		var i = _g1++;
		if(core.TabsManager.docs[i].path == path) {
			core.TabsManager.selectDoc(i);
			opened = true;
			break;
		}
	}
	return opened;
}
core.TabsManager.getFileName = function(path) {
	var pos = null;
	if(Utils.getOS() == 0) {
		pos = path.lastIndexOf("\\");
		if(pos == -1) pos = path.lastIndexOf("/");
	} else pos = path.lastIndexOf("/");
	var filename = null;
	if(pos != -1) filename = HxOverrides.substr(path,pos + 1,null); else filename = path;
	return filename;
}
core.TabsManager.getMode = function(filename) {
	var mode = "haxe";
	var _g = Utils.path.extname(filename);
	switch(_g) {
	case ".js":
		mode = "javascript";
		break;
	case ".css":
		mode = "css";
		break;
	case ".xml":
		mode = "xml";
		break;
	case ".html":
		mode = "text/html";
		break;
	case ".md":
		mode = "markdown";
		break;
	case ".sh":case ".bat":
		mode = "shell";
		break;
	case ".ml":
		mode = "ocaml";
		break;
	default:
	}
	return mode;
}
core.TabsManager.openFileInNewTab = function(path) {
	path = core.TabsManager.convertPathToUnixFormat(path);
	if(core.TabsManager.isAlreadyOpened(path)) return;
	var filename = core.TabsManager.getFileName(path);
	Utils.system_openFile(path,function(data) {
		var mode = core.TabsManager.getMode(filename);
		core.TabsManager.registerDoc(filename,new CodeMirror.Doc(data,mode),path);
		core.TabsManager.selectDoc(core.TabsManager.docs.length - 1);
		if(new $("#sourceCodeEditor").css("display") == "none" && core.TabsManager.docs.length > 0) {
			new $("#sourceCodeEditor").css("display","block");
			core.TabsManager.editor.refresh();
			Main.updateMenu();
		}
		Main.resize();
	});
}
core.TabsManager.closeAll = function() {
	var _g1 = 0, _g = core.TabsManager.docs.length;
	while(_g1 < _g) {
		var i = _g1++;
		if(core.TabsManager.docs[i] != null) core.TabsManager.closeTab(core.TabsManager.docs[i].path,false);
	}
	if(core.TabsManager.docs.length > 0) haxe.Timer.delay(function() {
		core.TabsManager.closeAll();
	},30);
}
core.TabsManager.closeOthers = function(path) {
	var _g1 = 0, _g = core.TabsManager.docs.length;
	while(_g1 < _g) {
		var i = _g1++;
		if(core.TabsManager.docs[i] != null && path != core.TabsManager.docs[i].path) core.TabsManager.closeTab(core.TabsManager.docs[i].path);
	}
	if(core.TabsManager.docs.length > 1) haxe.Timer.delay(function() {
		core.TabsManager.closeOthers(path);
	},30);
}
core.TabsManager.closeTab = function(path,switchToTab) {
	if(switchToTab == null) switchToTab = true;
	var _g1 = 0, _g = core.TabsManager.docs.length;
	while(_g1 < _g) {
		var i = _g1++;
		if(core.TabsManager.docs[i] != null && core.TabsManager.docs[i].path == path) core.TabsManager.unregisterDoc(core.TabsManager.docs[i],switchToTab);
	}
}
core.TabsManager.closeActiveTab = function() {
	core.TabsManager.unregisterDoc(core.TabsManager.curDoc);
}
core.TabsManager.showNextTab = function() {
	var n = Lambda.indexOf(core.TabsManager.docs,core.TabsManager.curDoc);
	n++;
	if(n > core.TabsManager.docs.length - 1) n = 0;
	core.TabsManager.selectDoc(n);
}
core.TabsManager.showPreviousTab = function() {
	var n = Lambda.indexOf(core.TabsManager.docs,core.TabsManager.curDoc);
	n--;
	if(n < 0) n = core.TabsManager.docs.length - 1;
	core.TabsManager.selectDoc(n);
}
core.TabsManager.initEditor = function() {
	var keyMap = { 'Ctrl-I' : function(cm) {
		core.TabsManager.server.showType(cm);
	}, 'Ctrl-Space' : function(cm) {
		core.TabsManager.server.complete(cm);
	}, 'Alt-.' : function(cm) {
		core.TabsManager.server.jumpToDef(cm);
	}, 'Alt-,' : function(cm) {
		core.TabsManager.server.jumpBack(cm);
	}, 'Ctrl-Q' : function(cm) {
		core.TabsManager.server.rename(cm);
	}};
	core.TabsManager.editor = CodeMirror.fromTextArea(js.Browser.document.getElementById("code"),{ lineNumbers : true, extraKeys : keyMap, matchBrackets : true, dragDrop : false, autoCloseBrackets : true, foldGutter : { rangeFinder : new CodeMirror.fold.combine(CodeMirror.fold.brace, CodeMirror.fold.comment)}, gutters : ["CodeMirror-linenumbers","CodeMirror-foldgutter"]});
	core.TabsManager.server = new CodeMirror.TernServer({ defs : [], plugins : { doc_comment : true}, switchToDoc : function(name) {
		core.TabsManager.selectDoc(core.TabsManager.docID(name));
	}, workerDeps : ["./includes/js/acorn/acorn.js","./includes/js/acorn/acorn_loose.js","./includes/js/acorn/util/walk.js","./includes/js/tern/lib/signal.js","./includes/js/tern/lib/tern.js","./includes/js/tern/lib/def.js","./includes/js/tern/lib/infer.js","./includes/js/tern/lib/comment.js","./includes/js/tern/plugin/doc_comment.js"], workerScript : "./includes/js/codemirror-3.18/addon/tern/worker.js", useWorker : core.TabsManager.useWorker});
	core.TabsManager.editor.on("cursorActivity",function(cm) {
		core.TabsManager.server.updateArgHints(cm);
	});
	core.TabsManager.openFileInNewTab("../src/Main.hx");
	CodeMirror.on(js.Browser.document.getElementById("docs"),"click",function(e) {
		var target = e.target || e.srcElement;
		if(target.nodeName.toLowerCase() != "li") return;
		var i = 0;
		var c = target.parentNode.firstChild;
		if(c == target) return core.TabsManager.selectDoc(0); else while(true) {
			i++;
			c = c.nextSibling;
			if(c == target) return core.TabsManager.selectDoc(i);
		}
	});
}
core.TabsManager.docID = function(name) {
	var _g1 = 0, _g = core.TabsManager.docs.length;
	while(_g1 < _g) {
		var i = _g1++;
		if(core.TabsManager.docs[i].name == name) return i;
	}
	return null;
}
core.TabsManager.registerDoc = function(name,doc,path) {
	core.TabsManager.server.addDoc(name,doc,path);
	var data = { name : name, doc : doc, path : path};
	core.TabsManager.docs.push(data);
	var docTabs = js.Browser.document.getElementById("docs");
	var li = js.Browser.document.createElement("li");
	li.title = path;
	li.innerText = name + "\t";
	li.setAttribute("path",path);
	var span = js.Browser.document.createElement("span");
	span.style.position = "relative";
	span.style.top = "2px";
	span.onclick = function(e) {
		core.TabsManager.closeTab(path);
	};
	var span2 = js.Browser.document.createElement("span");
	span2.className = "glyphicon glyphicon-remove-circle";
	span.appendChild(span2);
	li.appendChild(span);
	docTabs.appendChild(li);
	if(core.TabsManager.editor.getDoc() == doc) {
		core.TabsManager.setSelectedDoc(core.TabsManager.docs.length - 1);
		core.TabsManager.curDoc = data;
		js.Browser.window.curDoc = core.TabsManager.curDoc;
	}
}
core.TabsManager.unregisterDoc = function(doc,switchToTab) {
	if(switchToTab == null) switchToTab = true;
	var b = core.TabsManager.curDoc == doc;
	core.TabsManager.server.delDoc(doc.name);
	var j = null;
	var _g1 = 0, _g = core.TabsManager.docs.length;
	while(_g1 < _g) {
		var i = _g1++;
		j = i;
		if(doc == core.TabsManager.docs[i]) break;
	}
	core.TabsManager.docs.splice(j,1);
	var docList = js.Browser.document.getElementById("docs");
	docList.removeChild(docList.childNodes[j]);
	if(switchToTab && b && docList.childNodes.length > 0) core.TabsManager.selectDoc(Math.max(0,j - 1) | 0);
	if(docList.childNodes.length == 0) {
		new $("#sourceCodeEditor").css("display","none");
		Main.updateMenu();
	}
	Main.resize();
}
core.TabsManager.setSelectedDoc = function(pos) {
	var docTabs = js.Browser.document.getElementById("docs");
	var _g1 = 0, _g = docTabs.childNodes.length;
	while(_g1 < _g) {
		var i = _g1++;
		var child = js.Boot.__cast(docTabs.childNodes[i] , Element);
		if(pos == i) child.className = "selected"; else child.className = "";
	}
}
core.TabsManager.selectDoc = function(pos) {
	if(core.TabsManager.curDoc != null) core.TabsManager.server.hideDoc(core.TabsManager.curDoc.name);
	core.TabsManager.setSelectedDoc(pos);
	core.TabsManager.curDoc = core.TabsManager.docs[pos];
	js.Browser.window.curDoc = core.TabsManager.curDoc;
	core.TabsManager.editor.swapDoc(core.TabsManager.curDoc.doc);
}
var haxe = {}
haxe.Timer = function(time_ms) {
	var me = this;
	this.id = setInterval(function() {
		me.run();
	},time_ms);
};
haxe.Timer.__name__ = true;
haxe.Timer.delay = function(f,time_ms) {
	var t = new haxe.Timer(time_ms);
	t.run = function() {
		t.stop();
		f();
	};
	return t;
}
haxe.Timer.prototype = {
	run: function() {
		console.log("run");
	}
	,stop: function() {
		if(this.id == null) return;
		clearInterval(this.id);
		this.id = null;
	}
	,__class__: haxe.Timer
}
haxe.ds = {}
haxe.ds.StringMap = function() {
	this.h = { };
};
haxe.ds.StringMap.__name__ = true;
haxe.ds.StringMap.__interfaces__ = [IMap];
haxe.ds.StringMap.prototype = {
	get: function(key) {
		return this.h["$" + key];
	}
	,set: function(key,value) {
		this.h["$" + key] = value;
	}
	,__class__: haxe.ds.StringMap
}
js.Boot = function() { }
js.Boot.__name__ = true;
js.Boot.__string_rec = function(o,s) {
	if(o == null) return "null";
	if(s.length >= 5) return "<...>";
	var t = typeof(o);
	if(t == "function" && (o.__name__ || o.__ename__)) t = "object";
	switch(t) {
	case "object":
		if(o instanceof Array) {
			if(o.__enum__) {
				if(o.length == 2) return o[0];
				var str = o[0] + "(";
				s += "\t";
				var _g1 = 2, _g = o.length;
				while(_g1 < _g) {
					var i = _g1++;
					if(i != 2) str += "," + js.Boot.__string_rec(o[i],s); else str += js.Boot.__string_rec(o[i],s);
				}
				return str + ")";
			}
			var l = o.length;
			var i;
			var str = "[";
			s += "\t";
			var _g = 0;
			while(_g < l) {
				var i1 = _g++;
				str += (i1 > 0?",":"") + js.Boot.__string_rec(o[i1],s);
			}
			str += "]";
			return str;
		}
		var tostr;
		try {
			tostr = o.toString;
		} catch( e ) {
			return "???";
		}
		if(tostr != null && tostr != Object.toString) {
			var s2 = o.toString();
			if(s2 != "[object Object]") return s2;
		}
		var k = null;
		var str = "{\n";
		s += "\t";
		var hasp = o.hasOwnProperty != null;
		for( var k in o ) { ;
		if(hasp && !o.hasOwnProperty(k)) {
			continue;
		}
		if(k == "prototype" || k == "__class__" || k == "__super__" || k == "__interfaces__" || k == "__properties__") {
			continue;
		}
		if(str.length != 2) str += ", \n";
		str += s + k + " : " + js.Boot.__string_rec(o[k],s);
		}
		s = s.substring(1);
		str += "\n" + s + "}";
		return str;
	case "function":
		return "<function>";
	case "string":
		return o;
	default:
		return String(o);
	}
}
js.Boot.__interfLoop = function(cc,cl) {
	if(cc == null) return false;
	if(cc == cl) return true;
	var intf = cc.__interfaces__;
	if(intf != null) {
		var _g1 = 0, _g = intf.length;
		while(_g1 < _g) {
			var i = _g1++;
			var i1 = intf[i];
			if(i1 == cl || js.Boot.__interfLoop(i1,cl)) return true;
		}
	}
	return js.Boot.__interfLoop(cc.__super__,cl);
}
js.Boot.__instanceof = function(o,cl) {
	if(cl == null) return false;
	switch(cl) {
	case Int:
		return (o|0) === o;
	case Float:
		return typeof(o) == "number";
	case Bool:
		return typeof(o) == "boolean";
	case String:
		return typeof(o) == "string";
	case Dynamic:
		return true;
	default:
		if(o != null) {
			if(typeof(cl) == "function") {
				if(o instanceof cl) {
					if(cl == Array) return o.__enum__ == null;
					return true;
				}
				if(js.Boot.__interfLoop(o.__class__,cl)) return true;
			}
		} else return false;
		if(cl == Class && o.__name__ != null) return true;
		if(cl == Enum && o.__ename__ != null) return true;
		return o.__enum__ == cl;
	}
}
js.Boot.__cast = function(o,t) {
	if(js.Boot.__instanceof(o,t)) return o; else throw "Cannot cast " + Std.string(o) + " to " + Std.string(t);
}
js.Browser = function() { }
js.Browser.__name__ = true;
js.Browser.getLocalStorage = function() {
	try {
		var s = js.Browser.window.localStorage;
		s.getItem("");
		return s;
	} catch( e ) {
		return null;
	}
}
var ui = {}
ui.ModalDialog = function() {
	this.title = "";
	this.id = "";
	this.content = "";
	this.ok_text = "";
	this.cancel_text = "";
};
ui.ModalDialog.__name__ = true;
ui.ModalDialog.prototype = {
	show: function() {
		var _g = this;
		this.updateModalDialog();
		new $("#" + this.id).modal("show");
		new $("#" + this.id).on("hidden.bs.modal",null,function() {
			new $("#" + _g.id).remove();
		});
	}
	,updateModalDialog: function() {
		var retStr = ["<div class='modal fade' id='" + this.id + "' tabindex='-1' role='dialog' aria-labelledby='myModalLabel' aria-hidden='true'>","<div class='modal-dialog'>","<div class='modal-content'>","<div class='modal-header'>","<button type='button' class='close' data-dismiss='modal' aria-hidden='true'>&times;</button>","<h4 class='modal-title'>" + this.title + "</h4>","</div>","<div class='modal-body'>",this.content,"</div>","<div class='modal-footer'>","<button type='button' class='btn btn-default' data-dismiss='modal'>" + this.cancel_text + "</button>","<button type='button' class='btn btn-primary button_ok'>" + this.ok_text + "</button>","</div>","</div>","</div>","</div>"].join("\n");
		new $("#modal_position").html(retStr);
	}
	,__class__: ui.ModalDialog
}
ui.Notify = function() {
	this.type = "";
	this.content = "";
};
ui.Notify.__name__ = true;
ui.Notify.prototype = {
	show: function() {
		var type_error = "";
		var type_error_text = "";
		var skip = true;
		if(this.type == "error") {
			type_error = "danger";
			type_error_text = "Error";
			skip = false;
		} else if(this.type == "warning") {
			type_error = "warning";
			type_error_text = "Warning";
			skip = false;
		}
		if(skip == false) {
			var retStr = ["<div style=\"margin-left:10px;margin-top:12px;margin-right:10px;\" class=\"alert alert-" + type_error + " fade in\">","<a class=\"close\" data-dismiss=\"alert\" href=\"#\" aria-hidden=\"true\">&times;</a>","<strong>" + type_error_text + " :</strong><br/>" + this.content,"</div>"].join("\n");
			new $("#notify_position").html(retStr);
		}
	}
	,__class__: ui.Notify
}
ui.menu = {}
ui.menu.basic = {}
ui.menu.basic.Menu = function(_text,_headerText) {
	this.li = js.Browser.document.createElement("li");
	this.li.className = "dropdown";
	var a = js.Browser.document.createElement("a");
	a.href = "#";
	a.className = "dropdown-toggle";
	a.setAttribute("data-toggle","dropdown");
	a.innerText = _text;
	this.li.appendChild(a);
	this.ul = js.Browser.document.createElement("ul");
	this.ul.className = "dropdown-menu";
	if(_headerText != null) {
		var li_header = js.Browser.document.createElement("li");
		li_header.className = "dropdown-header";
		li_header.innerText = _headerText;
		this.ul.appendChild(li_header);
	}
	this.li.appendChild(this.ul);
};
ui.menu.basic.Menu.__name__ = true;
ui.menu.basic.Menu.prototype = {
	setMenuEnabled: function(enabled) {
		var childNodes = this.ul.childNodes;
		var _g1 = 0, _g = childNodes.length;
		while(_g1 < _g) {
			var i = _g1++;
			var child = js.Boot.__cast(childNodes[i] , Element);
			if(child.className != "divider") {
				if(enabled) child.className = ""; else child.className = "disabled";
			}
		}
	}
	,setDisabled: function(menuItemNames) {
		var childNodes = this.ul.childNodes;
		var _g1 = 0, _g = childNodes.length;
		while(_g1 < _g) {
			var i = _g1++;
			var child = js.Boot.__cast(childNodes[i] , Element);
			if(child.className != "divider") {
				var a = js.Boot.__cast(child.firstChild , HTMLAnchorElement);
				if(Lambda.indexOf(menuItemNames,a.getAttribute("text")) == -1) child.className = ""; else child.className = "disabled";
			}
		}
	}
	,addToDocument: function() {
		var div = js.Boot.__cast(js.Browser.document.getElementById("position-navbar") , Element);
		div.appendChild(this.li);
	}
	,addSeparator: function() {
		this.ul.appendChild(new ui.menu.basic.Separator().getElement());
	}
	,addMenuItem: function(_text,_onClickFunctionName,_onClickFunction,_hotkey) {
		this.ul.appendChild(new ui.menu.basic.MenuButtonItem(_text,_onClickFunctionName,_onClickFunction,_hotkey).getElement());
	}
	,__class__: ui.menu.basic.Menu
}
ui.menu.EditMenu = function() {
	ui.menu.basic.Menu.call(this,"Edit");
	this.createUI();
};
ui.menu.EditMenu.__name__ = true;
ui.menu.EditMenu.__super__ = ui.menu.basic.Menu;
ui.menu.EditMenu.prototype = $extend(ui.menu.basic.Menu.prototype,{
	createUI: function() {
		this.addMenuItem("Undo","component_undo",function() {
			if(core.TabsManager.curDoc != null) core.TabsManager.curDoc.doc.undo();
		},"Ctrl-Z");
		this.addMenuItem("Redo","component_redo",function() {
			if(core.TabsManager.curDoc != null) core.TabsManager.curDoc.doc.redo();
		},"Ctrl-Y");
		this.addSeparator();
		this.addMenuItem("Cut","component_cut",null,"Ctrl-X");
		this.addMenuItem("Copy","component_copy",null,"Ctrl-C");
		this.addMenuItem("Paste","component_paste",null,"Ctrl-V");
		this.addMenuItem("Delete","component_delete",null);
		this.addMenuItem("Select All","component_select_all",null,"Ctrl-A");
		this.addSeparator();
		this.addMenuItem("Find...","component_find",null,"Ctrl-F");
		this.addMenuItem("Replace...","component_replace",null,"Ctrl-H");
		this.addToDocument();
	}
	,__class__: ui.menu.EditMenu
});
ui.menu.FileMenu = function() {
	ui.menu.basic.Menu.call(this,"File");
	this.createUI();
};
ui.menu.FileMenu.__name__ = true;
ui.menu.FileMenu.__super__ = ui.menu.basic.Menu;
ui.menu.FileMenu.prototype = $extend(ui.menu.basic.Menu.prototype,{
	createUI: function() {
		this.addMenuItem("New Project...","component_projectAccess_new",core.ProjectAccess.createNewProject,"Ctrl-Shift-N");
		this.addMenuItem("New File...","component_fileAccess_new",core.FileAccess.createNewFile,"Ctrl-N");
		this.addMenuItem("Open Project...","component_projectAccess_open",core.ProjectAccess.openProject,"Ctrl-Shift-O");
		this.addMenuItem("Close Project...","component_projectAccess_close",core.ProjectAccess.closeProject);
		this.addSeparator();
		this.addMenuItem("Open File...","component_fileAccess_open",core.FileAccess.openFile,"Ctrl-O");
		this.addMenuItem("Close File","component_fileAccess_close",core.FileAccess.closeActiveFile,"Ctrl-W");
		this.addSeparator();
		this.addMenuItem("Project Properties","component_projectAccess_configure",core.ProjectAccess.configureProject);
		this.addSeparator();
		this.addMenuItem("Save","component_fileAccess_save",core.FileAccess.saveActiveFile,"Ctrl-S");
		this.addMenuItem("Save as...","component_saveAs",core.FileAccess.saveActiveFileAs,"Ctrl-Shift-S");
		this.addMenuItem("Save all","component_saveAll",core.FileAccess.saveAll);
		this.addSeparator();
		this.addMenuItem("Exit","component_exit",Main.close,"Alt-F4");
		this.addToDocument();
	}
	,__class__: ui.menu.FileMenu
});
ui.menu.HelpMenu = function() {
	ui.menu.basic.Menu.call(this,"Help");
	this.createUI();
};
ui.menu.HelpMenu.__name__ = true;
ui.menu.HelpMenu.__super__ = ui.menu.basic.Menu;
ui.menu.HelpMenu.prototype = $extend(ui.menu.basic.Menu.prototype,{
	createUI: function() {
		this.addMenuItem("About","component_about",null);
		this.addToDocument();
	}
	,__class__: ui.menu.HelpMenu
});
ui.menu.RunMenu = function() {
	ui.menu.basic.Menu.call(this,"Run");
	this.createUI();
};
ui.menu.RunMenu.__name__ = true;
ui.menu.RunMenu.__super__ = ui.menu.basic.Menu;
ui.menu.RunMenu.prototype = $extend(ui.menu.basic.Menu.prototype,{
	createUI: function() {
		this.addMenuItem("Run Project","component_run_project",null);
		this.addMenuItem("Build Project","component_build_project",null);
		this.addToDocument();
	}
	,__class__: ui.menu.RunMenu
});
ui.menu.SourceMenu = function() {
	ui.menu.basic.Menu.call(this,"Source");
	this.createUI();
};
ui.menu.SourceMenu.__name__ = true;
ui.menu.SourceMenu.__super__ = ui.menu.basic.Menu;
ui.menu.SourceMenu.prototype = $extend(ui.menu.basic.Menu.prototype,{
	createUI: function() {
		this.addMenuItem("Format","component_format",null);
		this.addMenuItem("Toggle Comment","component_toggle_comment",null);
		this.addToDocument();
	}
	,__class__: ui.menu.SourceMenu
});
ui.menu.ViewMenu = function() {
	ui.menu.basic.Menu.call(this,"View");
	this.createUI();
};
ui.menu.ViewMenu.__name__ = true;
ui.menu.ViewMenu.__super__ = ui.menu.basic.Menu;
ui.menu.ViewMenu.prototype = $extend(ui.menu.basic.Menu.prototype,{
	createUI: function() {
		this.addMenuItem("Toggle Fullscreen","component_toggle_fullscreen",Utils.toggleFullscreen,"Shift-Alt-Enter");
		this.addToDocument();
	}
	,__class__: ui.menu.ViewMenu
});
ui.menu.basic.MenuItem = function() { }
ui.menu.basic.MenuItem.__name__ = true;
ui.menu.basic.MenuButtonItem = function(_text,_onClickFunctionName,_onClickFunction,_hotkey) {
	var _g = this;
	var span = null;
	if(_hotkey != null) {
		span = js.Browser.document.createElement("span");
		span.style.color = "silver";
		span.style["float"] = "right";
		span.innerText = _hotkey;
	}
	this.li = js.Browser.document.createElement("li");
	var a = js.Browser.document.createElement("a");
	a.style.left = "0";
	a.setAttribute("text",_text);
	if(_onClickFunction != null) a.onclick = function(e) {
		if(_g.li.className != "disabled") new $(js.Browser.document).triggerHandler(_onClickFunctionName);
	};
	a.innerText = _text;
	if(span != null) a.appendChild(span);
	this.li.appendChild(a);
	this.registerEvent(_onClickFunctionName,_onClickFunction);
};
ui.menu.basic.MenuButtonItem.__name__ = true;
ui.menu.basic.MenuButtonItem.__interfaces__ = [ui.menu.basic.MenuItem];
ui.menu.basic.MenuButtonItem.prototype = {
	registerEvent: function(_onClickFunctionName,_onClickFunction) {
		if(_onClickFunction != null) new $(js.Browser.document).on(_onClickFunctionName,_onClickFunction);
	}
	,getElement: function() {
		return this.li;
	}
	,__class__: ui.menu.basic.MenuButtonItem
}
ui.menu.basic.Separator = function() {
	this.li = js.Browser.document.createElement("li");
	this.li.className = "divider";
};
ui.menu.basic.Separator.__name__ = true;
ui.menu.basic.Separator.__interfaces__ = [ui.menu.basic.MenuItem];
ui.menu.basic.Separator.prototype = {
	getElement: function() {
		return this.li;
	}
	,__class__: ui.menu.basic.Separator
}
function $iterator(o) { if( o instanceof Array ) return function() { return HxOverrides.iter(o); }; return typeof(o.iterator) == 'function' ? $bind(o,o.iterator) : o.iterator; };
var $_, $fid = 0;
function $bind(o,m) { if( m == null ) return null; if( m.__id__ == null ) m.__id__ = $fid++; var f; if( o.hx__closures__ == null ) o.hx__closures__ = {}; else f = o.hx__closures__[m.__id__]; if( f == null ) { f = function(){ return f.method.apply(f.scope, arguments); }; f.scope = o; f.method = m; o.hx__closures__[m.__id__] = f; } return f; };
Math.__name__ = ["Math"];
Math.NaN = Number.NaN;
Math.NEGATIVE_INFINITY = Number.NEGATIVE_INFINITY;
Math.POSITIVE_INFINITY = Number.POSITIVE_INFINITY;
Math.isFinite = function(i) {
	return isFinite(i);
};
Math.isNaN = function(i) {
	return isNaN(i);
};
String.prototype.__class__ = String;
String.__name__ = true;
Array.prototype.__class__ = Array;
Array.__name__ = true;
var Int = { __name__ : ["Int"]};
var Dynamic = { __name__ : ["Dynamic"]};
var Float = Number;
Float.__name__ = ["Float"];
var Bool = Boolean;
Bool.__ename__ = ["Bool"];
var Class = { __name__ : ["Class"]};
var Enum = { };
var module, setImmediate, clearImmediate;
js.Node.setTimeout = setTimeout;
js.Node.clearTimeout = clearTimeout;
js.Node.setInterval = setInterval;
js.Node.clearInterval = clearInterval;
js.Node.global = global;
js.Node.process = process;
js.Node.require = require;
js.Node.console = console;
js.Node.module = module;
js.Node.stringify = JSON.stringify;
js.Node.parse = JSON.parse;
var version = HxOverrides.substr(js.Node.process.version,1,null).split(".").map(Std.parseInt);
if(version[0] > 0 || version[1] >= 9) {
	js.Node.setImmediate = setImmediate;
	js.Node.clearImmediate = clearImmediate;
}
PreserveWindowState.isMaximizationEvent = false;
Utils.os = js.Node.require("os");
Utils.fs = js.Node.require("fs");
Utils.path = js.Node.require("path");
Utils.exec = js.Node.require("child_process").exec;
Utils.gui = js.Node.require("nw.gui");
Utils.window = Utils.gui.Window.get();
core.TabsManager.useWorker = false;
core.TabsManager.docs = [];
js.Browser.window = typeof window != "undefined" ? window : null;
js.Browser.document = typeof window != "undefined" ? window.document : null;
Main.main();
})();
