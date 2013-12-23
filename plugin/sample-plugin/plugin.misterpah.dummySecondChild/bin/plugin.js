(function () { "use strict";
var plugin = {}
plugin.misterpah = {}
plugin.misterpah.DummySecondChild = function() { }
plugin.misterpah.DummySecondChild.main = function() {
	console.log("this is executed by plugin.misterpah.DummySecondChild");
	console.log(Dummy.externFunction());
}
plugin.misterpah.DummySecondChild.main();
})();
