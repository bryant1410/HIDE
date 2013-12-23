(function () { "use strict";
var plugin = {}
plugin.misterpah = {}
plugin.misterpah.Dummy = function() { }
plugin.misterpah.Dummy.main = function() {
	console.log("this is executed by plugin.misterpah.Dummy");
}
plugin.misterpah.Dummy.main();
})();
