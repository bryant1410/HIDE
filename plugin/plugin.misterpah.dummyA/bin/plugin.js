(function () { "use strict";
var plugin = {}
plugin.misterpah = {}
plugin.misterpah.DummyA = function() { }
plugin.misterpah.DummyA.main = function() {
	console.log("this is executed by plugin.misterpah.DummyA");
}
plugin.misterpah.DummyA.main();
})();
