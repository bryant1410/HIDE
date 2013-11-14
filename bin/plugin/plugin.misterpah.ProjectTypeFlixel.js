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
plugin.misterpah.ProjectTypeFlixel = function() { }
$hxExpose(plugin.misterpah.ProjectTypeFlixel, "plugin.misterpah.ProjectTypeFlixel");
plugin.misterpah.ProjectTypeFlixel.__name__ = true;
plugin.misterpah.ProjectTypeFlixel.main = function() {
	plugin.misterpah.ProjectTypeFlixel.plugin = new haxe.ds.StringMap();
	plugin.misterpah.ProjectTypeFlixel.plugin.set("name","Project Type Flixel");
	plugin.misterpah.ProjectTypeFlixel.plugin.set("filename","plugin.misterpah.ProjectTypeFlixel.js");
	plugin.misterpah.ProjectTypeFlixel.plugin.set("feature","");
	plugin.misterpah.ProjectTypeFlixel.plugin.set("listen_event","");
	plugin.misterpah.ProjectTypeFlixel.plugin.set("trigger_event","core_project_registerNewTypeProject");
	plugin.misterpah.ProjectTypeFlixel.plugin.set("version","0.1");
	plugin.misterpah.ProjectTypeFlixel.plugin.set("required","");
	new $(js.Browser.document).on(plugin.misterpah.ProjectTypeFlixel.plugin.get("filename") + ".init",null,plugin.misterpah.ProjectTypeFlixel.init);
	Utils.register_plugin(plugin.misterpah.ProjectTypeFlixel.plugin);
}
plugin.misterpah.ProjectTypeFlixel.init = function() {
	console.log(plugin.misterpah.ProjectTypeFlixel.plugin.get("filename") + " started");
	plugin.misterpah.ProjectTypeFlixel.create_ui();
	plugin.misterpah.ProjectTypeFlixel.register_hooks();
}
plugin.misterpah.ProjectTypeFlixel.create_ui = function() {
}
plugin.misterpah.ProjectTypeFlixel.register_hooks = function() {
	var parameter = new haxe.ds.StringMap();
	parameter.set("plugin_name","Flixel");
	parameter.set("plugin_description","HaxeFlixel is a 2D game framework built with OpenFL and Haxe that delivers cross platform games, completely free for personal and commercial use.");
	parameter.set("plugin_help","change <i>project_name</i> in <b>optional parameter</b> to your project name.");
	parameter.set("plugin_image","./plugin/support_files/plugin.misterpah/img/flixel.png");
	parameter.set("plugin_execute","haxelib run flixel new");
	parameter.set("plugin_extraParam","-name project_name");
	var parameter_wrap = new Array();
	parameter_wrap.push(parameter);
	new $(js.Browser.document).triggerHandler("core_project_registerNewTypeProject",parameter_wrap);
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
plugin.misterpah.ProjectTypeFlixel.main();
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
