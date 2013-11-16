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
plugin.misterpah.BuildHxml = function() { }
$hxExpose(plugin.misterpah.BuildHxml, "plugin.misterpah.BuildHxml");
plugin.misterpah.BuildHxml.__name__ = true;
plugin.misterpah.BuildHxml.main = function() {
	plugin.misterpah.BuildHxml.plugin = new haxe.ds.StringMap();
	plugin.misterpah.BuildHxml.plugin.set("name","Build HXML");
	plugin.misterpah.BuildHxml.plugin.set("filename","plugin.misterpah.BuildHxml.js");
	plugin.misterpah.BuildHxml.plugin.set("feature","Build HXML");
	plugin.misterpah.BuildHxml.plugin.set("listen_event","plugin_misterpah_BuildHxml");
	plugin.misterpah.BuildHxml.plugin.set("trigger_event","plugin_misterpah_BuildHxml");
	plugin.misterpah.BuildHxml.plugin.set("version","0.1");
	plugin.misterpah.BuildHxml.plugin.set("required","");
	new $(js.Browser.document).on(plugin.misterpah.BuildHxml.plugin.get("filename") + ".init",null,plugin.misterpah.BuildHxml.init);
	Utils.register_plugin(plugin.misterpah.BuildHxml.plugin);
}
plugin.misterpah.BuildHxml.init = function() {
	console.log(plugin.misterpah.BuildHxml.plugin.get("filename") + " started");
	plugin.misterpah.BuildHxml.create_ui();
	plugin.misterpah.BuildHxml.register_hooks();
}
plugin.misterpah.BuildHxml.create_ui = function() {
	Main.compilemenu.addMenuItem("to Project configuration","plugin_misterpah_BuildHxml",null,"F8");
}
plugin.misterpah.BuildHxml.register_hooks = function() {
	new $(js.Browser.document).on("plugin_misterpah_BuildHxml",null,plugin.misterpah.BuildHxml.hook_BuildHxml);
	js.Browser.window.addEventListener("keyup",function(e) {
		if(e.keyCode == 119) plugin.misterpah.BuildHxml.hook_BuildHxml("","");
	});
}
plugin.misterpah.BuildHxml.hook_BuildHxml = function(event,data) {
	var filename = Main.session.project_xml;
	var filename_split = filename.split(".");
	var ext = filename_split.pop();
	var join_str = "";
	var join_str_cd = "";
	if(ext == "hxml") {
		console.log("hxml");
		if(Utils.getOS() == Utils.LINUX) {
			join_str = " ; ";
			join_str_cd = "";
		}
		if(Utils.getOS() == Utils.WINDOWS) {
			join_str = " & ";
			join_str_cd = " /D ";
		}
		var exec_str = "cd " + join_str_cd + Main.session.project_folder + join_str + "haxe " + filename;
		Utils.exec(exec_str,function(error,stdout,stderr) {
			console.log(error);
			console.log(stdout);
			console.log(stderr);
		});
	} else {
		console.log("BuildHxml plugin only build HXML Project.");
		if(ext == "") {
			var notify = new ui.Notify();
			notify.type = "error";
			notify.content = "No project loaded !";
			notify.show();
		} else {
			var notify = new ui.Notify();
			notify.type = "error";
			notify.content = "BuildHxml plugin only build HXML Project.";
			notify.show();
		}
	}
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
js.Browser.window = typeof window != "undefined" ? window : null;
js.Browser.document = typeof window != "undefined" ? window.document : null;
plugin.misterpah.BuildHxml.main();
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
