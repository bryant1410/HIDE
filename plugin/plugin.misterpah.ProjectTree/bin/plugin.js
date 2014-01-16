(function () { "use strict";
var Session = function() { }
$hxExpose(Session, "Session");
Session.__name__ = ["Session"];
Session.prototype = {
	__class__: Session
}
var Type = function() { }
Type.__name__ = ["Type"];
Type.getClassName = function(c) {
	var a = c.__name__;
	return a.join(".");
}
var js = {}
js.Boot = function() { }
js.Boot.__name__ = ["js","Boot"];
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
plugin.misterpah.ProjectTree = function() { }
$hxExpose(plugin.misterpah.ProjectTree, "plugin.misterpah.ProjectTree");
plugin.misterpah.ProjectTree.__name__ = ["plugin","misterpah","ProjectTree"];
plugin.misterpah.ProjectTree.main = function() {
	plugin.misterpah.ProjectTree.init();
	plugin.misterpah.ProjectTree.register_listener();
}
plugin.misterpah.ProjectTree.init = function() {
	var path = "../plugin/" + Type.getClassName(plugin.misterpah.ProjectTree) + "/bin";
	Utils.loadJavascript(path + "/sidr/jquery.sidr.min.js");
	Utils.loadCss(path + "/sidr/stylesheets/jquery.sidr.dark.css");
}
plugin.misterpah.ProjectTree.register_listener = function() {
	Main.message.listen("plugin.misterpah.ProjectAccess:open_project.complete","plugin.misterpah.ProjectTree",plugin.misterpah.ProjectTree.open_tree,null);
	Main.message.listen("plugin.misterpah.ProjectAccess:close_project.complete","plugin.misterpah.ProjectTree",plugin.misterpah.ProjectTree.close_tree,null);
}
plugin.misterpah.ProjectTree.projectTree_openFolder = function(folder_to_open,relativeToCurrentFolder) {
	if(relativeToCurrentFolder == null) relativeToCurrentFolder = true;
	if(relativeToCurrentFolder == false) {
		var path_content = plugin.misterpah.ProjectTree.scan_folder(folder_to_open);
		new $("#sidr-projectTree").append("<div style='background:#2154ac;margin:10px;border:none;' class='well'></div>");
		var _g = 0;
		while(_g < path_content.length) {
			var each = path_content[_g];
			++_g;
			var filename = each[0];
			var isFile = each[1];
			if(isFile == true) {
				var currentFile = sessionStorage.projectTreeCurrentFolder + Utils.path.sep + each[0];
				currentFile = Utils.repair_path(currentFile);
				new $("#sidr-projectTree .well").append("<a href='#' style='color:#eaf1fe;font-weight:bold;' onclick='plugin.misterpah.FileAccess.openFileHandler(\"" + currentFile + "\")'>" + filename + "</a><br/>");
			} else new $("#sidr-projectTree .well").append("<a href='#' onclick='plugin.misterpah.ProjectTree.projectTree_openFolder(\"" + filename + "\")'>[" + filename + "]</a><br/>");
		}
	} else {
	}
}
plugin.misterpah.ProjectTree.compile_message = function() {
	var target = $("#ProjectTree_compileTarget").val();
	Main.message.broadcast("plugin.misterpah.ProjectTree:compile_" + target,"plugin.misterpah.ProjectTree");
}
plugin.misterpah.ProjectTree.open_tree = function() {
	console.log("open tree");
	$("body").prepend("<div id=\"sidr\"></div>");
	$("#sidr").append("<div id=\"sidr-projectControl\"></div>");
	$("#sidr").append("<div id=\"sidr-projectTree\"></div>");
	sessionStorage.projectTreeCurrentFolder = Main.session.project_folder;
	plugin.misterpah.ProjectTree.projectTree_openFolder(Main.session.project_folder,false);
	var compileTo = ["<style>#sidr-projectControl select {background: #2154ac;color:#ffffff;border:1px solid #ffffff;}</style>","<div style=\"margin:10px;color:#ffffff;background:#2154ac;border:0px;\" class=\"well\">","<div style=\"padding-left:0px;padding-right:0px;padding-top:4px;\" class=\"col-xs-4\">","Target :","</div>","<div style=\"padding-left:0px;padding-right:0px\" class=\"col-xs-8\">","<select id=\"ProjectTree_compileTarget\">","<option>Hxml</option>","<option>Flash</option>","</select>","</div>","<button type=\"button\" onclick=\"plugin.misterpah.ProjectTree.compile_message();\" class=\"btn btn-default btn-block\">Compile</button>","<div style=\"clear:both\"></div>","</div>"].join("\n");
	$("#sidr-projectControl").append(compileTo);
	$("body").append("<a id=\"simple-menu\" class=\"tiny button secondary radius\" style=\"display:none;\" href=\"#sidr\">Simple menu</a>");
	$("body").append("<style>.active-navbar-header{background:#abc}</style>");
	$(".navbar-brand").attr("href","#sidr");
	$(".navbar-brand").attr("id","simple-menu");
	$(".navbar-brand").html("<span id=\"project-tree-icon\" class=\"glyphicon glyphicon-th-list\"></span> HIDE");
	$("#simple-menu").sidr({ onOpen : function() {
		console.log("open");
		$(".navbar-default").css("border-left","1px solid #397ff6");
		$(".sidr").css("border-top","1px solid #e7e7e7");
		$(".sidr").css("background","#397ff6");
		$(".sidr").css("box-shadow","none");
		$("#project-tree-icon").css("color","#ffffff");
		$(".navbar-header").css("background","#397ff6");
		$(".navbar-header a").css("color","#ffffff");
	}, onClose : function() {
		console.log("close");
		$(".navbar-default").css("border-left","1px solid #e7e7e7");
		$("#project-tree-icon").css("color","rgb(119,119,119)");
		$(".navbar-header").css("background","none");
		$(".navbar-header a").css("color","rgb(119,119,119)");
	}});
	$.sidr("open","sidr",function() {
	});
}
plugin.misterpah.ProjectTree.close_tree = function() {
	$.sidr("close","sidr",function() {
	});
	$(".navbar-header").html("<a class=\"navbar-brand\">HIDE</a>");
	console.log("close tree");
}
plugin.misterpah.ProjectTree.scan_folder = function(scan_path) {
	var path = Utils.repair_path(scan_path);
	var path_content = Utils.fs.readdirSync(path);
	var path_content_folder = new Array();
	var _g = 0;
	while(_g < path_content.length) {
		var each = path_content[_g];
		++_g;
		var is_file = Utils.fs.statSync(path + Utils.path.sep + each).isFile();
		path_content_folder.push([each,is_file]);
	}
	return path_content_folder;
}
String.prototype.__class__ = String;
String.__name__ = ["String"];
Array.prototype.__class__ = Array;
Array.__name__ = ["Array"];
var Int = { __name__ : ["Int"]};
var Dynamic = { __name__ : ["Dynamic"]};
var Float = Number;
Float.__name__ = ["Float"];
var Bool = Boolean;
Bool.__ename__ = ["Bool"];
var Class = { __name__ : ["Class"]};
var Enum = { };
plugin.misterpah.ProjectTree.main();
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
