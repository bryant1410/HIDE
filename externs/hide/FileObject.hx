package ;


@:native('Utils') extern class FileObject
{
	private var file_stack:Array<Dynamic>;
	// array[0] = path
	// array[1] = content
	// array[2] = className

	public function new():Void;
	public function add(path:String,content:String,className:String):Void;
	public function find(path:String):Array<String>;
	public function update_content(path:String,new_content:String):Void;
	public function remove(path:String):Void;
}