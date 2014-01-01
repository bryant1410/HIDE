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
plugin.misterpah.HaxeCheck = function() { }
$hxExpose(plugin.misterpah.HaxeCheck, "plugin.misterpah.HaxeCheck");
plugin.misterpah.HaxeCheck.__name__ = true;
plugin.misterpah.HaxeCheck.main = function() {
	plugin.misterpah.HaxeCheck.register_listener();
	plugin.misterpah.HaxeCheck.check_haxe();
}
plugin.misterpah.HaxeCheck.register_listener = function() {
	Main.message.listen("plugin.misterpah.HaxeCheck:versionCheck.complete","plugin.misterpah.HaxeCheck",plugin.misterpah.HaxeCheck.versionCheck_complete,null);
}
plugin.misterpah.HaxeCheck.versionCheck_complete = function() {
	var version_split = plugin.misterpah.HaxeCheck.haxe_version.split(".");
	if(version_split[0] == "3") {
	} else {
		console.log("old version of Haxe is installed");
		alert("please upgrade your Haxe. Download it at http://haxe.org/download");
	}
}
plugin.misterpah.HaxeCheck.check_haxe = function() {
	Utils.exec("haxe -version",function(err,stdout,stderr) {
		if(err == null) {
			plugin.misterpah.HaxeCheck.haxe_version = stderr;
			Main.message.broadcast("plugin.misterpah.HaxeCheck:versionCheck.complete","plugin.misterpah.HaxeCheck");
		} else alert("Haxe isn't available on this computer OR there's something wrong with your installation. Please download & re-install Haxe version 3. You may download it at http://haxe.org/download");
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
plugin.misterpah.HaxeCheck.main();
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
