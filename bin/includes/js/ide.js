(function () { "use strict";
function $extend(from, fields) {
	function inherit() {}; inherit.prototype = from; var proto = new inherit();
	for (var name in fields) proto[name] = fields[name];
	if( fields.toString !== Object.prototype.toString ) proto.toString = fields.toString;
	return proto;
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
		Main.pluginManager();
	});
}
Main.init = function() {
	Main.session = new haxe.ds.StringMap();
	Main.session.set("project_xml","");
	Main.session.set("project_xml_parameter","");
	Main.session.set("project_folder","");
	Main.session.set("active_file","");
	Main.settings = new haxe.ds.StringMap();
	Main.opened_file_stack = new haxe.ds.StringMap();
}
Main.pluginManager = function() {
	Utils.gui.Window.get().showDevTools();
	new plugin.FileMenu();
	new plugin.NewProject();
	new plugin.CompileMenu();
	new plugin.misterpah.Editor();
	new plugin.misterpah.CompileTo();
	new plugin.misterpah.FileAccess();
	new plugin.misterpah.ProjectAccess();
	new plugin.misterpah.Keyboardshortcut();
	new plugin.misterpah.ProjectTypeFlixel();
	new plugin.misterpah.ProjectTypeOpenFL();
}
var IMap = function() { }
IMap.__name__ = true;
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
Utils.system_openFile = function(filename) {
	return Utils.fs.readFileSync(filename,"utf-8");
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
	var path = Main.session.get("active_file");
	var file_obj = Main.opened_file_stack.get(path);
	if(Utils.getOS() == 1) {
		join_str = " ; ";
		join_str_cd = "";
	}
	if(Utils.getOS() == 0) {
		join_str = " & ";
		join_str_cd = " /D ";
	}
	var exec_str1 = "cd " + join_str_cd + Main.session.get("project_folder") + join_str + "haxe " + Main.session.get("project_xml_parameter") + " --display " + path + "@" + position;
	console.log(exec_str1);
	Utils.exec(exec_str1,function(error,stdout,stderr) {
		console.log(error);
		if(error == null) new $(js.Browser.document).triggerHandler("core_utils_getCompletion_complete",[stderr]);
	});
}
Utils.system_create_project = function(exec_str) {
	var join_str = "";
	var join_str_cd = "";
	var default_folder = "";
	if(Utils.getOS() == 1) {
		join_str = " ; ";
		join_str_cd = "";
		default_folder = "~/HIDE";
	}
	if(Utils.getOS() == 0) {
		join_str = " & ";
		join_str_cd = " /D ";
		default_folder = "C:/HIDE";
	}
	Utils.exec("cd " + join_str_cd + default_folder + join_str + exec_str,function(error,stdout,stderr) {
		console.log(error);
		console.log(stdout);
		console.log(stderr);
	});
}
Utils.system_parse_project = function() {
	var exec_str = "";
	var filename = Main.session.get("project_xml");
	var projectFolder = filename.split(Utils.path.sep);
	projectFolder.pop();
	var v = projectFolder.join(Utils.path.sep);
	Main.session.set("project_folder",v);
	v;
	if(Utils.getOS() == 0) exec_str = "cd /D " + Main.session.get("project_folder") + " & openfl display -hxml flash";
	if(Utils.getOS() == 1) exec_str = "cd " + Main.session.get("project_folder") + " ; openfl display -hxml flash";
	console.log(exec_str);
	Utils.exec(exec_str,function(error,stdout,stderr) {
		var the_error = false;
		if(stderr != "") the_error = true;
		if(the_error == true) {
			var notify = new ui.Notify();
			notify.type = "error";
			notify.content = "not a valid HaxeFlixel Project File (XML)";
			notify.show();
			Main.session.set("project_xml","");
			"";
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
			var v = content_push.join(" ");
			Main.session.set("project_xml_parameter",v);
			v;
			console.log(Main.session.get("project_xml_parameter"));
			new $(js.Browser.document).triggerHandler("core_utils_parseProject_complete");
		}
	});
}
var haxe = {}
haxe.ds = {}
haxe.ds.StringMap = function() {
	this.h = { };
};
haxe.ds.StringMap.__name__ = true;
haxe.ds.StringMap.__interfaces__ = [IMap];
haxe.ds.StringMap.prototype = {
	remove: function(key) {
		key = "$" + key;
		if(!this.h.hasOwnProperty(key)) return false;
		delete(this.h[key]);
		return true;
	}
	,get: function(key) {
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
var plugin = {}
plugin.CompileMenu = function() {
	ui.Menu.call(this,"Compile");
	this.create_ui();
};
plugin.CompileMenu.__name__ = true;
plugin.CompileMenu.__super__ = ui.Menu;
plugin.CompileMenu.prototype = $extend(ui.Menu.prototype,{
	create_ui: function() {
		this.addMenuItem("Flash","core_compileTo_flash",null,null);
		this.addToDocument();
	}
	,__class__: plugin.CompileMenu
});
plugin.FileMenu = function() {
	ui.Menu.call(this,"File");
	this.create_ui();
};
plugin.FileMenu.__name__ = true;
plugin.FileMenu.__super__ = ui.Menu;
plugin.FileMenu.prototype = $extend(ui.Menu.prototype,{
	create_ui: function() {
		this.addMenuItem("New Project...","core_project_newProject",null,"Ctrl-Shift-N");
		this.addMenuItem("Open Project...","core_project_openProject",null,"Ctrl-Shift-O");
		this.addMenuItem("Project Properties","core_project_projectProperties",null);
		this.addMenuItem("Close Project...","core_project_closeProject",null);
		this.addSeparator();
		this.addMenuItem("New File...","core_file_newFile",null,"Ctrl-N");
		this.addMenuItem("Open File...","core_file_openFile",null,"Ctrl-O");
		this.addMenuItem("Save","core_file_save",null,"Ctrl-S");
		this.addMenuItem("Save as...","core_file_saveAs",null,"Ctrl-Shift-S");
		this.addMenuItem("Save all","core_file_saveAll",null);
		this.addMenuItem("Close File","core_file_close",null,"Ctrl-W");
		this.addSeparator();
		this.addMenuItem("Exit","core_exit",null,"Alt-F4");
		this.addToDocument();
	}
	,__class__: plugin.FileMenu
});
plugin.NewProject = function() {
	this.registered_type = new Array();
	this.register_hook();
};
plugin.NewProject.__name__ = true;
plugin.NewProject.prototype = {
	new_project_ui: function() {
		var _g = this;
		var retStr = "";
		retStr += "<div class=\"row\">";
		var _g1 = 0, _g2 = this.registered_type.length;
		while(_g1 < _g2) {
			var each = _g1++;
			var cur = this.registered_type[each];
			console.log(cur.get("plugin_name"));
			retStr += ["<div class=\"col-xs-2\">","<label>","<img width=64 class=\"img-rounded\" src=\"" + cur.get("plugin_image") + "\" />","<p class=\"text-center\"><input type=\"radio\" name=\"NewProject_radio\" value=\"" + cur.get("plugin_name") + "\" /><br/>" + cur.get("plugin_name") + "</p>","</label>","</div>"].join("\n");
		}
		retStr += "</div>";
		var radio_plugin_name = new Array();
		var _g1 = 0, _g2 = this.registered_type.length;
		while(_g1 < _g2) {
			var each = _g1++;
			var cur = this.registered_type[each];
			retStr += ["<div id=\"radio_" + cur.get("plugin_name") + "\" style=\"display:none;\">","<h2>" + cur.get("plugin_name") + "</h2>","<p>" + cur.get("plugin_description") + "</p>","<p><b>Help:</b> " + cur.get("plugin_help") + "</p>","<p><b>This will execute:</b> " + cur.get("plugin_execute") + "</p>","<p><b>With optional parameter:</b> <input style=\"width:100%;\" id=\"optional_" + cur.get("plugin_name") + "\" value=\"" + cur.get("plugin_extraParam") + "\" /></p>","</div>"].join("\n");
			radio_plugin_name.push("radio_" + cur.get("plugin_name"));
		}
		retStr += "<br/>";
		retStr += "<button style=\"display:none;\" id=\"NewProject_submit\" type=\"button\" class=\"btn btn-primary btn-lg btn-block\">Create Project</button>";
		var dialog = new ui.ModalDialog();
		dialog.title = "New Project";
		dialog.id = "new_project_modal_id";
		dialog.content = retStr;
		dialog.header = true;
		dialog.footer = false;
		dialog.show();
		new $("input[name='NewProject_radio']").on("click",null,function() {
			new $("#NewProject_submit").css("display","block");
			var _g1 = 0, _g2 = radio_plugin_name.length;
			while(_g1 < _g2) {
				var each = _g1++;
				new $("#" + radio_plugin_name[each]).css("display","none");
			}
			var selected = new $("input[name='NewProject_radio']:checked").val();
			new $("#radio_" + Std.string(selected)).css("display","block");
		});
		new $("#NewProject_submit").on("click",null,function() {
			var selected = new $("input[name='NewProject_radio']:checked").val();
			var _g2 = 0, _g1 = _g.registered_type.length;
			while(_g2 < _g1) {
				var each = _g2++;
				var cur = _g.registered_type[each];
				if(selected == cur.get("plugin_name")) {
					var execute = cur.get("plugin_execute");
					var optional = new $("#optional_" + Std.string(cur.get("plugin_name"))).val();
					Utils.system_create_project(Std.string(execute) + " " + Std.string(optional));
					dialog.hide();
				}
			}
		});
	}
	,registerNewType: function(event,data) {
		this.registered_type.push(data);
	}
	,register_hook: function() {
		new $(js.Browser.document).on("core_project_newProject",null,$bind(this,this.new_project_ui));
		new $(js.Browser.document).on("core_project_registerNewTypeProject",null,$bind(this,this.registerNewType));
	}
	,__class__: plugin.NewProject
}
plugin.misterpah = {}
plugin.misterpah.CompileTo = function() {
	this.register_hook();
};
plugin.misterpah.CompileTo.__name__ = true;
plugin.misterpah.CompileTo.prototype = {
	compile_to_flash: function() {
		var exec_str = "";
		var join_str = "";
		var join_str_cd = "";
		var path = Main.session.get("project_xml");
		if(Utils.getOS() == 1) {
			join_str = " ; ";
			join_str_cd = "";
		}
		if(Utils.getOS() == 0) {
			join_str = " & ";
			join_str_cd = " /D ";
		}
		var exec_str1 = "cd " + join_str_cd + Main.session.get("project_folder") + join_str + " openfl test flash";
		console.log(exec_str1);
		Utils.exec(exec_str1,function(error,stdout,stderr) {
			console.log(error);
			console.log(stdout);
			console.log(stderr);
		});
	}
	,register_hook: function() {
		new $(js.Browser.document).on("core_compileTo_flash",null,$bind(this,this.compile_to_flash));
	}
	,__class__: plugin.misterpah.CompileTo
}
plugin.misterpah.Editor = function() {
	this.tab_index = new Array();
	this.completion_list = new Array();
	Utils.loadJavascript("./plugin/misterpah/codemirror-3.18/lib/codemirror.js");
	Utils.loadJavascript("./plugin/misterpah/codemirror-3.18/mode/haxe/haxe.js");
	Utils.loadJavascript("./plugin/misterpah/jquery.xml2json.js");
	Utils.loadJavascript("./plugin/misterpah/show-hint-3.15.js");
	Utils.loadCss("./plugin/misterpah/codemirror-3.18/lib/codemirror.css");
	Utils.loadCss("./plugin/misterpah/show-hint-custom.css");
	this.create_ui();
	this.register_hooks();
};
plugin.misterpah.Editor.__name__ = true;
plugin.misterpah.Editor.prototype = {
	show_tab: function(path,tabShow) {
		if(tabShow == null) tabShow = true;
		var tab_number = Lambda.indexOf(this.tab_index,path);
		var file_obj = Main.opened_file_stack.get(path);
		Main.session.set("active_file",path);
		this.cm.setOption("value",file_obj.get("content"));
		if(tabShow == true) $("#misterpah_editor_tabs_position li:eq(" + tab_number + ") a").tab("show");
		new $("#misterpah_editor_cm_position").css("display","block");
	}
	,make_tab: function() {
		var path = Main.session.get("active_file");
		var file_obj = Main.opened_file_stack.get(path);
		this.tab_index.push(path);
		new $("#misterpah_editor_tabs_position ul").append("<li><a data-path='" + path + "' data-toggle='tab'>" + file_obj.get("className") + "</a></li>");
		this.show_tab(path);
		this.cm.setOption("value",file_obj.get("content"));
		this.editor_resize();
	}
	,editor_resize: function() {
		var win = Utils.gui.Window.get();
		var win_height = js.Boot.__cast(win.height , Int);
		var doc_height = new $(js.Browser.document).height();
		var nav_height = new $(".nav").height();
		var tab_height = new $("#misterpah_editor_tabs_position").height();
		new $(".CodeMirror").css("height",win_height - nav_height - tab_height - 38 + "px");
	}
	,simpleCompletion: function(cm) {
		var cur = cm.getCursor();
		var start = cur.ch;
		var end = start;
		return { list : this.completion_list, from : cur, to : cur};
	}
	,register_hooks: function() {
		var _g = this;
		new $(js.Browser.document).on("show.bs.tab",null,function(e) {
			var target = new $(e.target);
			_g.show_tab(target.attr("data-path"),false);
		});
		new $(js.Browser.document).on("plugin_misterpah_fileAccess_openFile_complete",null,function() {
			new $("#editor_position").css("display","block");
			_g.make_tab();
		});
		new $(js.Browser.window).on("resize",null,function() {
			_g.editor_resize();
		});
		new $(js.Browser.document).on("core_utils_getCompletion_complete",null,function(event,data) {
			var completion_array = $.xml2json(data);
			_g.completion_list = new Array();
			if(completion_array.i == null) {
			} else {
				var _g2 = 0, _g1 = completion_array.i.length;
				while(_g2 < _g1) {
					var each = _g2++;
					_g.completion_list.push(completion_array.i[each].n);
				}
			}
			CodeMirror.showHint(_g.cm,$bind(_g,_g.simpleCompletion));
		});
	}
	,create_ui: function() {
		new $("#editor_position").css("display","none");
		new $("#editor_position").append("<div style='margin-top:10px;' id='misterpah_editor_tabs_position'><ul class='nav nav-tabs'></ul></div>");
		new $("#editor_position").append("<div id='misterpah_editor_cm_position'></div>");
		new $("#misterpah_editor_cm_position").append("<textarea style='display:none;' name='misterpah_editor_cm_name' id='misterpah_editor_cm'></textarea>");
		this.cm = CodeMirror.fromTextArea(js.Browser.document.getElementById("misterpah_editor_cm"),{ lineNumbers : true, matchBrackets : true, autoCloseBrackets : true, mode : "haxe"});
		CodeMirror.on(this.cm,"change",function(cm) {
			var path = Main.session.get("active_file");
			if(path == "") {
				console.log("ignore");
				return;
			}
			var file_obj = Main.opened_file_stack.get(path);
			file_obj.set("content",cm.getValue());
			Main.opened_file_stack.set(path,file_obj);
			var cursor_pos = cm.indexFromPos(cm.getCursor());
			if(cm.getValue().charAt(cursor_pos - 1) == ".") {
				new $(js.Browser.document).triggerHandler("core_file_save");
				Utils.system_get_completion(cursor_pos);
			}
		});
		this.editor_resize();
		CodeMirror.registerHelper("hint","haxe",$bind(this,this.simpleCompletion));
	}
	,__class__: plugin.misterpah.Editor
}
plugin.misterpah.FileAccess = function() {
	this.register_hooks();
};
plugin.misterpah.FileAccess.__name__ = true;
plugin.misterpah.FileAccess.prototype = {
	close_file: function() {
		var path = Main.session.get("active_file");
		Main.opened_file_stack.remove(path);
		new $(js.Browser.document).triggerHandler("plugin_misterpah_fileAccess_closeFile_complete");
	}
	,save_file: function() {
		var path = Main.session.get("active_file");
		var file_obj = Main.opened_file_stack.get(path);
		Utils.system_saveFile(path,file_obj.get("content"));
	}
	,openFileHandler: function(path) {
		if(Main.opened_file_stack.get(path) == null) {
			var content = Utils.system_openFile(path);
			var fileObj = new haxe.ds.StringMap();
			fileObj.set("content",content);
			var filename_split = path.split(Utils.path.sep);
			var className = filename_split[filename_split.length - 1].split(".")[0];
			fileObj.set("className",className);
			Main.opened_file_stack.set(path,fileObj);
			Main.session.set("active_file",path);
			new $(js.Browser.document).triggerHandler("plugin_misterpah_fileAccess_openFile_complete");
		}
	}
	,open_file: function() {
		new ui.FileDialog($bind(this,this.openFileHandler));
	}
	,new_file: function() {
		console.log("new_file bebeh");
	}
	,register_hooks: function() {
		new $(js.Browser.document).on("core_file_newFile",null,$bind(this,this.new_file));
		new $(js.Browser.document).on("core_file_openFile",null,$bind(this,this.open_file));
		new $(js.Browser.document).on("core_file_save",null,$bind(this,this.save_file));
		new $(js.Browser.document).on("core_file_close",null,$bind(this,this.close_file));
	}
	,__class__: plugin.misterpah.FileAccess
}
plugin.misterpah.Keyboardshortcut = function() {
	this.register_hooks();
};
plugin.misterpah.Keyboardshortcut.__name__ = true;
plugin.misterpah.Keyboardshortcut.prototype = {
	register_shortcutKey: function() {
		jwerty.key("ctrl+N",function() {
			$(document).triggerHandler("core_file_newFile");
		});
		jwerty.key("ctrl+O",function() {
			$(document).triggerHandler("core_file_openFile");
		});
		jwerty.key("ctrl+S",function() {
			$(document).triggerHandler("core_file_save");
		});
		jwerty.key("ctrl+W",function() {
			$(document).triggerHandler("core_file_close");
		});
		jwerty.key("ctrl+shift+O",function() {
			$(document).triggerHandler("core_project_openProject");
		});
	}
	,register_hooks: function() {
		Utils.loadJavascript("./plugin/misterpah/jwerty.js");
		this.register_shortcutKey();
	}
	,__class__: plugin.misterpah.Keyboardshortcut
}
plugin.misterpah.ProjectAccess = function() {
	this.register_hooks();
};
plugin.misterpah.ProjectAccess.__name__ = true;
plugin.misterpah.ProjectAccess.prototype = {
	close_project: function() {
	}
	,openFileHandler: function(path) {
		Main.session.set("project_xml",path);
		path;
		Utils.system_parse_project();
		console.log(Main.session);
	}
	,open_project: function() {
		new ui.FileDialog($bind(this,this.openFileHandler));
	}
	,register_hooks: function() {
		new $(js.Browser.document).on("core_project_openProject",null,$bind(this,this.open_project));
		new $(js.Browser.document).on("core_project_closeProject",null,$bind(this,this.close_project));
	}
	,__class__: plugin.misterpah.ProjectAccess
}
plugin.misterpah.ProjectTypeFlixel = function() {
	var parameter = new haxe.ds.StringMap();
	parameter.set("plugin_name","Flixel");
	parameter.set("plugin_description","HaxeFlixel is a 2D game framework built with OpenFL and Haxe that delivers cross platform games, completely free for personal and commercial use.");
	parameter.set("plugin_help","change <i>project_name</i> in <b>optional parameter</b> to your project name.");
	parameter.set("plugin_image","./plugin/misterpah/img/flixel.png");
	parameter.set("plugin_execute","haxelib run flixel new");
	parameter.set("plugin_extraParam","-name project_name");
	this.parameter_wrap = new Array();
	this.parameter_wrap.push(parameter);
	this.register_hook();
};
plugin.misterpah.ProjectTypeFlixel.__name__ = true;
plugin.misterpah.ProjectTypeFlixel.prototype = {
	register_hook: function() {
		new $(js.Browser.document).triggerHandler("core_project_registerNewTypeProject",this.parameter_wrap);
	}
	,__class__: plugin.misterpah.ProjectTypeFlixel
}
plugin.misterpah.ProjectTypeOpenFL = function() {
	var parameter = new haxe.ds.StringMap();
	parameter.set("plugin_name","OpenFL");
	parameter.set("plugin_description","OpenFL is a software development kit that provides an environment for building fast, native games and applications for iOS, Android, BlackBerry, Windows, Mac, Linux, Flash and HTML5.");
	parameter.set("plugin_help","change project_name to your project name.");
	parameter.set("plugin_image","./plugin/misterpah/img/openfl.png");
	parameter.set("plugin_execute","openfl create project");
	parameter.set("plugin_extraParam","project_name");
	this.parameter_wrap = new Array();
	this.parameter_wrap.push(parameter);
	this.register_hook();
};
plugin.misterpah.ProjectTypeOpenFL.__name__ = true;
plugin.misterpah.ProjectTypeOpenFL.prototype = {
	register_hook: function() {
		new $(js.Browser.document).triggerHandler("core_project_registerNewTypeProject",this.parameter_wrap);
	}
	,__class__: plugin.misterpah.ProjectTypeOpenFL
}
ui.FileDialog = function(_onClick) {
	new $("#temp").html("<input id='temp_fileDialog' type='file' />");
	new $("#temp_fileDialog").click();
	new $("#temp_fileDialog").on("change",null,function() {
		_onClick(new $("#temp_fileDialog").val());
	});
	new $("#temp").html();
};
ui.FileDialog.__name__ = true;
ui.FileDialog.prototype = {
	__class__: ui.FileDialog
}
ui.MenuItem = function() { }
ui.MenuItem.__name__ = true;
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
function $iterator(o) { if( o instanceof Array ) return function() { return HxOverrides.iter(o); }; return typeof(o.iterator) == 'function' ? $bind(o,o.iterator) : o.iterator; };
var $_, $fid = 0;
function $bind(o,m) { if( m == null ) return null; if( m.__id__ == null ) m.__id__ = $fid++; var f; if( o.hx__closures__ == null ) o.hx__closures__ = {}; else f = o.hx__closures__[m.__id__]; if( f == null ) { f = function(){ return f.method.apply(f.scope, arguments); }; f.scope = o; f.method = m; o.hx__closures__[m.__id__] = f; } return f; };
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
js.Browser.window = typeof window != "undefined" ? window : null;
js.Browser.document = typeof window != "undefined" ? window.document : null;
Main.main();
})();
