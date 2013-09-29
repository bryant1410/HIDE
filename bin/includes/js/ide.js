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
	Main.initMenu();
	var sample_code = ["import haxe.ds.StringMap.StringMap;","import js.html.File;","import js.Lib;","import jQuery.*;","import component.*;","import ui.menu.EditMenu;","import ui.menu.FileMenu;","import ui.menu.HelpMenu;","import ui.menu.RunMenu;","import ui.menu.SourceMenu;","","class Main {","","\tstatic public var session:Session;","\tstatic public var editors:StringMap<Array<Dynamic>>;","\tstatic public var tabs:Array<String>;","\tstatic public var settings:StringMap<String>;","","\t// the program starts here","\tstatic public function main():Void {","\t\tnew JQuery(function():Void","\t\t\t{","\t\t\t\tinit();","\t\t\t\tinitCorePlugin();","\t\t\t});","\t}","}"].join("\n");
	Main.createTextArea("tab1",sample_code);
	Main.createTextArea("tab2");
	Main.createTextArea("tab3");
	new $("#tabs_position").append("<li><a href=\"#tab1\" data-toggle=\"tab\">Tab1</a></li>");
	new $("#tabs_position").append("<li><a href=\"#tab2\" data-toggle=\"tab\">Tab2</a></li>");
	new $("#tabs_position").append("<li><a href=\"#tab3\" data-toggle=\"tab\">Tab3</a></li>");
	new $(".CodeMirror").css("position","relative");
	new $(".CodeMirror").css("height","100%");
	new $("a[data-toggle=\"tab\"]").on("shown.bs.tab",null,function(e) {
		new $(".CodeMirror").each(function(i,el) {
			el.CodeMirror.refresh();
		});
	});
	new $("#tabs_position li:eq(2) a").tab("show");
}
Main.createTextArea = function(id,code) {
	if(code == null) code = "";
	var editor_str = ["<div class=\"tab-pane\" id=\"" + id + "\">","<textarea id=\"" + id + "_textarea" + "\">" + code + "</textarea>","<script>","CodeMirror.commands.autocomplete = function(cm) {","\tCodeMirror.showHint(cm, CodeMirror.hint.haxe);","};","var editor = CodeMirror.fromTextArea(document.getElementById(\"" + id + "_textarea" + "\"), {","  lineNumbers: true, ","  indentUnit: 4, ","  extraKeys: {\"Ctrl-Space\": \"autocomplete\"}","});","</script>","</div>"].join("\n");
	new $("#tabs_content_position").append(editor_str);
}
Main.initMenu = function() {
	new ui.menu.FileMenu();
	new ui.menu.EditMenu();
	new ui.menu.SourceMenu();
	new ui.menu.RunMenu();
	new ui.menu.HelpMenu();
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
ui.ModalDialog = function() {
	this.title = "";
	this.id = "";
	this.content = "";
	this.ok_text = "";
	this.cancel_text = "";
};
ui.ModalDialog.prototype = {
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
ui.menu.basic = {}
ui.menu.basic.Menu = function(_text,_headerText) {
	this.text = _text;
	this.headerText = _headerText;
	this.items = new Array();
};
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
	,addMenuItem: function(_text,_onClickFunctionName,_onClickFunction) {
		this.items.push(new ui.menu.basic.MenuButtonItem(_text,_onClickFunctionName,_onClickFunction));
	}
}
ui.menu.EditMenu = function() {
	ui.menu.basic.Menu.call(this,"Edit");
	this.createUI();
};
ui.menu.EditMenu.__super__ = ui.menu.basic.Menu;
ui.menu.EditMenu.prototype = $extend(ui.menu.basic.Menu.prototype,{
	createUI: function() {
		this.addMenuItem("Undo","component_undo",null);
		this.addMenuItem("Redo","component_redo",null);
		this.addSeparator();
		this.addMenuItem("Cut","component_cut",null);
		this.addMenuItem("Copy","component_copy",null);
		this.addMenuItem("Paste","component_paste",null);
		this.addMenuItem("Delete","component_delete",null);
		this.addMenuItem("Select All","component_select_all",null);
		this.addSeparator();
		this.addMenuItem("Find...","component_find",null);
		this.addMenuItem("Replace...","component_replace",null);
		this.addToDocument();
	}
});
ui.menu.FileMenu = function() {
	ui.menu.basic.Menu.call(this,"File");
	this.createUI();
};
ui.menu.FileMenu.__super__ = ui.menu.basic.Menu;
ui.menu.FileMenu.prototype = $extend(ui.menu.basic.Menu.prototype,{
	createUI: function() {
		this.addMenuItem("New Project...","component_projectAccess_new",core.ProjectAccess.createNewProject);
		this.addMenuItem("New File...","component_fileAccess_new",core.FileAccess.createNewFile);
		this.addMenuItem("Open Project...","component_projectAccess_open",core.ProjectAccess.openProject);
		this.addMenuItem("Close Project...","component_projectAccess_close",core.ProjectAccess.closeProject);
		this.addSeparator();
		this.addMenuItem("Open File...","component_fileAccess_open",core.FileAccess.openFile);
		this.addMenuItem("Close File","component_fileAccess_close",core.FileAccess.closeActiveFile);
		this.addSeparator();
		this.addMenuItem("Project Properties","component_projectAccess_configure",core.ProjectAccess.configureProject);
		this.addSeparator();
		this.addMenuItem("Save","component_fileAccess_save",core.FileAccess.saveActiveFile);
		this.addMenuItem("Save as...","component_saveAs",null);
		this.addMenuItem("Save all","component_saveAll",null);
		this.addSeparator();
		this.addMenuItem("Exit","component_exit",null);
		this.addToDocument();
	}
});
ui.menu.HelpMenu = function() {
	ui.menu.basic.Menu.call(this,"Help");
	this.createUI();
};
ui.menu.HelpMenu.__super__ = ui.menu.basic.Menu;
ui.menu.HelpMenu.prototype = $extend(ui.menu.basic.Menu.prototype,{
	createUI: function() {
		this.addMenuItem("About","component_about",null);
		this.addToDocument();
	}
});
ui.menu.RunMenu = function() {
	ui.menu.basic.Menu.call(this,"Run");
	this.createUI();
};
ui.menu.RunMenu.__super__ = ui.menu.basic.Menu;
ui.menu.RunMenu.prototype = $extend(ui.menu.basic.Menu.prototype,{
	createUI: function() {
		this.addMenuItem("Run Project","component_run_project",null);
		this.addMenuItem("Build Project","component_build_project",null);
		this.addToDocument();
	}
});
ui.menu.SourceMenu = function() {
	ui.menu.basic.Menu.call(this,"Source");
	this.createUI();
};
ui.menu.SourceMenu.__super__ = ui.menu.basic.Menu;
ui.menu.SourceMenu.prototype = $extend(ui.menu.basic.Menu.prototype,{
	createUI: function() {
		this.addMenuItem("Format","component_format",null);
		this.addMenuItem("Toggle Comment","component_toggle_comment",null);
		this.addToDocument();
	}
});
ui.menu.basic.MenuItem = function() { }
ui.menu.basic.MenuButtonItem = function(_text,_onClickFunctionName,_onClickFunction) {
	this.text = _text;
	this.onClickFunctionName = _onClickFunctionName;
	this.onClickFunction = _onClickFunction;
};
ui.menu.basic.MenuButtonItem.__interfaces__ = [ui.menu.basic.MenuItem];
ui.menu.basic.MenuButtonItem.prototype = {
	registerEvent: function() {
		if(this.onClickFunction != null) new $(js.Browser.document).on(this.onClickFunctionName,null,this.onClickFunction);
	}
	,getCode: function() {
		return "<li><a onclick='$(document).triggerHandler(\"" + this.onClickFunctionName + "\");'>" + this.text + "</a></li>";
	}
}
ui.menu.basic.Separator = function() {
};
ui.menu.basic.Separator.__interfaces__ = [ui.menu.basic.MenuItem];
ui.menu.basic.Separator.prototype = {
	registerEvent: function() {
	}
	,getCode: function() {
		return "<li class=\"divider\"></li>";
	}
}
js.Browser.document = typeof window != "undefined" ? window.document : null;
Main.main();
})();
