package ;

/**
 * ...
 * @author AS3Boyan
 */
class CompilerClient
{

	public function new() 
	{
		var haxeCompilerClient = js.Node.require('child_process').spawn("haxe", ["--connect", "6001", "--cwd", "..","HaxeEditor2.hxml"]);
                
			haxeCompilerClient.stdout.setEncoding('utf8');
			haxeCompilerClient.stdout.on('data', function (data) {
					var str:String = data.toString();
					var lines = str.split("\n");
					trace("OUTPUT: " + lines.join(""));
			});
			
			haxeCompilerClient.stderr.setEncoding('utf8');
			haxeCompilerClient.stderr.on('data', function (data) {
					var str:String = data.toString();
					var lines = str.split("\n");
					trace("ERROR: " + lines.join(""));
			});

			haxeCompilerClient.on('close', function (code) {
					trace('haxeCompilerClient process exit code ' + code);
			});
	}
	
}