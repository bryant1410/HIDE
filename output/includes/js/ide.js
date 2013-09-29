(function () { "use strict";
var _Either = {}
_Either.Either_Impl_ = function() { }
_Either.Either_Impl_.__name__ = true;
var Main = function() { }
Main.__name__ = true;
Main.main = function() {
	new $(function() {
		Main.init();
		Main.editor_basic_plugin();
	});
}
Main.init = function() {
	Main.session = new haxe.ds.StringMap();
	Main.session.set("current_project_xml","");
	Main.session.set("current_project_folder","");
	Main.session.set("current_active_file","");
	Main.editors = new haxe.ds.StringMap();
	Main.tabs = [];
	Main.settings = new haxe.ds.StringMap();
}
Main.editor_basic_plugin = function() {
	component.FileAccess.init();
	component.ProjectAccess.init();
}
var IMap = function() { }
IMap.__name__ = true;
var component = {}
component.FileAccess = function() { }
component.FileAccess.__name__ = true;
component.FileAccess.init = function() {
	component.FileAccess.ui();
	component.FileAccess.event_component_fileAccess_new();
	component.FileAccess.event_component_fileAccess_open();
	component.FileAccess.event_component_fileAccess_save();
	component.FileAccess.event_component_fileAccess_close();
}
component.FileAccess.ui = function() {
	var retStr = ["<li class='dropdown'>","<a href='#' class='dropdown-toggle' data-toggle='dropdown'>File</a>","<ul class='dropdown-menu'>","<li class='dropdown-header'>File Management</li>","<li><a onclick='$(document).triggerHandler(\"component_fileAccess_new\");'>New</a></li>","<li><a onclick='$(document).triggerHandler(\"component_fileAccess_open\");'>Open</a></li>","<li><a onclick='$(document).triggerHandler(\"component_fileAccess_save\");'>Save</a></li>","<li><a onclick='$(document).triggerHandler(\"component_fileAccess_close\");'>Close</a></li>","</ul>","</li>"].join("\n");
	new $("#position-navbar").append(retStr);
}
component.FileAccess.event_component_fileAccess_new = function() {
	new $(js.Browser.document).on("component_fileAccess_new",null,function() {
		if(Main.session.get("current_project_xml") == "") console.log("open project first"); else console.log("create a new file");
	});
}
component.FileAccess.event_component_fileAccess_open = function() {
	new $(js.Browser.document).on("component_fileAccess_open",null,function() {
		if(Main.session.get("current_project_xml") == "") console.log("open project first"); else console.log("open a file");
	});
}
component.FileAccess.event_component_fileAccess_save = function() {
	new $(js.Browser.document).on("component_fileAccess_save",null,function() {
		if(Main.session.get("current_project_xml") == "") console.log("open project first"); else console.log("save active file");
	});
}
component.FileAccess.event_component_fileAccess_close = function() {
	new $(js.Browser.document).on("component_fileAccess_close",null,function() {
		if(Main.session.get("current_project_xml") == "") console.log("open project first"); else console.log("close active file");
	});
}
component.ProjectAccess = function() { }
component.ProjectAccess.__name__ = true;
component.ProjectAccess.init = function() {
	component.ProjectAccess.ui();
	component.ProjectAccess.event_component_projectAccess_new();
	component.ProjectAccess.event_component_projectAccess_open();
	component.ProjectAccess.event_component_projectAccess_configure();
	component.ProjectAccess.event_component_projectAccess_close();
}
component.ProjectAccess.ui = function() {
	var retStr = ["<li class='dropdown'>","<a href='#' class='dropdown-toggle' data-toggle='dropdown'>Project</a>","<ul class='dropdown-menu'>","<li class='dropdown-header'>Project Management</li>","<li><a onclick='$(document).triggerHandler(\"component_projectAccess_new\");'>New</a></li>","<li><a onclick='$(document).triggerHandler(\"component_projectAccess_open\");'>Open</a></li>","<li><a onclick='$(document).triggerHandler(\"component_projectAccess_configure\");'>Configure</a></li>","<li><a onclick='$(document).triggerHandler(\"component_projectAccess_close\");'>Close</a></li>","</ul>","</li>"].join("\n");
	new $("#position-navbar").append(retStr);
}
component.ProjectAccess.event_component_projectAccess_new = function() {
	new $(js.Browser.document).on("component_projectAccess_new",null,function() {
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
	});
}
component.ProjectAccess.event_component_projectAccess_open = function() {
	new $(js.Browser.document).on("component_projectAccess_open",null,function() {
		console.log("open a project");
	});
}
component.ProjectAccess.event_component_projectAccess_configure = function() {
	new $(js.Browser.document).on("component_projectAccess_configure",null,function() {
		console.log("configure project");
	});
}
component.ProjectAccess.event_component_projectAccess_close = function() {
	new $(js.Browser.document).on("component_projectAccess_close",null,function() {
		console.log("close project");
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
	get: function(key) {
		return this.h["$" + key];
	}
	,set: function(key,value) {
		this.h["$" + key] = value;
	}
	,__class__: haxe.ds.StringMap
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
