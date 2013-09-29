(function () { "use strict";
function $extend(from, fields) {
	function inherit() {}; inherit.prototype = from; var proto = new inherit();
	for (var name in fields) proto[name] = fields[name];
	if( fields.toString !== Object.prototype.toString ) proto.toString = fields.toString;
	return proto;
}
var _Either = {}
_Either.Either_Impl_ = function() { }
_Either.Either_Impl_.__name__ = true;
var Main = function() { }
Main.__name__ = true;
Main.main = function() {
	new $(function() {
		Main.init();
		Main.initCorePlugin();
	});
}
Main.init = function() {
	Main.session = new Session();
	Main.editors = new haxe.ds.StringMap();
	Main.tabs = [];
	Main.settings = new haxe.ds.StringMap();
}
Main.initCorePlugin = function() {
	Main.initMenu();
}
Main.initMenu = function() {
	new ui.menu.FileMenu();
	new ui.menu.ProjectMenu();
}
var IMap = function() { }
IMap.__name__ = true;
var Session = function() {
	this.current_active_file = "";
	this.current_project_folder = "";
	this.current_project_xml = "";
};
Session.__name__ = true;
Session.prototype = {
	__class__: Session
}
var core = {}
core.FileAccess = function() { }
core.FileAccess.__name__ = true;
core.FileAccess.init = function() {
}
core.FileAccess.createNewFile = function() {
	if(Main.session.current_project_xml == "") console.log("open project first"); else console.log("create a new file");
}
core.FileAccess.openFile = function() {
	if(Main.session.current_project_xml == "") console.log("open project first"); else console.log("open a file");
}
core.FileAccess.saveActiveFile = function() {
	if(Main.session.current_project_xml == "") console.log("open project first"); else console.log("save active file");
}
core.FileAccess.closeActiveFile = function() {
	if(Main.session.current_project_xml == "") console.log("open project first"); else console.log("close active file");
}
core.ProjectAccess = function() { }
core.ProjectAccess.__name__ = true;
core.ProjectAccess.createNewProject = function() {
	console.log("create a new project");
	var notify = new ui.Notify();
	notify.type = "error";
	notify.content = "Just to test notify!";
	notify.show();
	var modal = new ui.Modal();
	modal.id = "projectAccess_new";
	modal.title = "New Project";
	modal.content = "this is just a sample";
	modal.ok_text = "Create";
	modal.cancel_text = "Cancel";
	modal.show();
	new $("#projectAccess_new .button_ok").on("click",null,function() {
		console.log("you've clicked the OK button");
	});
}
core.ProjectAccess.openProject = function() {
	console.log("open a project");
	var modal = new ui.Modal();
	modal.id = "projectAccess_openProject";
	modal.title = "Open Project";
	modal.content = "<input id=\"ProjectAccess_openProject_file\" type=\"file\" />";
	modal.ok_text = "Open";
	modal.cancel_text = "Cancel";
	modal.show();
	var file_input = new $("#ProjectAccess_openProject_file");
	file_input.click();
	file_input.change(function(event) {
		if(file_input.val() != "") {
			Main.session.current_project_xml = file_input.val();
			modal.hide();
			core.ProjectAccess.parseProject();
		}
	});
}
core.ProjectAccess.parseProject = function() {
	console.log("parse the project");
	var test_extension = Main.session.current_project_xml.split(".");
	console.log(test_extension);
}
core.ProjectAccess.configureProject = function() {
	console.log("configure project");
}
core.ProjectAccess.closeProject = function() {
	console.log("close project");
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
var js = {}
js.Boot = function() { }
js.Boot.__name__ = true;
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
ui.Modal = function() {
	this.title = "";
	this.id = "";
	this.content = "";
	this.ok_text = "";
	this.cancel_text = "";
};
ui.Modal.__name__ = true;
ui.Modal.prototype = {
	hide: function() {
		new $("#" + this.id).modal("hide");
	}
	,show: function() {
		var _g = this;
		var retStr = ["<div class='modal fade' id='" + this.id + "' tabindex='-1' role='dialog' aria-labelledby='myModalLabel' aria-hidden='true'>","<div class='modal-dialog'>","<div class='modal-content'>","<div class='modal-header'>","<button type='button' class='close' data-dismiss='modal' aria-hidden='true'>&times;</button>","<h4 class='modal-title'>" + this.title + "</h4>","</div>","<div class='modal-body'>",this.content,"</div>","<div class='modal-footer'>","<button type='button' class='btn btn-default' data-dismiss='modal'>" + this.cancel_text + "</button>","<button type='button' class='btn btn-primary button_ok'>" + this.ok_text + "</button>","</div>","</div>","</div>","</div>"].join("\n");
		new $("#modal_position").html(retStr);
		new $("#" + this.id).modal("show");
		new $("#" + this.id).on("hidden.bs.modal",null,function() {
			new $("#" + _g.id).remove();
		});
	}
	,__class__: ui.Modal
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
		var retStr = ["<li class='dropdown'>","<a href='#' class='dropdown-toggle' data-toggle='dropdown'>" + this.text + "</a>","<ul class='dropdown-menu'>","<li class='dropdown-header'>" + this.headerText + "</li>"].join("\n");
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
	,addMenuItem: function(_text,_onClickFunctionName,_onClickFunction) {
		this.items.push(new ui.menu.basic.MenuItem(_text,_onClickFunctionName,_onClickFunction));
	}
	,__class__: ui.menu.basic.Menu
}
ui.menu.FileMenu = function() {
	ui.menu.basic.Menu.call(this,"File","File Management");
	this.createUI();
};
ui.menu.FileMenu.__name__ = true;
ui.menu.FileMenu.__super__ = ui.menu.basic.Menu;
ui.menu.FileMenu.prototype = $extend(ui.menu.basic.Menu.prototype,{
	createUI: function() {
		this.addMenuItem("New","component_fileAccess_new",core.FileAccess.createNewFile);
		this.addMenuItem("Open","component_fileAccess_open",core.FileAccess.openFile);
		this.addMenuItem("Save","component_fileAccess_save",core.FileAccess.saveActiveFile);
		this.addMenuItem("Close","component_fileAccess_close",core.FileAccess.closeActiveFile);
		this.addToDocument();
	}
	,__class__: ui.menu.FileMenu
});
ui.menu.ProjectMenu = function() {
	ui.menu.basic.Menu.call(this,"Project","Project Management");
	this.createUI();
};
ui.menu.ProjectMenu.__name__ = true;
ui.menu.ProjectMenu.__super__ = ui.menu.basic.Menu;
ui.menu.ProjectMenu.prototype = $extend(ui.menu.basic.Menu.prototype,{
	createUI: function() {
		this.addMenuItem("New","component_projectAccess_new",core.ProjectAccess.createNewProject);
		this.addMenuItem("Open","component_projectAccess_open",core.ProjectAccess.openProject);
		this.addMenuItem("Configure","component_projectAccess_configure",core.ProjectAccess.configureProject);
		this.addMenuItem("Close","component_projectAccess_close",core.ProjectAccess.closeProject);
		this.addToDocument();
	}
	,__class__: ui.menu.ProjectMenu
});
ui.menu.basic.MenuItem = function(_text,_onClickFunctionName,_onClickFunction) {
	this.text = _text;
	this.onClickFunctionName = _onClickFunctionName;
	this.onClickFunction = _onClickFunction;
};
ui.menu.basic.MenuItem.__name__ = true;
ui.menu.basic.MenuItem.prototype = {
	registerEvent: function() {
		if(this.onClickFunction != null) new $(js.Browser.document).on(this.onClickFunctionName,null,this.onClickFunction);
	}
	,getCode: function() {
		return "<li><a onclick='$(document).triggerHandler(\"" + this.onClickFunctionName + "\");'>" + this.text + "</a></li>";
	}
	,__class__: ui.menu.basic.MenuItem
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
js.Browser.document = typeof window != "undefined" ? window.document : null;
Main.main();
})();
