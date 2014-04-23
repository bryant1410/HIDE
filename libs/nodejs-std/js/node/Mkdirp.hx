package js.node;
import js.Node;

/**
 * ...
 * @author AS3Boyan
 */
class Mkdirp
{
	static var mkdirp:Dynamic;
	
	static function __init__() : Void untyped {
		mkdirp = Node.require('mkdirp');
	}
	
	@:overload(function (dir:String, cb:Dynamic->String->Void):Void 
	{
		mkdirp(dir, cb);
	})
	public static function mkdirp(dir:String, mode:Int, cb:Dynamic->String->Void):Void 
	{
		mkdirp(dir, mode, cb);
	}
	
	public static function mkdirpSync(dir:String, ?mode:Int):String 
	{
		return mkdirp.sync(dir, mode);
	}
	
}