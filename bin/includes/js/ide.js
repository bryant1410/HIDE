(function () { "use strict";
function $extend(from, fields) {
	function inherit() {}; inherit.prototype = from; var proto = new inherit();
	for (var name in fields) proto[name] = fields[name];
	if( fields.toString !== Object.prototype.toString ) proto.toString = fields.toString;
	return proto;
}
var FileObject = function() {
	this.file_stack = new Array();
};
$hxExpose(FileObject, "FileObject");
FileObject.__name__ = true;
FileObject.prototype = {
	remove: function(path) {
		if(this.file_stack.length > 0) {
			var position = 0;
			var _g = 0, _g1 = this.file_stack;
			while(_g < _g1.length) {
				var each = _g1[_g];
				++_g;
				if(each[0] == path) this.file_stack.splice(position,1); else position += 1;
			}
		}
	}
	,update_content: function(path,new_content) {
		if(this.file_stack.length > 0) {
			var position = 0;
			var _g = 0, _g1 = this.file_stack;
			while(_g < _g1.length) {
				var each = _g1[_g];
				++_g;
				if(each[0] == path) this.file_stack[position][1] = new_content; else position += 1;
			}
		}
	}
	,find: function(path) {
		if(this.file_stack.length > 0) {
			var position = 0;
			var _g = 0, _g1 = this.file_stack;
			while(_g < _g1.length) {
				var each = _g1[_g];
				++_g;
				if(each[0] == path) return each; else position += 1;
			}
			return ["not found"];
		} else return ["null"];
	}
	,add: function(path,content,className) {
		var a = new Array();
		a[0] = path;
		a[1] = content;
		a[2] = className;
		return this.file_stack.push(a);
	}
	,__class__: FileObject
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
var Main = function() { }
$hxExpose(Main, "Main");
Main.__name__ = true;
Main.main = function() {
	new $(function() {
		Main.init();
		Utils.gui.Window.get().showDevTools();
		new $(js.Browser.document).on("core_register_plugin",null,Main.register_plugin);
		Utils.init_ui();
		Main.plugin_load_all();
		Main.plugin_load_default();
		new $(js.Browser.document).on("core_plugin_pluginManager",null,Main.plugin_manager);
	});
}
Main.init = function() {
	Main.session = new Session();
	Main.file_stack = new FileObject();
	Main.plugin_index = new Array();
	Main.plugin_activated = new Array();
}
Main.register_plugin = function(event,data) {
	var filename = js.Boot.__cast(data.get("filename") , String);
	if(filename != "plugin.sample.Dummy.js") Main.plugin_index.push(data);
}
Main.plugin_load_default = function() {
	Main.default_plugin = new Array();
	Main.default_plugin.push("plugin.boyan.ShortcutKey.js");
	Main.default_plugin.push("plugin.misterpah.BuildHxml.js");
	Main.default_plugin.push("plugin.misterpah.Editor.js");
	Main.default_plugin.push("plugin.misterpah.FileAccess.js");
	Main.default_plugin.push("plugin.misterpah.ProjectAccess.js");
	Main.default_plugin.push("plugin.misterpah.ProjectTypeFlixel.js");
	Main.default_plugin.push("plugin.misterpah.ProjectTypeOpenfl.js");
	console.log("default plugin");
	var _g = 0, _g1 = Main.default_plugin;
	while(_g < _g1.length) {
		var each = _g1[_g];
		++_g;
		Main.plugin_activated.push(each);
		var plugin_init = each + ".init";
		$(document).triggerHandler(plugin_init);
	}
}
Main.plugin_load_all = function() {
	new menu.FileMenu();
	new menu.EditMenu();
	Main.compilemenu = new menu.CompileMenu();
	var plugin_list = Utils.list_plugin();
	var _g = 0;
	while(_g < plugin_list.length) {
		var each = plugin_list[_g];
		++_g;
		Utils.loadJavascript("./plugin/" + each);
	}
}
Main.plugin_execute_init = function(event) {
	Main.modal.hide();
	var activated_plugin = new Array();
	var _g1 = 0, _g = Main.plugin_index.length;
	while(_g1 < _g) {
		var i = _g1++;
		var checkbox_checked = new $("#plugin_checkbox" + i).prop("checked");
		if(checkbox_checked == true) {
			var cur = Main.plugin_index[i];
			activated_plugin.push(cur.get("filename"));
		}
	}
	console.log(activated_plugin);
	if(activated_plugin.length >= 1) {
		var _g = 0;
		while(_g < activated_plugin.length) {
			var each = activated_plugin[_g];
			++_g;
			var plugin_init = each + ".init";
			$(document).triggerHandler(plugin_init);
		}
	}
}
Main.plugin_manager = function() {
	Main.modal = new ui.ModalDialog();
	Main.modal.title = "HIDE Plugin Manager";
	Main.modal.id = "plugin_manager";
	var retStr = "<div style='height:300px;overflow:scroll;width:100%;'>";
	retStr += ["<div class=\"panel panel-default\">"].join("\n");
	retStr += ["<table class=\"table\">","<thead>","<tr>","<th>Activate</th>","<th>Plugin Name</th>","<th>Version</th>","</tr>","</thead>"].join("\n");
	retStr += "<tbody>";
	var i = 0;
	var _g = 0, _g1 = Main.plugin_index;
	while(_g < _g1.length) {
		var each = _g1[_g];
		++_g;
		var default_plugin_loaded = $.inArray(each.get("filename"),Main.default_plugin);
		retStr += "<tr>";
		if(default_plugin_loaded == -1) retStr += "<td><input type='checkbox' id='plugin_checkbox" + i + "' value='" + i + "'></td>"; else retStr += "<td>Default</td>";
		retStr += "<td>" + Std.string(each.get("name")) + "</td>";
		retStr += "<td>" + Std.string(each.get("version")) + "</td>";
		retStr += "</tr>";
		i += 1;
	}
	retStr += "</tbody>";
	retStr += "</table>";
	retStr += ["</div>"].join("\n");
	retStr += "</div>";
	Main.modal.ok_text = "Activate Plugin";
	Main.modal.cancel_text = "Cancel";
	Main.modal.content = retStr;
	Main.modal.header = true;
	Main.modal.show();
	new $("#plugin_manager .button_ok").click(Main.plugin_execute_init);
}
var IMap = function() { }
IMap.__name__ = true;
var Session = function() {
	this.project_xml = "";
	this.project_xml_parameter = "";
	this.project_folder = "";
	this.active_file = "";
};
$hxExpose(Session, "Session");
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
var js = {}
js.Node = function() { }
js.Node.__name__ = true;
var Utils = function() { }
$hxExpose(Utils, "Utils");
Utils.__name__ = true;
Utils.getOS = function() {
	var os_type = null;
	var _g = Utils.os.type();
	switch(_g) {
	case "Windows_NT":
		os_type = Utils.WINDOWS;
		break;
	case "Linux":
		os_type = Utils.LINUX;
		break;
	default:
		os_type = Utils.OTHER;
	}
	return os_type;
}
Utils.system_dirContent = function(path) {
	return Utils.fs.readdirSync(path);
}
Utils.register_plugin = function(plugin_credentials) {
	new $(js.Browser.document).triggerHandler("core_register_plugin",[plugin_credentials]);
}
Utils.list_plugin = function() {
	var returnList = new Array();
	var list = Utils.system_dirContent("./plugin");
	var _g = 0;
	while(_g < list.length) {
		var each = list[_g];
		++_g;
		if(each.indexOf("plugin") == 0) returnList.push(each);
	}
	return returnList;
}
Utils.init_ui = function() {
	new ui.Notify();
	new ui.FileDialog("init");
	new ui.ModalDialog();
}
Utils.capitalize = function(myString) {
	return HxOverrides.substr(myString,0,1) + HxOverrides.substr(myString,1,null);
}
Utils.system_openFile = function(filename) {
	return Utils.fs.readFileSync(filename,"utf-8");
}
Utils.system_createFile = function(filename) {
	Utils.fs.openSync(filename,"a+");
}
Utils.system_saveFile = function(filename,content) {
	Utils.fs.writeFileSync(filename,content);
	console.log("SYSTEM: file saved " + filename);
}
Utils.loadJavascript = function(script) {
	$.ajaxSetup({ async : false});
	$.getScript(script);
	$.ajaxSetup({ async : true});
}
Utils.loadCss = function(css) {
	new $("head").append("<link rel='stylesheet' type='text/css' href='" + css + "'/>");
}
Utils.system_get_completion = function(position) {
	var exec_str = "";
	var join_str = "";
	var join_str_cd = "";
	var path = Main.session.active_file;
	if(Utils.getOS() == Utils.LINUX) {
		join_str = " ; ";
		join_str_cd = "";
	}
	if(Utils.getOS() == Utils.WINDOWS) {
		join_str = " & ";
		join_str_cd = " /D ";
	}
	var exec_str1 = "cd " + join_str_cd + Main.session.project_folder + join_str + "haxe " + Main.session.project_xml_parameter + " --display " + path + "@" + position;
	Utils.exec(exec_str1,function(error,stdout,stderr) {
		if(error == null) new $(js.Browser.document).triggerHandler("core_utils_getCompletion_complete",[stderr]);
	});
}
Utils.system_create_project = function(exec_str) {
	var join_str = "";
	var join_str_cd = "";
	var default_folder = "";
	if(Utils.getOS() == Utils.LINUX) {
		join_str = " ; ";
		join_str_cd = "";
		default_folder = "~/HIDE";
	}
	if(Utils.getOS() == Utils.WINDOWS) {
		join_str = " & ";
		join_str_cd = " /D ";
		default_folder = "C:/HIDE";
	}
	Utils.exec("cd " + join_str_cd + default_folder + join_str + exec_str,function(error,stdout,stderr) {
	});
}
Utils.system_compile_flash = function() {
	var join_str = "";
	var join_str_cd = "";
	var default_folder = "";
	if(Utils.getOS() == Utils.LINUX) {
		join_str = " ; ";
		join_str_cd = "";
		default_folder = "~/HIDE";
	}
	if(Utils.getOS() == Utils.WINDOWS) {
		join_str = " & ";
		join_str_cd = " /D ";
		default_folder = "C:/HIDE";
	}
	var exec_str = "openfl test flash";
	Utils.exec("cd " + join_str_cd + Main.session.project_folder + join_str + exec_str,function(error,stdout,stderr) {
	});
}
Utils.system_parse_project = function() {
	var exec_str = "";
	var filename = Main.session.project_xml;
	var temp = filename.split(".");
	var filename_ext = temp.pop();
	var projectFolder = filename.split(Utils.path.sep);
	projectFolder.pop();
	Main.session.project_folder = projectFolder.join(Utils.path.sep);
	if(filename_ext == "xml") {
		if(Utils.getOS() == Utils.WINDOWS) exec_str = "cd /D " + Main.session.project_folder + " & openfl display -hxml flash";
		if(Utils.getOS() == Utils.LINUX) exec_str = "cd " + Main.session.project_folder + " ; openfl display -hxml flash";
	}
	if(filename_ext == "hxml") {
		if(Utils.getOS() == Utils.WINDOWS) exec_str = "cd /D " + Main.session.project_folder + " & type " + filename;
		if(Utils.getOS() == Utils.LINUX) exec_str = "cd " + Main.session.project_folder + " ; cat " + filename;
	}
	console.log(exec_str);
	Utils.exec(exec_str,function(error,stdout,stderr) {
		var the_error = false;
		if(stderr != "") the_error = true;
		if(the_error == true) {
			var notify = new ui.Notify();
			notify.type = "error";
			notify.content = "not a valid HaxeFlixel Project File (XML)";
			notify.show();
			Main.session.project_xml = "";
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
			Main.session.project_xml_parameter = content_push.join(" ");
			console.log(Main.session.project_xml_parameter);
			new $(js.Browser.document).triggerHandler("core_utils_parseProject_complete");
		}
	});
}
var haxe = {}
haxe.ds = {}
haxe.ds.StringMap = function() { }
haxe.ds.StringMap.__name__ = true;
haxe.ds.StringMap.__interfaces__ = [IMap];
haxe.ds.StringMap.prototype = {
	get: function(key) {
		return this.h["$" + key];
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
var ui = {}
ui.Menu = function(_text,_headerText) {
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
ui.Menu.__name__ = true;
ui.Menu.prototype = {
	addToDocument: function() {
		var div = js.Boot.__cast(js.Browser.document.getElementById("position-navbar") , Element);
		div.appendChild(this.li);
	}
	,addSeparator: function() {
		this.ul.appendChild(new ui.Separator().getElement());
	}
	,addMenuItem: function(_text,_onClickFunctionName,_onClickFunction,_hotkey) {
		this.ul.appendChild(new ui.MenuButtonItem(_text,_onClickFunctionName,_onClickFunction,_hotkey).getElement());
	}
	,__class__: ui.Menu
}
var menu = {}
menu.CompileMenu = function() {
	ui.Menu.call(this,"Compile");
	this.create_ui();
};
menu.CompileMenu.__name__ = true;
menu.CompileMenu.__super__ = ui.Menu;
menu.CompileMenu.prototype = $extend(ui.Menu.prototype,{
	create_ui: function() {
		this.addMenuItem("Flash","core_compileTo_flash",Utils.system_compile_flash,"F5");
		this.addToDocument();
	}
	,__class__: menu.CompileMenu
});
menu.EditMenu = function() {
	ui.Menu.call(this,"Edit");
	this.create_ui();
};
menu.EditMenu.__name__ = true;
menu.EditMenu.__super__ = ui.Menu;
menu.EditMenu.prototype = $extend(ui.Menu.prototype,{
	create_ui: function() {
		this.addMenuItem("HIDE Plugin","core_plugin_pluginManager",null,null);
		this.addToDocument();
	}
	,__class__: menu.EditMenu
});
menu.FileMenu = function() {
	ui.Menu.call(this,"File");
	this.create_ui();
};
menu.FileMenu.__name__ = true;
menu.FileMenu.__super__ = ui.Menu;
menu.FileMenu.prototype = $extend(ui.Menu.prototype,{
	create_ui: function() {
		this.addMenuItem("New Project...","core_project_newProject",null,"Ctrl-Shift-N");
		this.addMenuItem("Open Project...","core_project_openProject",null,"Ctrl-Shift-O");
		this.addMenuItem("Close Project...","core_project_closeProject",null);
		this.addSeparator();
		this.addMenuItem("New File...","core_file_newFile",null,"Ctrl-N");
		this.addMenuItem("Open File...","core_file_openFile",null,"Ctrl-O");
		this.addMenuItem("Save","core_file_save",null,"Ctrl-S");
		this.addMenuItem("Close File","core_file_close",null,"Ctrl-W");
		this.addSeparator();
		this.addMenuItem("Exit","core_exit",function() {
			window.close();
		},"Alt-F4");
		this.addToDocument();
	}
	,__class__: menu.FileMenu
});
ui.FileDialog = function(event_name,saveAs) {
	if(saveAs == null) saveAs = false;
	if(saveAs == false) new $("#temp").html("<input id='temp_fileDialog' type='file' />"); else new $("#temp").html("<input id='temp_fileDialog' type='file' nwsaveas />");
	if(event_name != "init") {
		var chooser = new $("#temp_fileDialog");
		chooser.change(function(evt) {
			var filepath = chooser.val();
			$(document).triggerHandler(event_name,filepath);
		});
		chooser.trigger("click");
	}
};
$hxExpose(ui.FileDialog, "ui.FileDialog");
ui.FileDialog.__name__ = true;
ui.FileDialog.prototype = {
	__class__: ui.FileDialog
}
ui.MenuItem = function() { }
$hxExpose(ui.MenuItem, "ui.MenuItem");
ui.MenuItem.__name__ = true;
ui.MenuItem.prototype = {
	__class__: ui.MenuItem
}
ui.MenuButtonItem = function(_text,_onClickFunctionName,_onClickFunction,_hotkey) {
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
	a.setAttribute("onclick","$(document).triggerHandler(\"" + _onClickFunctionName + "\");");
	a.innerText = _text;
	if(span != null) a.appendChild(span);
	this.li.appendChild(a);
	this.registerEvent(_onClickFunctionName,_onClickFunction);
};
$hxExpose(ui.MenuButtonItem, "ui.MenuButtonItem");
ui.MenuButtonItem.__name__ = true;
ui.MenuButtonItem.__interfaces__ = [ui.MenuItem];
ui.MenuButtonItem.prototype = {
	registerEvent: function(_onClickFunctionName,_onClickFunction) {
		if(_onClickFunction != null) new $(js.Browser.document).on(_onClickFunctionName,_onClickFunction);
	}
	,getElement: function() {
		return this.li;
	}
	,__class__: ui.MenuButtonItem
}
ui.Separator = function() {
	this.li = js.Browser.document.createElement("li");
	this.li.className = "divider";
};
ui.Separator.__name__ = true;
ui.Separator.__interfaces__ = [ui.MenuItem];
ui.Separator.prototype = {
	getElement: function() {
		return this.li;
	}
	,__class__: ui.Separator
}
ui.ModalDialog = function() {
	this.title = "";
	this.id = "";
	this.content = "";
	this.header = true;
	this.footer = true;
	this.ok_text = "";
	this.cancel_text = "";
};
$hxExpose(ui.ModalDialog, "ui.ModalDialog");
ui.ModalDialog.__name__ = true;
ui.ModalDialog.prototype = {
	hide: function() {
		new $("#" + this.id).modal("hide");
	}
	,show: function() {
		var _g = this;
		this.updateModalDialog();
		new $("#" + this.id).modal("show");
		new $("#" + this.id).on("hidden.bs.modal",null,function() {
			new $("#" + _g.id).remove();
		});
	}
	,updateModalDialog: function() {
		var retStr = ["<div class='modal fade' id='" + this.id + "' tabindex='-1' role='dialog' aria-labelledby='myModalLabel' aria-hidden='true'>","<div class='modal-dialog'>","<div class='modal-content'>"].join("\n");
		if(this.header == true) retStr += ["<div class='modal-header'>","<button type='button' class='close' data-dismiss='modal' aria-hidden='true'>&times;</button>","<h4 class='modal-title'>" + this.title + "</h4>","</div>"].join("\n");
		retStr += ["<div class='modal-body'>",this.content,"</div>"].join("\n");
		if(this.footer == true) retStr += ["<div class='modal-footer'>","<button type='button' class='btn btn-default' data-dismiss='modal'>" + this.cancel_text + "</button>","<button type='button' class='btn btn-primary button_ok'>" + this.ok_text + "</button>","</div>"].join("\n");
		retStr += ["</div>","</div>","</div>"].join("\n");
		new $("#modal_position").html(retStr);
		new $("#style_overide").append("<style>.modal{overflow:hidden}</style>");
	}
	,__class__: ui.ModalDialog
}
ui.Notify = function() {
	this.type = "";
	this.content = "";
};
$hxExpose(ui.Notify, "ui.Notify");
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
Utils.sys = js.Node.require("sys");
Utils.gui = js.Node.require("nw.gui");
Utils.window = Utils.gui.Window.get();
Utils.WINDOWS = 0;
Utils.LINUX = 1;
Utils.OTHER = 2;
js.Browser.document = typeof window != "undefined" ? window.document : null;
Main.main();
function $hxExpose(src, path) {
	var o = typeof window != "undefined" ? window : exports;
	var parts = path.split(".");
	for(var ii = 0; ii < parts.length-1; ++ii) {
		var p = parts[ii];
		if(typeof o[p] == "undefined") o[p] = {};
		o = o[p];
	}
	o[parts[parts.length-1]] = src;
}
})();

//@ sourceMappingURL=ide.js.map