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
plugin.misterpah.EditorAce = function() { }
$hxExpose(plugin.misterpah.EditorAce, "plugin.misterpah.EditorAce");
plugin.misterpah.EditorAce.__name__ = true;
plugin.misterpah.EditorAce.main = function() {
	plugin.misterpah.EditorAce.plugin = new haxe.ds.StringMap();
	plugin.misterpah.EditorAce.plugin.set("name","Ace Editor");
	plugin.misterpah.EditorAce.plugin.set("filename","plugin.misterpah.EditorAce.js");
	plugin.misterpah.EditorAce.plugin.set("feature","");
	plugin.misterpah.EditorAce.plugin.set("listen_event","");
	plugin.misterpah.EditorAce.plugin.set("trigger_event","");
	plugin.misterpah.EditorAce.plugin.set("version","0.1");
	plugin.misterpah.EditorAce.plugin.set("required","");
	new $(js.Browser.document).on(plugin.misterpah.EditorAce.plugin.get("filename") + ".init",null,plugin.misterpah.EditorAce.init);
	Utils.register_plugin(plugin.misterpah.EditorAce.plugin);
}
plugin.misterpah.EditorAce.init = function() {
	console.log(plugin.misterpah.EditorAce.plugin.get("filename") + " started");
	Utils.loadJavascript("./plugin/support_files/plugin.misterpah/ace/ace.js");
	Utils.loadCss("./plugin/support_files/plugin.misterpah/ace/css/plugin.misterpah.EditorAce.css");
	plugin.misterpah.EditorAce.create_ui();
	plugin.misterpah.EditorAce.register_hooks();
}
plugin.misterpah.EditorAce.create_ui = function() {
	new $("#editor_position").append("<div style='margin-top:10px;' id='misterpah_editorAce_tabs_position'><ul class='nav nav-tabs'></ul></div>");
	new $("#editor_position").append("<div id='misterpah_editorAce_editor'></div>");
	plugin.misterpah.EditorAce.editor = ace.edit("misterpah_editorAce_editor");
}
plugin.misterpah.EditorAce.register_hooks = function() {
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
plugin.misterpah.EditorAce.main();
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
