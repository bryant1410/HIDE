package ;

/**
 * ...
 * @author ...
 */
class CompletionServer
{

	public function new() 
	{
		var haxeCompletionServer = js.Node.require('child_process').spawn("haxe", ["--wait", "6001"]);

		haxeCompletionServer.stderr.setEncoding('utf8');
		haxeCompletionServer.stderr.on('data', function (data) {
			var str:String = data.toString();
			var lines = str.split("\n");
			trace("ERROR: " + lines.join(""));
		});
		
		haxeCompletionServer.on('close', function (code) {
			trace('haxeCompletionServer process exit code ' + code);
		});
	}
	
}