(function () { "use strict";
var plugin = {}
plugin.misterpah = {}
plugin.misterpah.A = function() { }
$hxExpose(plugin.misterpah.A, "plugin.misterpah.A");
plugin.misterpah.A.main = function() {
	console.log("this is executed by plugin.misterpah.A");
}
plugin.misterpah.A.externFunction = function() {
	return "plugin.misterpah.A - this is a Function exposed to other plugin through Extern";
}
plugin.misterpah.A.main();
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
