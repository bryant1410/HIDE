(function () { "use strict";
var IMap = function() { }
IMap.__name__ = true;
var Std = function() { }
Std.__name__ = true;
Std.string = function(s) {
	return js.Boot.__string_rec(s,"");
}
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
js.Boot.__string_rec = function(o,s) {
	if(o == null) return "null";
	if(s.length >= 5) return "<...>";
	var t = typeof(o);
	if(t == "function" && (o.__name__ || o.__ename__)) t = "object";
	switch(t) {
	case "object":
		if(o instanceof Array) {
			if(o.__enum__) {
				if(o.length == 2) return o[0];
				var str = o[0] + "(";
				s += "\t";
				var _g1 = 2, _g = o.length;
				while(_g1 < _g) {
					var i = _g1++;
					if(i != 2) str += "," + js.Boot.__string_rec(o[i],s); else str += js.Boot.__string_rec(o[i],s);
				}
				return str + ")";
			}
			var l = o.length;
			var i;
			var str = "[";
			s += "\t";
			var _g = 0;
			while(_g < l) {
				var i1 = _g++;
				str += (i1 > 0?",":"") + js.Boot.__string_rec(o[i1],s);
			}
			str += "]";
			return str;
		}
		var tostr;
		try {
			tostr = o.toString;
		} catch( e ) {
			return "???";
		}
		if(tostr != null && tostr != Object.toString) {
			var s2 = o.toString();
			if(s2 != "[object Object]") return s2;
		}
		var k = null;
		var str = "{\n";
		s += "\t";
		var hasp = o.hasOwnProperty != null;
		for( var k in o ) { ;
		if(hasp && !o.hasOwnProperty(k)) {
			continue;
		}
		if(k == "prototype" || k == "__class__" || k == "__super__" || k == "__interfaces__" || k == "__properties__") {
			continue;
		}
		if(str.length != 2) str += ", \n";
		str += s + k + " : " + js.Boot.__string_rec(o[k],s);
		}
		s = s.substring(1);
		str += "\n" + s + "}";
		return str;
	case "function":
		return "<function>";
	case "string":
		return o;
	default:
		return String(o);
	}
}
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
	plugin.misterpah.ProjectAccess.registered_type = new Array();
	plugin.misterpah.ProjectAccess.create_ui();
	plugin.misterpah.ProjectAccess.register_hooks();
}
plugin.misterpah.ProjectAccess.create_ui = function() {
}
plugin.misterpah.ProjectAccess.register_hooks = function() {
	new $(js.Browser.document).on("core_project_newProject",null,plugin.misterpah.ProjectAccess.new_project_ui);
	new $(js.Browser.document).on("core_project_registerNewTypeProject",null,plugin.misterpah.ProjectAccess.registerNewType);
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
plugin.misterpah.ProjectAccess.registerNewType = function(event,data) {
	plugin.misterpah.ProjectAccess.registered_type.push(data);
}
plugin.misterpah.ProjectAccess.new_project_ui = function() {
	console.log("haha");
	var retStr = "";
	retStr += "<div class=\"row\">";
	var _g1 = 0, _g = plugin.misterpah.ProjectAccess.registered_type.length;
	while(_g1 < _g) {
		var each = _g1++;
		var cur = plugin.misterpah.ProjectAccess.registered_type[each];
		console.log(cur.get("plugin_name"));
		retStr += ["<div class=\"col-xs-2\">","<label>","<img width=64 class=\"img-rounded\" src=\"" + cur.get("plugin_image") + "\" />","<p class=\"text-center\"><input type=\"radio\" name=\"NewProject_radio\" value=\"" + cur.get("plugin_name") + "\" /><br/>" + cur.get("plugin_name") + "</p>","</label>","</div>"].join("\n");
	}
	retStr += "</div>";
	var radio_plugin_name = new Array();
	var _g1 = 0, _g = plugin.misterpah.ProjectAccess.registered_type.length;
	while(_g1 < _g) {
		var each = _g1++;
		var cur = plugin.misterpah.ProjectAccess.registered_type[each];
		retStr += ["<div id=\"radio_" + cur.get("plugin_name") + "\" style=\"display:none;\">","<h2>" + cur.get("plugin_name") + "</h2>","<p>" + cur.get("plugin_description") + "</p>","<p><b>Help:</b> " + cur.get("plugin_help") + "</p>","<p><b>This will execute:</b> " + cur.get("plugin_execute") + "</p>","<p><b>With optional parameter:</b> <input style=\"width:100%;\" id=\"optional_" + cur.get("plugin_name") + "\" value=\"" + cur.get("plugin_extraParam") + "\" /></p>","</div>"].join("\n");
		radio_plugin_name.push("radio_" + cur.get("plugin_name"));
	}
	retStr += "<br/>";
	retStr += "<button style=\"display:none;\" id=\"NewProject_submit\" type=\"button\" class=\"btn btn-primary btn-lg btn-block\">Create Project</button>";
	var dialog = new ui.ModalDialog();
	dialog.title = "New Project";
	dialog.id = "new_project_modal_id";
	dialog.content = retStr;
	dialog.header = true;
	dialog.footer = false;
	dialog.show();
	new $("input[name='NewProject_radio']").on("click",null,function() {
		new $("#NewProject_submit").css("display","block");
		var _g1 = 0, _g = radio_plugin_name.length;
		while(_g1 < _g) {
			var each = _g1++;
			new $("#" + radio_plugin_name[each]).css("display","none");
		}
		var selected = new $("input[name='NewProject_radio']:checked").val();
		new $("#radio_" + Std.string(selected)).css("display","block");
	});
	new $("#NewProject_submit").on("click",null,function() {
		var selected = new $("input[name='NewProject_radio']:checked").val();
		var _g1 = 0, _g = plugin.misterpah.ProjectAccess.registered_type.length;
		while(_g1 < _g) {
			var each = _g1++;
			var cur = plugin.misterpah.ProjectAccess.registered_type[each];
			if(selected == cur.get("plugin_name")) {
				var execute = cur.get("plugin_execute");
				var optional = new $("#optional_" + Std.string(cur.get("plugin_name"))).val();
				Utils.system_create_project(Std.string(execute) + " " + Std.string(optional));
				dialog.hide();
			}
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
