package js.node;
import js.Node;

/**
 * ...
 * @author AS3Boyan
 */
class Mkdirp
{
	static var _mkdirp:Dynamic;
	
	static function __init__() : Void untyped {
		_mkdirp = Node.require('mkdirp');
	}
	
	@:overload(function (dir:String, cb:Dynamic->String->Void):Void { } )
	
	public static function mkdirp(dir:String, mode:Int, cb:Dynamic->String->Void):Void 
	{
		if (cb == null) 
		{
			_mkdirp(dir, mode);
		}
		else 
		{
			_mkdirp(dir, mode, cb);
		}
	}
	
	public static function mkdirpSync(dir:String, ?mode:Int):String 
	{
		return _mkdirp.sync(dir, mode);
	}
	
}