(function () { "use strict";
var plugin = {}
plugin.misterpah = {}
plugin.misterpah.DummySecond = function() { }
plugin.misterpah.DummySecond.main = function() {
	console.log("this is executed by plugin.misterpah.DummySecond");
	console.log(Dummy.externFunction());
}
plugin.misterpah.DummySecond.main();
})();
