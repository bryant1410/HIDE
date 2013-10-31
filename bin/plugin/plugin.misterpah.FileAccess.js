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
plugin.misterpah.FileAccess = function() { }
$hxExpose(plugin.misterpah.FileAccess, "plugin.misterpah.FileAccess");
plugin.misterpah.FileAccess.__name__ = true;
plugin.misterpah.FileAccess.main = function() {
	plugin.misterpah.FileAccess.plugin = new haxe.ds.StringMap();
	plugin.misterpah.FileAccess.plugin.set("name","Misterpah FileAccess");
	plugin.misterpah.FileAccess.plugin.set("filename","plugin.misterpah.FileAccess.js");
	plugin.misterpah.FileAccess.plugin.set("feature","New File,Open File,Save File,Close File");
	plugin.misterpah.FileAccess.plugin.set("listen_event","core_file_newFile,core_file_openFile,core_file_save,core_file_close");
	plugin.misterpah.FileAccess.plugin.set("trigger_event","plugin_misterpah_fileAccess_openFile_complete,plugin_misterpah_fileAccess_closeFile_complete");
	plugin.misterpah.FileAccess.plugin.set("version","0.1");
	plugin.misterpah.FileAccess.plugin.set("required","");
	new $(js.Browser.document).on(plugin.misterpah.FileAccess.plugin.get("filename") + ".init",null,plugin.misterpah.FileAccess.init);
	Utils.register_plugin(plugin.misterpah.FileAccess.plugin);
}
plugin.misterpah.FileAccess.init = function() {
	console.log(plugin.misterpah.FileAccess.plugin.get("filename") + " started");
	plugin.misterpah.FileAccess.create_ui();
	plugin.misterpah.FileAccess.register_hooks();
}
plugin.misterpah.FileAccess.create_ui = function() {
}
plugin.misterpah.FileAccess.register_hooks = function() {
	new $(js.Browser.document).on("core_file_newFile",null,plugin.misterpah.FileAccess.new_file);
	new $(js.Browser.document).on("core_file_openFile",null,plugin.misterpah.FileAccess.open_file);
	new $(js.Browser.document).on("core_file_save",null,plugin.misterpah.FileAccess.save_file);
	new $(js.Browser.document).on("core_file_close",null,plugin.misterpah.FileAccess.close_file);
	new $(js.Browser.document).on("plugin_misterpah_fileAccess_open_file_handler",null,plugin.misterpah.FileAccess.openFileHandler);
}
plugin.misterpah.FileAccess.new_file = function() {
	console.log("new_file bebeh");
}
plugin.misterpah.FileAccess.open_file = function() {
	var filedialog = new ui.FileDialog("plugin_misterpah_fileAccess_open_file_handler");
}
plugin.misterpah.FileAccess.openFileHandler = function(event,path) {
	console.log(path);
	console.log(Main.file_stack.find(path));
	var find = Main.file_stack.find(path);
	if(find[0] == "null" || find[0] == "not found") {
		var content = Utils.system_openFile(path);
		var filename_split = path.split(Utils.path.sep);
		var className = filename_split[filename_split.length - 1].split(".")[0];
		Main.file_stack.add(path,content,className);
		Main.session.active_file = path;
		new $(js.Browser.document).triggerHandler("core_file_openFile_complete");
	}
}
plugin.misterpah.FileAccess.save_file = function() {
	var path = Main.session.active_file;
	var file_obj = Main.file_stack.find(path);
	Utils.system_saveFile(path,file_obj[1]);
}
plugin.misterpah.FileAccess.close_file = function() {
	var path = Main.session.active_file;
	Main.file_stack.remove(path);
	new $(js.Browser.document).triggerHandler("core_file_closeFile_complete");
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
plugin.misterpah.FileAccess.main();
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
