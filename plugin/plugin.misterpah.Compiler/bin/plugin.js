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
plugin.misterpah.Compiler = function() { }
$hxExpose(plugin.misterpah.Compiler, "plugin.misterpah.Compiler");
plugin.misterpah.Compiler.__name__ = true;
plugin.misterpah.Compiler.main = function() {
	plugin.misterpah.Compiler.register_listener();
}
plugin.misterpah.Compiler.register_listener = function() {
	Main.message.listen("plugin.misterpah.ProjectTree:compile_Hxml","plugin.misterpah.Compiler",plugin.misterpah.Compiler.compile_native_hxml,null);
	Main.message.listen("plugin.misterpah.ProjectTree:compile_Flash","plugin.misterpah.Compiler",plugin.misterpah.Compiler.compile_flash_lime,null);
}
plugin.misterpah.Compiler.compile_native_hxml = function() {
	console.log("compiling to Native (Hxml)");
	var exec_str = "";
	if(Utils.getOS() == Utils.WINDOWS) exec_str = "cd /D " + Main.session.project_folder + " & haxe " + Main.session.project_xml;
	if(Utils.getOS() == Utils.LINUX) exec_str = "cd " + Main.session.project_folder + " ; haxe " + Main.session.project_xml;
	Utils.exec(exec_str,function(error,stdout,stderr) {
		if(stderr != "") {
			localStorage.showError = "true";
			localStorage.compile_error_status = stdout;
			localStorage.compile_error_error = stderr;
			Utils.gui.Window.open("./console/console.html",{ title : "HIDE console", position : "center", toolbar : false, focus : true});
		}
		if(stderr == "") localStorage.showError = "false";
		console.log(error);
		console.log(stdout);
		console.log(stderr);
	});
}
plugin.misterpah.Compiler.compile_flash_lime = function() {
	console.log("compiling to Flash (Lime)");
	var exec_str = "";
	if(Utils.getOS() == Utils.WINDOWS) exec_str = "cd /D " + Main.session.project_folder + " & lime test flash";
	if(Utils.getOS() == Utils.LINUX) exec_str = "cd " + Main.session.project_folder + " ; lime test flash";
	Utils.exec(exec_str,function(error,stdout,stderr) {
		if(stderr != "") {
			localStorage.showError = "true";
			localStorage.compile_error_status = stdout;
			localStorage.compile_error_error = stderr;
			Utils.gui.Window.open("./console/console.html",{ title : "HIDE console", position : "center", toolbar : false, focus : true});
		}
		if(stderr == "") localStorage.showError = "false";
		console.log(error);
		console.log(stdout);
		console.log(stderr);
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
plugin.misterpah.Compiler.main();
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
