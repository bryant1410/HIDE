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
plugin.sample = {}
plugin.sample.Dummy = function() { }
$hxExpose(plugin.sample.Dummy, "plugin.sample.Dummy");
plugin.sample.Dummy.__name__ = true;
plugin.sample.Dummy.main = function() {
	plugin.sample.Dummy.plugin = new haxe.ds.StringMap();
	plugin.sample.Dummy.plugin.set("name","Dummy Plugin");
	plugin.sample.Dummy.plugin.set("filename","plugin.sample.Dummy.js");
	plugin.sample.Dummy.plugin.set("feature","");
	plugin.sample.Dummy.plugin.set("listen_event","");
	plugin.sample.Dummy.plugin.set("trigger_event","");
	plugin.sample.Dummy.plugin.set("version","0.1");
	plugin.sample.Dummy.plugin.set("required","");
	new $(js.Browser.document).on(plugin.sample.Dummy.plugin.get("filename") + ".init",null,plugin.sample.Dummy.init);
	Utils.register_plugin(plugin.sample.Dummy.plugin);
}
plugin.sample.Dummy.init = function() {
	console.log(plugin.sample.Dummy.plugin.get("filename") + " started");
	plugin.sample.Dummy.create_ui();
	plugin.sample.Dummy.register_hooks();
}
plugin.sample.Dummy.create_ui = function() {
}
plugin.sample.Dummy.register_hooks = function() {
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
plugin.sample.Dummy.main();
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
