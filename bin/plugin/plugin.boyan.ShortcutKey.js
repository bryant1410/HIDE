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
plugin.boyan = {}
plugin.boyan.ShortcutKey = function() { }
$hxExpose(plugin.boyan.ShortcutKey, "plugin.boyan.ShortcutKey");
plugin.boyan.ShortcutKey.__name__ = true;
plugin.boyan.ShortcutKey.main = function() {
	plugin.boyan.ShortcutKey.plugin = new haxe.ds.StringMap();
	plugin.boyan.ShortcutKey.plugin.set("name","Shortcut Key");
	plugin.boyan.ShortcutKey.plugin.set("filename","plugin.boyan.ShortcutKey.js");
	plugin.boyan.ShortcutKey.plugin.set("feature","");
	plugin.boyan.ShortcutKey.plugin.set("listen_event","");
	plugin.boyan.ShortcutKey.plugin.set("trigger_event","");
	plugin.boyan.ShortcutKey.plugin.set("version","0.1");
	plugin.boyan.ShortcutKey.plugin.set("required","");
	new $(js.Browser.document).on(plugin.boyan.ShortcutKey.plugin.get("filename") + ".init",null,plugin.boyan.ShortcutKey.init);
	Utils.register_plugin(plugin.boyan.ShortcutKey.plugin);
}
plugin.boyan.ShortcutKey.init = function() {
	console.log(plugin.boyan.ShortcutKey.plugin.get("filename") + " started");
	plugin.boyan.ShortcutKey.create_ui();
	plugin.boyan.ShortcutKey.register_hooks();
}
plugin.boyan.ShortcutKey.create_ui = function() {
}
plugin.boyan.ShortcutKey.register_hooks = function() {
	js.Browser.window.addEventListener("keyup",function(e) {
		if(e.ctrlKey) {
			if(!e.shiftKey) switch(e.keyCode) {
			case 79:
				new $(js.Browser.document).triggerHandler("core_file_openFile");
				break;
			case 83:
				new $(js.Browser.document).triggerHandler("core_file_save");
				break;
			case 78:
				new $(js.Browser.document).triggerHandler("core_file_newFile");
				break;
			default:
			} else switch(e.keyCode) {
			case 48:
				break;
			case 189:
				break;
			case 187:
				break;
			case 9:
				break;
			case 79:
				new $(js.Browser.document).triggerHandler("core_project_openProject");
				break;
			case 83:
				break;
			case 84:
				break;
			case 78:
				break;
			case 82:
				break;
			default:
			}
		} else if(e.keyCode == 13 && e.shiftKey && e.altKey) {
		} else if(e.keyCode == 116) {
		} else if(e.keyCode == 119) {
		}
	});
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
plugin.boyan.ShortcutKey.main();
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
