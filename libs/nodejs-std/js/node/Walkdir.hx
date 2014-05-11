package js.node;
import js.Node;
import js.node.Walkdir.EventEmitter;

/**
 * ...
 * @author AS3Boyan
 */

extern class EventEmitter
{
	function on(event:String, fn:Dynamic):Void;
}

typedef AsyncOptions =
{
	@:optional var no_recurse:Bool;
    @:optional var follow_symlinks:Bool;
    @:optional var max_depth:Dynamic;
}
    
typedef SyncOptions =
{
    // if true the sync return will be in {path:stat} format instead of [path,path,...]
	@:optional var return_object:Bool;
    
    // if true null will be returned and no array or object will be created with found paths. useful for large listings
    @:optional var no_return:Bool;
}
 
@:native("Walkdir")
class Walkdir
{
	static var walkdir:Dynamic;
	
	static function __init__() : Void untyped {
		walkdir = Node.require('walkdir');
	}	
	
	public static function walk(path:String, options:AsyncOptions, ?onItem:String->NodeStat->Void):EventEmitter
	{
		var emitter:EventEmitter;
		
		if (onItem != null) 
		{
            emitter = walkdir(path, options, onItem);
		}
		else 
		{
			emitter = walkdir(path, options);
		}
		
		return emitter;
	}
    
    public static function walkSync(path:String, ?options:SyncOptions, ?onItem:String->NodeStat->Void):Array<String>
    {
        var result:Array<String>;
        
        if (options != null) 
		{
			result = walkdir.sync(path, options, onItem);
		}
		else 
		{
			result = walkdir.sync(path, onItem);
		}
        
        return result;
    }
}