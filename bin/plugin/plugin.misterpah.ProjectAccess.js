(function () { "use strict";
var IMap = function() { }
IMap.__name__ = true;
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
var plugin = {}
plugin.misterpah = {}
plugin.misterpah.ProjectAccess = function() { }
$hxExpose(plugin.misterpah.ProjectAccess, "plugin.misterpah.ProjectAccess");
plugin.misterpah.ProjectAccess.__name__ = true;
plugin.misterpah.ProjectAccess.main = function() {
	plugin.misterpah.ProjectAccess.plugin = new haxe.ds.StringMap();
	plugin.misterpah.ProjectAccess.plugin.set("name","Project Access");
	plugin.misterpah.ProjectAccess.plugin.set("filename","plugin.misterpah.ProjectAccess.js");
	plugin.misterpah.ProjectAccess.plugin.set("feature","Open Project, Close Project");
	plugin.misterpah.ProjectAccess.plugin.set("listen_event","core_project_openProject,core_project_closeProject");
	plugin.misterpah.ProjectAccess.plugin.set("trigger_event","");
	plugin.misterpah.ProjectAccess.plugin.set("version","0.1");
	plugin.misterpah.ProjectAccess.plugin.set("required","");
	new $(js.Browser.document).on(plugin.misterpah.ProjectAccess.plugin.get("filename") + ".init",null,plugin.misterpah.ProjectAccess.init);
	Utils.register_plugin(plugin.misterpah.ProjectAccess.plugin);
}
plugin.misterpah.ProjectAccess.init = function() {
	console.log(plugin.misterpah.ProjectAccess.plugin.get("filename") + " started");
	plugin.misterpah.ProjectAccess.create_ui();
	plugin.misterpah.ProjectAccess.register_hooks();
}
plugin.misterpah.ProjectAccess.create_ui = function() {
}
plugin.misterpah.ProjectAccess.register_hooks = function() {
	new $(js.Browser.document).on("core_project_openProject",null,plugin.misterpah.ProjectAccess.open_project);
	new $(js.Browser.document).on("core_project_closeProject",null,plugin.misterpah.ProjectAccess.close_project);
	new $(js.Browser.document).on("plugin_misterpah_projectAccess_openProject_handler",null,plugin.misterpah.ProjectAccess.openFileHandler);
}
plugin.misterpah.ProjectAccess.open_project = function() {
	new ui.FileDialog("plugin_misterpah_projectAccess_openProject_handler");
}
plugin.misterpah.ProjectAccess.openFileHandler = function(event,path) {
	Main.session.project_xml = path;
	Utils.system_parse_project();
	console.log(Main.session);
	new $(js.Browser.document).triggerHandler("core_project_openProject_complete");
}
plugin.misterpah.ProjectAccess.close_project = function() {
	Main.session.project_xml = "";
	Main.session.project_folder = "";
	Main.session.project_xml_parameter = "";
	new $(js.Browser.document).triggerHandler("core_project_closeProject_complete");
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
