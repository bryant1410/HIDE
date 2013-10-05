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
var Main = function() { }
Main.__name__ = true;
Main.main = function() {
	new $(function() {
		Main.init();
		Main.initCorePlugin();
		Main.show();
	});
}
Main.show = function() {
	Utils.gui.Window.get().show();
}
Main.close = function() {
	Sys.exit(0);
}
Main.init = function() {
	js.Browser.window.onresize = function(e) {
		Main.resize();
	};
	core.TabsManager.init();
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
			default:
			}
		} else if(e.keyCode == 13 && e.shiftKey && e.altKey) Utils.toggleFullscreen();
	};
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
	Main.session = new Session();
	Main.settings = new haxe.ds.StringMap();
}
Main.resize = function() {
	var ul1 = js.Browser.document.getElementById("docs");
	new $(".CodeMirror").css("height",Std.string(js.Browser.window.innerHeight - 58 - ul1.clientHeight));
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
	new ui.menu.FileMenu();
	new ui.menu.EditMenu();
	new ui.menu.ViewMenu();
	new ui.menu.SourceMenu();
	new ui.menu.RunMenu();
	new ui.menu.HelpMenu();
}
var IMap = function() { }
IMap.__name__ = true;
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
Utils.system_openFile = function(filename) {
	return Utils.fs.readFileSync(filename,"utf-8");
}
Utils.system_saveFile = function(filename,content) {
	Utils.fs.writeFileSync(filename,content);
	console.log("SYSTEM: file saved " + filename);
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
	if(Main.session.current_project_xml == "") console.log("open project first"); else console.log("create a new file");
}
core.FileAccess.openFile = function() {
	console.log("open a file");
	var modal = new ui.ModalDialog();
	modal.id = "projectAccess_openFile";
	modal.title = "Open File";
	modal.content = "<input id=\"ProjectAccess_openFile_file\" type=\"file\" />";
	modal.ok_text = "Open";
	modal.cancel_text = "Cancel";
	modal.updateModalDialog();
	var file_input = new $("#ProjectAccess_openFile_file");
	file_input.click();
	file_input.change(function(event) {
		if(file_input.val() != "") {
			var filename = file_input.val();
			core.TabsManager.openFileInNewTab(filename);
		}
	});
}
core.FileAccess.saveActiveFile = function() {
	console.log("save active file");
	var curDoc = core.TabsManager.curDoc;
	console.log(curDoc);
	var curDoc_filepath = curDoc.path;
	var curDoc_val = curDoc.doc.cm.getValue();
	console.log(curDoc_val);
	Utils.system_saveFile(curDoc_filepath,curDoc_val);
}
core.FileAccess.closeActiveFile = function() {
	core.TabsManager.closeActiveTab();
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
	if(Main.session.current_project_xml == "") {
		var modal = new ui.ModalDialog();
		modal.id = "projectAccess_openProject";
		modal.title = "Open Project";
		modal.content = "<input id=\"ProjectAccess_openProject_file\" type=\"file\" />";
		modal.ok_text = "Open";
		modal.cancel_text = "Cancel";
		modal.updateModalDialog();
		var file_input = new $("#ProjectAccess_openProject_file");
		file_input.click();
		file_input.change(function(event) {
			if(file_input.val() != "") {
				Main.session.current_project_xml = file_input.val();
				Utils.system_parse_project();
			}
		});
	} else {
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
	new $(js.Browser.document).on("closeTab",null,function(event,path) {
		var _g1 = 0, _g = core.TabsManager.docs.length;
		while(_g1 < _g) {
			var i = _g1++;
			if(core.TabsManager.docs[i] != null && core.TabsManager.docs[i].path == path) core.TabsManager.unregisterDoc(core.TabsManager.docs[i]);
		}
	});
	CodeMirror.on(js.Browser.window,"load",function() {
		core.TabsManager.initEditor();
		Main.resize();
		core.TabsManager.editor.refresh();
	});
}
core.TabsManager.load = function(file,c) {
	c(Utils.system_openFile(file),200);
}
core.TabsManager.openFileInNewTab = function(path) {
	if(Utils.getOS() == 0) {
		var ereg = new EReg("[\\\\]","g");
		path = ereg.replace(path,"/");
	}
	var _g1 = 0, _g = core.TabsManager.docs.length;
	while(_g1 < _g) {
		var i = _g1++;
		if(core.TabsManager.docs[i].path == path) {
			core.TabsManager.selectDoc(i);
			return;
		}
	}
	var pos = null;
	if(Utils.getOS() == 0) {
		pos = path.lastIndexOf("\\");
		if(pos == -1) pos = path.lastIndexOf("/");
	} else pos = path.lastIndexOf("/");
	var filename = null;
	if(pos != -1) filename = HxOverrides.substr(path,pos + 1,null); else filename = path;
	core.TabsManager.load(path,function(body) {
		core.TabsManager.registerDoc(filename,new CodeMirror.Doc(body,"haxe"),path);
		core.TabsManager.selectDoc(core.TabsManager.docs.length - 1);
	});
	if(new $("#panel").css("display") == "none" && core.TabsManager.docs.length > 0) {
		new $("#panel").css("display","block");
		core.TabsManager.editor.refresh();
	}
	Main.resize();
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
	core.TabsManager.openFileInNewTab("../src/Utils.hx");
	core.TabsManager.openFileInNewTab("../src/Session.hx");
	core.TabsManager.openFileInNewTab("../src/core/FileAccess.hx");
	core.TabsManager.openFileInNewTab("../src/core/ProjectAccess.hx");
	core.TabsManager.openFileInNewTab("../src/core/TabsManager.hx");
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
	core.TabsManager.server.addDoc(name,doc);
	var data = { name : name, doc : doc, path : path};
	core.TabsManager.docs.push(data);
	new $("#docs").append("<li title=\"" + path + "\">" + name + "&nbsp;<span style='position:relative;top:2px;' onclick='$(document).triggerHandler(\"closeTab\", \"" + path + "\");'><span class='glyphicon glyphicon-remove-circle'></span></span></li>");
	if(core.TabsManager.editor.getDoc() == doc) {
		core.TabsManager.setSelectedDoc(core.TabsManager.docs.length - 1);
		core.TabsManager.curDoc = data;
	}
}
core.TabsManager.unregisterDoc = function(doc) {
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
	if(b && docList.childNodes.length > 0) core.TabsManager.selectDoc(Math.max(0,j - 1) | 0);
	if(docList.childNodes.length == 0) new $("#panel").css("display","none");
	Main.resize();
}
core.TabsManager.setSelectedDoc = function(pos) {
	var docTabs = js.Browser.document.getElementById("docs");
	var _g1 = 0, _g = docTabs.childNodes.length;
	while(_g1 < _g) {
		var i = _g1++;
		if(pos == i) docTabs.childNodes[i].className = "selected"; else docTabs.childNodes[i].className = "";
	}
}
core.TabsManager.selectDoc = function(pos) {
	if(core.TabsManager.curDoc != null) core.TabsManager.server.hideDoc(core.TabsManager.curDoc.name);
	core.TabsManager.setSelectedDoc(pos);
	core.TabsManager.curDoc = core.TabsManager.docs[pos];
	core.TabsManager.editor.swapDoc(core.TabsManager.curDoc.doc);
}
var haxe = {}
haxe.ds = {}
haxe.ds.StringMap = function() {
	this.h = { };
};
haxe.ds.StringMap.__name__ = true;
haxe.ds.StringMap.__interfaces__ = [IMap];
haxe.ds.StringMap.prototype = {
	__class__: haxe.ds.StringMap
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
js.Browser = function() { }
js.Browser.__name__ = true;
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
	this.text = _text;
	this.headerText = _headerText;
	this.items = new Array();
};
ui.menu.basic.Menu.__name__ = true;
ui.menu.basic.Menu.prototype = {
	addToDocument: function() {
		var retStr = ["<li class='dropdown'>","<a href='#' class='dropdown-toggle' data-toggle='dropdown'>" + this.text + "</a>","<ul class='dropdown-menu'>"].join("\n");
		if(this.headerText != null) retStr += "<li class='dropdown-header'>" + this.headerText + "</li>\n";
		var _g1 = 0, _g = this.items.length;
		while(_g1 < _g) {
			var i = _g1++;
			retStr += this.items[i].getCode();
		}
		retStr += ["</ul>","</li>"].join("\n");
		new $("#position-navbar").append(retStr);
		var _g1 = 0, _g = this.items.length;
		while(_g1 < _g) {
			var i = _g1++;
			this.items[i].registerEvent();
		}
		this.items = null;
		this.headerText = null;
		this.text = null;
	}
	,addSeparator: function() {
		this.items.push(new ui.menu.basic.Separator());
	}
	,addMenuItem: function(_text,_onClickFunctionName,_onClickFunction,_hotkey) {
		this.items.push(new ui.menu.basic.MenuButtonItem(_text,_onClickFunctionName,_onClickFunction,_hotkey));
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
		this.addMenuItem("Undo","component_undo",null,"Ctrl-Z");
		this.addMenuItem("Redo","component_redo",null,"Ctrl-Y");
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
		this.addMenuItem("Save as...","component_saveAs",null,"Ctrl-Shift-S");
		this.addMenuItem("Save all","component_saveAll",null);
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
ui.menu.basic.MenuItem.prototype = {
	__class__: ui.menu.basic.MenuItem
}
ui.menu.basic.MenuButtonItem = function(_text,_onClickFunctionName,_onClickFunction,_hotkey) {
	this.text = _text;
	this.onClickFunctionName = _onClickFunctionName;
	this.onClickFunction = _onClickFunction;
	this.hotkey = _hotkey;
};
ui.menu.basic.MenuButtonItem.__name__ = true;
ui.menu.basic.MenuButtonItem.__interfaces__ = [ui.menu.basic.MenuItem];
ui.menu.basic.MenuButtonItem.prototype = {
	registerEvent: function() {
		if(this.onClickFunction != null) new $(js.Browser.document).on(this.onClickFunctionName,null,this.onClickFunction);
	}
	,getCode: function() {
		var hotkey_code = "";
		if(this.hotkey != null) hotkey_code = "<span style='color: silver; float:right;'>" + this.hotkey + "</span>";
		return "<li><a style='left: 0;' onclick='$(document).triggerHandler(\"" + this.onClickFunctionName + "\");'>" + this.text + hotkey_code + "</a></li>";
	}
	,__class__: ui.menu.basic.MenuButtonItem
}
ui.menu.basic.Separator = function() {
};
ui.menu.basic.Separator.__name__ = true;
ui.menu.basic.Separator.__interfaces__ = [ui.menu.basic.MenuItem];
ui.menu.basic.Separator.prototype = {
	registerEvent: function() {
	}
	,getCode: function() {
		return "<li class=\"divider\"></li>";
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
