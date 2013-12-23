(function () { "use strict";
var Session = function() { }
$hxExpose(Session, "Session");
Session.__name__ = true;
Session.prototype = {
	__class__: Session
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
var plugin = {}
plugin.misterpah = {}
plugin.misterpah.ProjectAccess = function() { }
$hxExpose(plugin.misterpah.ProjectAccess, "plugin.misterpah.ProjectAccess");
plugin.misterpah.ProjectAccess.__name__ = true;
plugin.misterpah.ProjectAccess.main = function() {
	plugin.misterpah.ProjectAccess.register_listener();
}
plugin.misterpah.ProjectAccess.register_listener = function() {
	Main.message.listen("core:FileMenu.openProject","plugin.misterpah.ProjectAccess",plugin.misterpah.ProjectAccess.open_project,null);
	Main.message.listen("core:FileMenu.closeProject","plugin.misterpah.ProjectAccess",plugin.misterpah.ProjectAccess.close_project,null);
}
plugin.misterpah.ProjectAccess.open_project = function() {
	var filedialog = new ui.FileDialog();
	filedialog.show(plugin.misterpah.ProjectAccess.openProjectHandler);
}
plugin.misterpah.ProjectAccess.openProjectHandler = function(path,newFile) {
	if(newFile == null) newFile = false;
	Main.session.project_xml = path;
	Utils.system_parse_project();
	Main.message.broadcast("plugin.misterpah.ProjectAccess:open_project().complete","plugin.misterpah.ProjectAccess");
}
plugin.misterpah.ProjectAccess.close_project = function() {
	Main.session.project_xml = "";
	Main.session.project_folder = "";
	Main.session.project_xml_parameter = "";
	Main.message.broadcast("plugin.misterpah.ProjectAccess:close_project().complete","plugin.misterpah.ProjectAccess");
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
plugin.misterpah.ProjectAccess.main();
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
