package ;

/**
 * ...
 * @author 
 */

typedef ShowHintOptions = {
	@:optional var closeCharacters:Dynamic;
	@:optional var completeSingle:Bool;
	@:optional var alignWithWord:Bool;
    @:optional var completionSingle:Bool;
}
 
@:native("CodeMirror")
extern class CodeMirrorStatic
{
	@:overload(function (object:Dynamic, event:String, callback_function:Dynamic):Void {})
	static function on(event:String, callback_function:Dynamic):Void;
	static function showHint(cm:CodeMirror, getHints:Dynamic, ?options:ShowHintOptions):Void;
	static function attachContextInfo(cm:CodeMirror, data:Dynamic):Void;
}