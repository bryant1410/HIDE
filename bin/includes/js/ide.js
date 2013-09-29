(function () { "use strict";
function $extend(from, fields) {
	function inherit() {}; inherit.prototype = from; var proto = new inherit();
	for (var name in fields) proto[name] = fields[name];
	if( fields.toString !== Object.prototype.toString ) proto.toString = fields.toString;
	return proto;
}
var _Either = {}
_Either.Either_Impl_ = function() { }
var Main = function() { }
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
	new ui.menu.FileMenu();
	new ui.menu.ProjectMenu();
}
var IMap = function() { }
var Session = function() {
	this.current_active_file = "";
	this.current_project_folder = "";
	this.current_project_xml = "";
};
var core = {}
core.FileAccess = function() { }
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
haxe.ds.StringMap.__interfaces__ = [IMap];
var js = {}
js.Browser = function() { }
var ui = {}
ui.Modal = function() {
	this.title = "";
	this.id = "";
	this.content = "";
	this.ok_text = "";
	this.cancel_text = "";
};
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
}
ui.Notify = function() {
	this.type = "";
	this.content = "";
};
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
}
ui.menu = {}
ui.menu.Menu = function(_text,_headerText) {
	this.text = _text;
	this.headerText = _headerText;
	this.items = new Array();
};
ui.menu.Menu.prototype = {
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
			this.items.pop();
		}
		this.items = null;
		this.headerText = null;
		this.text = null;
	}
	,addMenuItem: function(_text,_onClickFunction) {
		this.items.push(new ui.menu.MenuItem(_text,_onClickFunction));
	}
}
ui.menu.FileMenu = function() {
	ui.menu.Menu.call(this,"File","File Management");
	this.createUI();
	this.registerEvents();
};
ui.menu.FileMenu.__super__ = ui.menu.Menu;
ui.menu.FileMenu.prototype = $extend(ui.menu.Menu.prototype,{
	registerEvents: function() {
		new $(js.Browser.document).on("component_fileAccess_new",null,core.FileAccess.createNewFile);
		new $(js.Browser.document).on("component_fileAccess_open",null,core.FileAccess.openFile);
		new $(js.Browser.document).on("component_fileAccess_save",null,core.FileAccess.saveActiveFile);
		new $(js.Browser.document).on("component_fileAccess_close",null,core.FileAccess.closeActiveFile);
	}
	,createUI: function() {
		this.addMenuItem("New","component_fileAccess_new");
		this.addMenuItem("Open","component_fileAccess_open");
		this.addMenuItem("Save","component_fileAccess_save");
		this.addMenuItem("Close","component_fileAccess_close");
		this.addToDocument();
	}
});
ui.menu.MenuItem = function(_text,_onClickFunction) {
	this.text = _text;
	this.onClickFunction = _onClickFunction;
};
ui.menu.MenuItem.prototype = {
	getCode: function() {
		return "<li><a onclick='$(document).triggerHandler(\"" + this.onClickFunction + "\");'>" + this.text + "</a></li>";
	}
}
ui.menu.ProjectMenu = function() {
	ui.menu.Menu.call(this,"Project","Project Management");
	this.createUI();
	this.registerEvents();
};
ui.menu.ProjectMenu.__super__ = ui.menu.Menu;
ui.menu.ProjectMenu.prototype = $extend(ui.menu.Menu.prototype,{
	registerEvents: function() {
		new $(js.Browser.document).on("component_projectAccess_new",null,core.ProjectAccess.createNewProject);
		new $(js.Browser.document).on("component_projectAccess_open",null,core.ProjectAccess.openProject);
		new $(js.Browser.document).on("component_projectAccess_configure",null,core.ProjectAccess.configureProject);
		new $(js.Browser.document).on("component_projectAccess_close",null,core.ProjectAccess.closeProject);
	}
	,createUI: function() {
		this.addMenuItem("New","component_projectAccess_new");
		this.addMenuItem("Open","component_projectAccess_open");
		this.addMenuItem("Configure","component_projectAccess_configure");
		this.addMenuItem("Close","component_projectAccess_close");
		this.addToDocument();
	}
});
js.Browser.document = typeof window != "undefined" ? window.document : null;
Main.main();
})();
